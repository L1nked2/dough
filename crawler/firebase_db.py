"""
Module firebase_db
  a module for initiating & uploading on Firebase firestore(DB) and stroage(CDN)

Classes
  DB_and_CDN

Functions
  convert_documents_and_upload_to_db
"""

import firebase_admin
from firebase_admin import credentials
from google.cloud.firestore_v1 import transaction
from google.oauth2 import service_account
from firebase_admin import firestore
from google.cloud import storage
import os 
import dill

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
        bucket_root_url='dough-survey.appspot.com',
        certificate_file='./service-account.json'):

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

        # create interfaces to CDN
        self._cdn = storage.Client(credentials=google_cred) # CDN (= storage)
        self._bucket_root_url = bucket_root_url
        self._cdn_root_url = f'https://storage.googleapis.com/{bucket_root_url}/'


    def upload_station(self, doc : StationDocument):
        self._db_station_collection.document(doc.get_uuid()).set(doc.into_dict())
    

    """
    upload new Document to collection.
    (1) by default, all fields in dictionary directly to JSON
    but for Naver links to photos, upload it on CDN & store CDN link to DB.
    
    (2) if the uuid of Document already exists in the collection,
        do not upload the document but just update parent_station info in DB
    """
    def upload_place(self, place_doc : PlaceDocument, current_parent_station : StationDocument,
        photo_dir_path : str):
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
            self._db_place_collection.document(place_doc.get_uuid()).set(place_doc.into_dict())
            # self._upload_photos(place_doc, photo_dir_path)

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
    def _upload_photos(self, place_doc : PlaceDocument, photo_dir_path : str):
        raise NotImplementedError
        # e.g. "./temp_img/505e7ffc-dd02-5ade-bc1d-4704a86e2385/" 
        photos_of_current_place_path = os.path.join(photo_dir_path, self._uuid)
        place_id = place_doc._uuid

        """
        Explanation:
            photo links in [food_photo_list, inside_photo_list, provided_photo_list, menu_photo_list]
            were stored in order to download the photo from Naver before uploading to CDN.
            But I(안해찬) has found out that it is not necessary,
            as we already have photos at local inside `photo_dir_path`.

            Therefore, for food/inside/provided/menu/main links in `PlaceDocument` class 
            are actually useless.
            Currently, they're use to get the number of photos of each kind.
        """
        
        # # food, inside, provided
        # for entry in os.listdir(photos_of_current_place_path):
        #     file_path = os.path.join(photos_of_current_place_path, entry)
        #     if not os.path.isfile(file_path):
        #         continue
            
        #     if entry.endswith(".jpg") and (entry.startswith("f") or
        #     entry.startswith("i") or entry.startswith("a")):
        #         self._upload_photo(place_id, file_path)

        # # main
        # for entry in os.listdir(os.path.join(photos_of_current_place_path, "/"))
        # # menu


    # , 00b7a056-d99d-b47e, "./temp_img/505e7ffc-dd02-5ade-bc1d-4704a86e2385/f2.jpg" 
    def _upload_photo(self, place_id : str, photo_path : str):
        raise NotImplementedError
        # path_to_load_from_local = photos_of_current_place_path
        # if photo_kind == "food":
        #     path_to_load_from_local += f"f{photo_idx}.jpg"
        # elif photo_kind == "inside":
        #     path_to_load_from_local += f"i{photo_idx}.jpg"
        # elif photo_kind == "provided":
        #     path_to_load_from_local += f"a{photo_idx}.jpg"
        # elif photo_kind == "menu":
        #     path_to_load_from_local += f"menu/{photo_idx}.jpg"
        # elif photo_kind == "main":
        #     if photo_idx == 0:
        #         path_to_load_from_local += f""

        # path_to_store_on_CDN = \
        #     f'restaurant_images/{place_id}/{photo_kind}_{photo_idx}.jpg'


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
    def update_station_db(self, station_id_names : list[tuple[str, str]]):
        for station_uuid, station_name in station_id_names:
            docs_with_parent_as_current_station = self._db_place_collection. \
                where('parent_station_list', 'array_contains', station_name).stream()
            place_uuids = [doc.id for doc in docs_with_parent_as_current_station]
            self._db_station_collection.document(station_uuid).update({'place_list' : place_uuids})



############################# To support picked old_raw_db ###########################################
from firestore_lib import DB
"""
Why do we need to use this?

(1) the already-cralwed data in `old_raw_db` (previously named `raw_db`)
    contains dumped data of class `DB` of `firestore_lib.py`.

(2) But we're not using `firestore_lib.py` anymore, thus no `DB` class. 
    Crawler in `dough_crawler` not stores the data about place with dictionary type, instead of `DB` class.

(3) Thus, in order to load crawled data in `old_raw_db`, we need to bring back `DB` class of `firestore_lib.py`

(4) After 22-01-04 (Tue), we'll crawl from the beginning with current cralwer, and will deprecate `old_raw_db`.
    This code section is only necessary until 22-01-04 (Tue).
"""
# stored data = [self.station_info : dict, self.place_db_list : list of DB, self.place_uuid_dict : list]
def process_loaded_old_DB_info(old_data_body):
    station_dict = old_data_body[0]
    place_db_list: list[DB] = old_data_body[1]
    _ = old_data_body[2]

    def place_db_to_dict(place_db : DB) -> dict:
        raw_dict = place_db._data
        # match with current dict structure
        raw_dict["place_likes"] = 0
        raw_dict["place_recent_views"] = 0
        raw_dict["place_main_photo_list"] = []
        raw_dict["place_provided_photo_list"] = raw_dict["place_photo_provided"]
        raw_dict["place_food_photo_list"] = raw_dict["place_photo_food"]
        raw_dict["place_inside_photo_list"] = raw_dict["place_photo_inside"]
        raw_dict["place_menu_photo_list"] = raw_dict["place_photo_menu"]
        raw_dict["place_menu_info"] = raw_dict["place_menu"]
        raw_dict["parent_station_list"] = raw_dict["parent_stations"]
        return raw_dict

    place_dict_list = [place_db_to_dict(db) for db in place_db_list]

    return station_dict, place_dict_list

######################################################################################################


def convert_documents_and_upload_to_db(raw_db_path : str, photo_dir_path : str,
    category_to_tag_table_dir_path : str):
    
    db_cdn = DB_and_CDN()
    station_id_names : list[tuple[str, str]] = list() # will store [(station_uid, station_name), ...]
 
    for entry in os.listdir(raw_db_path):
        filename = os.path.join(raw_db_path, entry)
        if not os.path.isfile(filename): continue

        # e.g. 강남역_맛집, 뚝섬역_술집
        station_category_dumped = filename 
        print(station_category_dumped)
        # 강남역 info + all (맛집)places near 강남역 infos
        ############################# To support picked old_raw_db ###########################################
        raw_station_dict, place_dict_list = process_loaded_old_DB_info(dill.load(open(station_category_dumped, "rb")))
        ###################################################################################################### 
        # raw_station_dict, place_dict_list = dill.load(open(station_category_dumped, "rb"))
        ###################################################################################################### 

        station_docu = StationDocument(raw_station_dict)
        db_cdn.upload_station(station_docu)       
        station_id_names.append((station_docu._uuid, station_docu._name)) 

        for place_dict in place_dict_list:
            place_docu = PlaceDocument(place_dict)
            # if no photo folder in `temp_img` (or `ml_learning_data` or whatsoever), 
            # do not upload on CDN          
            if place_docu.has_photo_folder(photo_dir_path):
                place_docu.convert_with(category_to_tag_table_dir_path, photo_dir_path)
                db_cdn.upload_place(place_docu, station_docu, photo_dir_path)

    db_cdn.update_station_db(station_id_names)