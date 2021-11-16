import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid

# Use the application default credentials
cred = credentials.Certificate('./service-account.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'dough-survey',
})
firebase_db = firestore.client()
firebase_transaction = firebase_db.transaction()
counter_ref = firebase_db.collection('counter')
place_ref = firebase_db.collection('place_db')

service_domain = "https://www.babyak.kr"

# data types and key-value pairs
place_db_empty = dict(
    place_name=None,
    place_uuid=None,
    place_road_address=None,
    place_legacy_address=None,
    place_category=None,
    place_cluster_a=None,
    place_cluster_b=None,
    place_cluster_c=None,
    place_operating_time=None,
    place_kind=None,
    place_menu=[],
    place_naver_link=None,
    place_photo_inside=[],
    place_photo_menu=[],
    place_photo_food=[],
    place_photo_inside_main_src=None,
    place_photo_food_main_src_1=None,
    place_photo_food_main_src_2=None,
    place_telephone=None,
    place_last_timestamp=None,
    station_name=None,
    distance_to_station=None,
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
    place_photo_inside_src=None,
    place_photo_menu_main_src=None,
    distance_to_station=None,
    place_views=0,
)

station_db_empty = dict(
    place_list=[],
    station_coor_x=None,
    station_coor_y=None,
    station_views=0,
)


class DB:
    def __init__(self, init_list):
        """
        make new database using given init_list
        data is stored to _data: dictionary

        :param init_list: dictionary, new list name
        :return: None
        """
        self._data = dict()
        for key, value in init_list.items():
            self._data[key] = value
        return

    def add_list(self, list_name, new_element):
        """
        update new list to dictionary using array-like structure
        init index 0 with new_element if new element exists

        :param list_name: str, new list name
        :param new_element: index 0 element of new list

        :return: None, raise error if list_name exists already
        """
        if list_name + '_length' in self._data:
            raise NameError
        else:
            self._data[list_name] = []
            self._data[list_name].append(new_element)
        return

    def update_list(self, list_name, new_element):
        """
        update new element to dictionary using array-like structure
        insert new_element to lowest available index of list

        :param list_name: str, list_name that exists in dictionary
        :param new_element: str, new element to be inserted
        :return: None, raise error if list_name is not available
        """
        if not (list_name in self._data):
            raise AttributeError
        else:
            if new_element in self._data[list_name]:
                pass
            else:
                self._data[list_name].append(new_element)
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

    def get_keys(self):
        return self._data.keys()

    def get_value(self, key):
        return self._data[key]

    def to_dict(self):
        return self._data


@firestore.transactional
def _update_place_transaction(transaction, db):
    naver_link = db['place_naver_link']
    snapshot = place_ref.where('place_naver_link', '==', naver_link).get(transaction=transaction)
    is_snapshot_empty = len([d for d in snapshot])
    if is_snapshot_empty:
        print('snapshot exists')
        for doc in snapshot:
            print(f'{doc.id} => {doc.to_dict()}')
    else:
        counter_snapshot = counter_ref.document('place').get(transaction=firebase_transaction)
        place_counter = counter_snapshot.to_dict()
        transaction.set(place_ref.document(str(place_counter['place_num']).zfill(8)), db, merge=True)
        place_counter['place_num'] = place_counter['place_num'] + 1
        db['place_uuid'] = uuid.uuid5(uuid.NAMESPACE_DNS, service_domain)
        transaction.update(counter_ref.document('place'), place_counter)
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
