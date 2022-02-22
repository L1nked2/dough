"""
Module firebase_db
  a module for initiating & uploading on Firebase firestore(DB) and stroage(CDN)

Classes
  DB_and_CDN

Functions
  convert_documents_and_upload_to_db
  update_cluster
"""

from email.mime import image
import firebase_admin
from firebase_admin import credentials
from google.cloud.firestore_v1 import transaction
from google.oauth2 import service_account
from firebase_admin import firestore
import boto3 #from google.cloud import storage
import os 
import dill, pickle
import requests

from firebase_document import PlaceDocument, StationDocument

"""
FireStore(DB)
|_ collection 1 (place_db)
   |_ document 1  (00000001) ... corresp. to one place 
      (JSON file)
      |_ field 1 (place_category : "음식점")  
      |_ field 2 (place_cluster_a : "2")
   |_ document 2
   |_ document 3 
|_ collection 2 (station_db)
   |_ document 1 ... corresp. to one station
|_ collection 3 (user_db)
   |_ document 1 ... corresp. to one user
|_ collection 4 (post_db)

Storage(CDN)
"""
class DB_and_CDN:
    """
    initialize interfaces to Firebase DB and CDN with credentials.
    """
    def __init__(self, 
        certificate_file='./service-account.json',
        naver_cloud_secret_key_file='./naver_cloud_secret_key'
        ):

        # create credentials and intialize firebase_admin
        firebase_cred = credentials.Certificate(certificate_file)
        firebase_admin.initialize_app(
            credential=firebase_cred,
            options = {'projectId': 'dough-survey', }
        )
        google_cred = service_account.Credentials.from_service_account_file(certificate_file)
        
        # create interfaces to DB
        self._db = firestore.client() # client for interacting DB (= firestore)
        self._db_transaction = self._db.transaction() # interface to transaction that uses this client(DB)
        
        # create references to collections under DB
        self._db_place_collection = self._db.collection('place_db')
        self._db_station_collection = self._db.collection('station_db')
        self._db_user_collection = self._db.collection('user_db')
        self._db_post_collection = self._db.collection('post_db')

        # create interfaces to NaverCloud CDN
        service_name = 's3'
        endpoint_url = 'https://kr.object.ncloudstorage.com'
        access_key = 'Eh08eVeDmki73GchREuJ'
        secret_key = open(naver_cloud_secret_key_file).read().rstrip("\n")
        self._cdn = boto3.client(service_name, endpoint_url=endpoint_url, 
            aws_access_key_id=access_key, aws_secret_access_key=secret_key)
        self._bucket_name = "dough-test-bucket"
        self._cdn_root_url = f"https://kr.object.ncloudstorage.com/{self._bucket_name}/"

        # info about station_db
        self._MAX_NUM_PLACES_PER_STATION_AND_CATEGORY = 300 # e.g. at most 300 places for "강남역 맛집"
        self._MAX_NUM_PLACES_PER_STATION_DOC = 50 # for one station document, at most 50 places in place_list
        self._NUM_STATION_DOCS_PER_STATION_AND_CATEGORY = \
            int (self._MAX_NUM_PLACES_PER_STATION_AND_CATEGORY / self._MAX_NUM_PLACES_PER_STATION_DOC )
            # e.g. 300/50 = 6 documents for "강남역 맛집", 강남역uuid_rest_0 , ... 강남역uuid_rest_5

    """
    Each station's `place_list` will be
        divided into `num_station_docs_per_station_category = 6` * 3(rest/cafe/bar) documents, each documents having at most 50 elements in place_list
    station_db
      |_ uuid 
    into
    station_db
      |_ uuid_rest_0
      ...
      |_ uuid_rest_5
      |_ uuid_cafe_0
      ...
      |_ uuid_cafe_5
      |_ uuid_bar_0
      ...
      |_ uuid_bar_5
    """
    def upload_station(self, doc : StationDocument):
        for category in ["rest", "cafe", "bar"]:
            for idx in range(self._NUM_STATION_DOCS_PER_STATION_AND_CATEGORY):
                doc_name = f"{doc.get_uuid()}_{category}_{idx}" # e.g. 264a887-4b2b_rest_2
                self._db_station_collection.document(doc_name).set(doc.into_dict())
    

    """
    upload new Document to collection.
    (1) by default, all fields in dictionary directly to JSON
    but for Naver links to photos, upload it on CDN & store CDN link to DB.
    
    (2) if the uuid of Document already exists in the collection,
        do not upload the document but just update parent_station info in DB
    """
    def upload_place(self, place_doc : PlaceDocument, current_parent_station : StationDocument):
        assert place_doc.has_converted, "place document must be converted before uploaded to db"
        same_place_docs = list(self._db_place_collection.
                            where('place_uuid', '==', place_doc.get_uuid()).stream())
        
        assert len(same_place_docs) == 0 or len(same_place_docs) == 1, \
            "document for one place must not exist or only one exists"
        
        if len(same_place_docs) == 1: # document for current place already exists 
                                      # -> update parent_station_list
            place_doc_ref = same_place_docs[0].reference
            DB_and_CDN._add_parent_station(self._db_transaction, 
                place_doc_ref, current_parent_station)
        else: # no document for current place on placedb -> create new one & upload photos
            self._upload_photos_and_replace_link(place_doc)
            self._db_place_collection.document(place_doc.get_uuid()).set(place_doc.into_dict())

    """
    transaction of
        Read current parent list -> append new parent -> Update parent list
    """
    @firestore.transactional
    def _add_parent_station(transaction, place_doc_ref, current_parent_station : StationDocument):
        snapshot = place_doc_ref.get(transaction=transaction)
        parent_station_list = snapshot.get("parent_station_list")
        new_parent_name = current_parent_station._name
        
        # update only if new parent name is not included in original ones
        if new_parent_name not in parent_station_list:
            parent_station_list.append(new_parent_name)
            transaction.update(reference=place_doc_ref, field_updates={
                "parent_station_list" : parent_station_list
            })


    """
    for Naver links to photos, upload it on CDN & store CDN link to DB
    """
    def _upload_photos_and_replace_link(self, place_doc : PlaceDocument):
        
        place_id = place_doc._uuid
        """
        input : (naver_link, local_path)
        outout : (naver_link, CDN_link)
         |_ will be changed later
        """
        place_doc._main_photo_list = [(naver_link, self._upload_photo_and_return_CDN_link(place_id, naver_link, local_path))
            for naver_link, local_path in place_doc._main_photo_list]
        place_doc._provided_photo_list = [(naver_link, self._upload_photo_and_return_CDN_link(place_id, naver_link, local_path))
            for naver_link, local_path in place_doc._provided_photo_list]
        place_doc._food_photo_list = [(naver_link, self._upload_photo_and_return_CDN_link(place_id, naver_link, local_path))
            for naver_link, local_path in place_doc._food_photo_list]
        place_doc._inside_photo_list = [(naver_link, self._upload_photo_and_return_CDN_link(place_id, naver_link, local_path))
            for naver_link, local_path in place_doc._inside_photo_list]
        place_doc._menu_photo_list = [(naver_link, self._upload_photo_and_return_CDN_link(place_id, naver_link, local_path))
            for naver_link, local_path in place_doc._menu_photo_list]

    """
    upload photo with either local_path or naver_link and return the link of CDN
    # input : 00b7a056-d99d-b47e, "https:// ..." , "./temp_img/505e7ffc-dd02-5ade-bc1d-4704a86e2385/f2.jpg"
    # output : CDN link
    """
    def _upload_photo_and_return_CDN_link(self, place_id : str, naver_link : str, 
        photo_local_path : str):
        # 0. path to store on CDN
        photo_file_name = photo_local_path.split("/")[-1] # e.g. f2.jpg
        assert photo_file_name.endswith(".jpg")
     
        # try to open the file on local path
        filename_to_upload = photo_local_path
        
        # early-crawled cases : local image paths in raw_db is 
        # stored as "/media/k/DB/DIR_FOR_CRAWLING/temp_img/...", 
        # not "/media/k/DIR_FORCRAWLING/temp_img/..."
        # so we need to deal with it.
        if filename_to_upload.startswith("/media/k/DB/"):
            filename_to_upload = filename_to_upload.replace("/media/k/DB", "/media/k", 1)

        # download it again from naver
        if not os.path.exists(filename_to_upload):
            with open(filename_to_upload, 'wb+') as f:
                response = requests.get(naver_link)
                f.write(response.content)

        # upload the photo on CDN and return CDN link
        image_file_object_name = f'{place_id}/{photo_file_name}'
        self._cdn.upload_file(filename_to_upload, self._bucket_name, image_file_object_name, 
            ExtraArgs={'ACL': 'public-read'})
        CDN_link = self._cdn_root_url + image_file_object_name

        return CDN_link


    """
    update `station_db`'s each station's `place_list` field with `place_db` info.
    by sending a query to firestore s.t.
    parent_station_list contains current station then collect ...
    """
    """
    is read-then-write, but chose to not use transaction,
    because (1) it is likely that only single user will write at a time
    (2) happening write during this function does not matter that much 
    """
    """
    place_list will be divided into 6 * 3(rest/cafe/bar) documents, each documents having at most 50 elements in place_list
                                                                                |_ 50 elements if place_document has only naver links, but 25 if place_document has both naver & cdn links
    station_db
      |_ uuid 
    into
    station_db
      |_ uuid_rest_0
      ...
      |_ uuid_rest_5
      |_ uuid_cafe_0
      ...
      |_ uuid_cafe_5
      |_ uuid_bar_0
      ...
      |_ uuid_bar_5
    """
    def update_station_db(self, station_id_names : list[tuple[str, str]]):
        for station_uuid, station_name in station_id_names:
            for category_kor, category_eng in [("음식점", "rest"), ("카페", "cafe"), ("술집", "bar")]:

                docs_with_parent_as_current_station = self._db_place_collection \
                    .where('parent_station_list', 'array_contains', station_name) \
                    .where('place_category', '==', category_kor) \
                    .stream()
                place_docs = [doc.to_dict() for doc in docs_with_parent_as_current_station]

                for idx in range(self._NUM_STATION_DOCS_PER_STATION_AND_CATEGORY):
                    divided_place_docs = place_docs[self._MAX_NUM_PLACES_PER_STATION_DOC * idx : self._MAX_NUM_PLACES_PER_STATION_DOC * (idx+1)]
                    assert len(divided_place_docs) <= self._MAX_NUM_PLACES_PER_STATION_DOC
                    station_doc_name = f"{station_uuid}_{category_eng}_{idx}" # e.g. 264a887-4b2b_rest_2
                    self._db_station_collection.document(station_doc_name).update({'place_list' : divided_place_docs})

    """
    update place cluster.
    """
    def update_place_cluster(self, place_uuid : str, assigned_cluster : int):
        doc_ref = self._db_place_collection.document(place_uuid)
        doc = doc_ref.get()
        if doc.exists:
            doc_ref.update({'place_cluster_a' : assigned_cluster})
        else:
            print(f"no document with name {place_uuid} exists in place_db")


def convert_documents_and_upload_to_db(stations_to_upload : str, db_dir_path: str,  photo_dir_path : str, category_to_tag_table_dir_path : str):
    
    db_cdn = DB_and_CDN()
    station_id_names : list[tuple[str, str]] = list() # will store [(station_uid, station_name), ...]
 
    place_uuids_in_photo_dir = os.listdir(photo_dir_path)

    for station_category in stations_to_upload:
        # e.g. 강남역_맛집, 뚝섬역_술집
        station_category_dumped = os.path.join(db_dir_path, station_category)
        print(station_category_dumped)
        raw_station_dict, place_dict_list = dill.load(open(station_category_dumped, "rb"))

        station_docu = StationDocument(raw_station_dict)
        db_cdn.upload_station(station_docu)       
        station_id_names.append((station_docu._uuid, station_docu._name)) 

        for place_dict in place_dict_list:
            place_docu = PlaceDocument(place_dict)
            print(place_docu._name)
            # since crawling and convert&uploading phase can be executed separately,
            # there might be a case where photo_dir is inconsistent with loaded raw_db data
            if place_docu.has_photo_folder(place_uuids_in_photo_dir):
                place_docu.convert_with(category_to_tag_table_dir_path)
                db_cdn.upload_place(place_docu, station_docu)

    db_cdn.update_station_db(station_id_names)

def update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly(stations, db_dir_path):
    db_cdn = DB_and_CDN()
    station_id_names : list[tuple[str, str]] = list() # will store [(station_uid, station_name), ...]

    for station_category in stations:
        # e.g. 강남역_맛집, 뚝섬역_술집
        station_category_dumped = os.path.join(db_dir_path, station_category)
        print(station_category_dumped)
        raw_station_dict, _ = dill.load(open(station_category_dumped, "rb"))

        station_docu = StationDocument(raw_station_dict)    
        db_cdn.upload_station(station_docu)     
        station_id_names.append((station_docu._uuid, station_docu._name)) 

    db_cdn.update_station_db(station_id_names)



def update_cluster(cluster_result_path : str):    
    db_cdn = DB_and_CDN()
    cluster_result: dict[str, int] = pickle.load(open(cluster_result_path, 'rb'))
    
    for place_uuid in cluster_result:
        assigned_cluster = cluster_result[place_uuid]
        print(place_uuid)
        db_cdn.update_place_cluster(place_uuid, assigned_cluster)
