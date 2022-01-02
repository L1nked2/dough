"""
Module firebase_db
  a module for initiating & uploading on Firebase firestore(DB) and stroage(CDN)

Classes
  DB_and_CDN
  |_ Public Methods
      DB_and_CDN, upload

Functions
  convert_documents_and_upload_to_db
"""

import firebase_admin
from firebase_admin import credentials
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
        self._db_station_collection.document(doc._uuid).set(doc.into_dict())
    

    """
    upload new Document to collection.
    (1) by default, all fields in dictionary directly to JSON
    but for Naver links to photos, upload it on CDN & store CDN link to DB.
    
    (2) if the uuid of Document already exists in the collection,
        do not upload the document but just update parent_station info in DB
    """
    def upload_place(self, document : PlaceDocument):
        # if not document.has_converted: assert "must upload converted place"
        raise NotImplementedError


    """
    for Naver links to photos, upload it on CDN & store CDN link to DB
    """
    def _upload_photos():
        raise NotImplementedError


    """
    transaction for uploading?
    |_ transaction : useful when you want to update a field's value based on its current value or value of some other field
    *** need to find out when trasactions are necessary.
    *** just 'add' exists according to https://firebase.google.com/docs/firestore/manage-data/add-data
    """
    # @firestore.transactional
    # def upload_transaction():
    #     raise NotImplementedError


    """
    update `station_db`'s each station's `place_list` field with `place_db` info.
    by sending a query to firestore s.t.
    parent_station_list contains current station then collect ...
    """
    def update_station_db(self):
        raise NotImplementedError


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


def convert_documents_and_upload_to_db(path_to_raw_db : str):
    db_cdn = DB_and_CDN()

    for entry in os.listdir(path_to_raw_db):
        filename = os.path.join(path_to_raw_db, entry)
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

        continue

        for place_dict in place_dict_list:
            place_docu = PlaceDocument(place_dict)
            # if no photo folder in `temp_img` (or `ml_learning_data` or whatsoever), 
            # do not upload on CDN          
            if place_docu.has_photo_folder():
                place_docu.convert_with()
                db_cdn.upload_place(place_docu)

    # db_cdn.update_station_db()