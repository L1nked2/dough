"""
Module firebase_db
  a module for initiating & uploading on Firebase firestore(DB) and stroage(CDN)

Classes
  DB
  |_ Public Methods
      DB, upload

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
class DB:
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
        self._cdn = storage.Client(credentials=credentials) # CDN (= storage)
        self._bucket_root_url = bucket_root_url
        self._cdn_root_url = f'https://storage.googleapis.com/{bucket_root_url}/'

    def upload_station(self, document : StationDocument):
        raise NotImplementedError
    
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
    def update_station_db():
        raise NotImplemented

def convert_documents_and_upload_to_db(path_to_raw_db : str):
    db = DB()

    for entry in os.listdir(path_to_raw_db):
        filename = os.path.join(path_to_raw_db, entry)
        if not os.path.isfile(filename): continue

        # e.g. 강남역_맛집, 뚝섬역_술집
        station_category_dumped = filename 
        # 강남역 info + all (맛집)places near 강남역 infos
        raw_station_dict, place_dict_list = dill.load(open(station_category_dumped))
        
        station_docu = StationDocument(raw_station_dict)
        db.upload_station(station_docu)        

        for place_dict in place_dict_list:
            place_docu = PlaceDocument(place_dict)
            # if no photo folder in `temp_img` (or `ml_learning_data` or whatsoever), 
            # do not upload on CDN          
            if place_docu.has_photo_folder():
                place_docu.convert_with()
                db.upload_place(place_docu)

    db.update_station_db()