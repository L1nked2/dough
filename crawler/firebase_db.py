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

from firebase_document import Document

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
        self.__db = firestore.client() # client for interacting DB (= firestore)
        self.__db_transaction = self.__firebase_db.transaction() # interface to transaction that uses this client(DB)
        
        # create references to collections under DB
        self.__db_place_collection = self.__db.collection('place_db')
        self.__db_station_collection = self.__db.collection('station_db')
        self.__db_user_collection = self.__db.collection('user_db')
        self.__db_post_collection = self.__db.collection('post_db')

        # create interfaces to CDN
        self.__cdn = storage.Client(credentials=credentials) # CDN (= storage)
        self.__bucket_root_url = bucket_root_url
        self.__cdn_root_url = f'https://storage.googleapis.com/{bucket_root_url}/'

    """
    upload new Document to collection.
    (1) by default, all fields in dictionary directly to JSON
    but for Naver links to photos, upload it on CDN & store CDN link to DB.
    
    (2) if the uuid of Document already exists in the collection,
        do not upload the document but just update parent_station info in DB
    """
    def upload(self, document : Document):
        raise NotImplementedError

    """
    for Naver links to photos, upload it on CDN & store CDN link to DB
    """
    def __upload_photos():
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

def convert_documents_and_upload_to_db(raw_db_from_crawling : str):
    # 1. open dumped raw_db with `dill`
    
    # 2. for all dict in raw_db, make it into `Document` and do converting

    # 2. init `DB` instance

    # 3. upload `Document`s to `DB`
    
    raise NotImplementedError