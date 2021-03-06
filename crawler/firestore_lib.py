import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud import storage
from google.oauth2 import service_account
import uuid
import requests

bucket_root_url = 'dough-survey.appspot.com'
cdn_root_url = 'https://storage.googleapis.com/dough-survey.appspot.com/'

# Use the application default credentials
cred = credentials.Certificate('./service-account.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'dough-survey',
})
credentials = service_account.Credentials.from_service_account_file(
    './service-account.json')
firebase_cloud_storage = storage.Client(credentials=credentials)
firebase_db = firestore.client()
firebase_transaction = firebase_db.transaction()
place_ref = firebase_db.collection('place_db')

# data types and key-value pairs
place_db_empty = dict(
    place_name=None,
    place_uuid=None,
    place_road_address=None,
    place_legacy_address=None,
    place_category=None,
    place_cluster_a=None,
    place_cluster_b=None,
    place_operating_time=None,
    place_kind=None,
    place_menu=[],
    place_naver_link=None,
    place_photo_provided=[],
    place_photo_inside=[],
    place_photo_food=[],
    place_photo_menu=[],
    place_photo_inside_main_src=None,
    place_photo_food_main_src_1=None,
    place_photo_food_main_src_2=None,
    place_telephone=None,
    place_last_timestamp=None,
    parent_stations=None,
    place_coor_x=None,
    place_coor_y=None,
    place_views=0,
)

place_db_thumb_empty = dict(
    place_name=None,
    place_uuid=None,
    place_category=None,
    place_kind=None,
    place_cluster_a=None,
    place_cluster_b=None,
    place_cluster_c=None,
    place_photo_inside_main_src=None,
    place_photo_food_main_src_1=None,
    place_photo_food_main_src_2=None,
    place_telephone=None,
    parent_station=None,
    distance_to_station=None,
    place_views=0,
)

station_db_empty = dict(
    place_thumb_list=[],
    station_name=None,
    station_coor_x=None,
    station_coor_y=None,
    station_views=0,
)


class DB:
    def __init__(self, init_list=None, **kwargs):
        """
        make new database using given init_list
        data is stored to _data: dictionary

        :param init_list: dictionary
        :return: None
        """
        self.parent_station = None
        self.kind_filled = False
        self.img_selected = False
        self.img_transform = False
        self.cluster_filled = False
        self._data = dict()
        if init_list is not None:
            for key, value in init_list.items():
                self._data[key] = value

        # update for attributes
        self.__dict__.update((k, v) for k, v in kwargs.items())
        return

    def add_pair(self, key, value):
        if key in self._data:
            raise NameError
        else:
            self._data[key] = value
        return

    def update_pair(self, key, value):
        if not (key in self._data):
            raise AttributeError
        else:
            self._data[key] = value
        return

    def delete_pair(self, key):
        if not (key in self._data):
            raise AttributeError
        else:
            del self._data[key]
        return

    def get_keys(self):
        return self._data.keys()

    def get_value(self, key):
        return self._data[key]

    def to_dict(self):
        return self._data


def check_db_existence(restaurant_link):
    snapshot = place_ref.where('place_naver_link', '==', restaurant_link).get()
    snapshot_exists = len([d for d in snapshot])
    if snapshot_exists != 0:
        return True
    return False


@firestore.transactional
def _update_place_transaction(transaction, db):
    naver_link = db['place_naver_link']
    snapshot = place_ref.where('place_naver_link', '==', naver_link).get(transaction=transaction)
    snapshot_exists = len([d for d in snapshot])
    if snapshot_exists:
        print('snapshot exists')
        for doc in snapshot:
            print(f'{doc.id} => {doc.to_dict()}')
    else:
        #counter_snapshot = counter_ref.document('place').get(transaction=firebase_transaction)
        #place_counter = counter_snapshot.to_dict()
        #transaction.set(place_ref.document(str(place_counter['place_num']).zfill(8)), db, merge=True)
        #place_counter['place_num'] = place_counter['place_num'] + 1
        #transaction.update(counter_ref.document('place'), place_counter)
        print('place transaction successful')
        return True
    print('place transaction aborted')
    return False


def upload_db(db_list, db_type=''):
    """
    upload data to database using given data_dict

    :param db_list:
    :param db_type:
    :return:
    """
    if db_type == 'place':
        for db in db_list:
            print(db.to_dict()['place_name'])
            _update_place_transaction(firebase_transaction, db.to_dict())
    elif db_type == 'station':
        pass
    elif db_type == 'user':
        pass
    else:
        return False
    return True


def place_db_img_transform(place_db):
    pass


def img_upload_from_link(img_link, img_type=None, place_name=None, place_uuid=None, img_num=None, img_transform=True):
    if img_type is None:
        print('img_upload: type is empty')
        raise TypeError
    if place_uuid is None:
        print('img_upload: uuid is empty')
        raise AttributeError
    else:
        target_name = f'restaurant_images/{place_uuid}/{img_type}_{img_num}.jpg'
        file_path = f'./temp_img/{place_name}_{place_uuid}/{img_type}/{img_num}.jpg'
    f = open(file_path, 'wb+')
    response = requests.get(img_link)
    f.write(response.content)
    f.close()
    if img_transform:
        bucket = firebase_cloud_storage.get_bucket(bucket_root_url)
        blob = bucket.blob(target_name)
        try:
            blob.upload_from_filename(file_path)
        except FileNotFoundError:
            print('File not found', place_name, place_uuid)
            return None
        img_url = cdn_root_url + target_name
    else:
        img_url = img_link
    return img_url



