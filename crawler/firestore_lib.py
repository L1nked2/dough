import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import copy
import string
import random

# Use the application default credentials
cred = credentials.Certificate('./service-account.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'dough-survey',
})
firebase_db = firestore.client()

# data types and key-value pairs
place_db_empty = dict(
    place_name=None,
    place_address=None,
    place_address_minor=None,
    place_category=None,
    place_cluster_a=None,
    place_cluster_b=None,
    place_cluster_c=None,
    place_holiday=None,
    place_kind=None,
    place_menu=None,
    place_naver_link=None,
    place_open_time=None,
    place_photo_inside_main_src=None,
    place_photo_menu_main_src=None,
    place_telephone=None,
    place_last_timestamp=None,
    station_name=None,
    distance_to_station=None,
)

place_db_thumb_empty = dict(
    place_name=None,
    place_cluster_a=None,
    place_cluster_b=None,
    place_cluster_c=None,
    place_photo_inside_src=None,
    place_photo_menu_main_src=None,
)

station_db_empty = dict(
    station_name=None,
    place_list_restaurant=[],
    place_list_cafe=[],
    place_list_pub=[],
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
            return
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
            return
        else:
            if new_element in self._data[list_name]:
                pass
            else:
                self._data[list_name].append(new_element)
        return

    def add_value(self, key, value):
        if key in self._data:
            raise NameError
            return
        else:
            self._data[key] = value
        return

    def update_value(self, key, value):
        if not (key in self._data):
            raise AttributeError
            return
        else:
            self._data[key] = value
        return

    def get_value(self, key):
        return self._data[key]

    def to_dict(self):
        return self._data


def build_db(data_type):
    """
    build empty dictionary for database

    :param data_type: given data type(place_db, station_db)
    :return: dictionary of parsed data
    """
    if data_type == 'place_db':
        place_db = DB(place_db_empty)
        place_db.add_list('place_photo_inside', None)
        place_db.add_list('place_photo_menu', None)
        return place_db
    elif data_type == 'station_db':
        place_db = DB(station_db_empty)
        #place_db.add_list('place_photo_inside', None)
    else:
        raise TypeError('invalid data type given')
        return None


def set_db(db):
    """
    sets database using given data_dict

    :param db:
    :return:
    """

    # eatery_list = ["고기 요리", "국수 / 면 요리", "기타 한식", "기타 양식", "남미 음식", "라멘 / 소바 / 우동", "베이커리", "베트남 음식", "브런치 / 버거 /
    # 샌드위치", "세계음식 기타", "스테이크 / 바베큐", "이탈리안", "인도 음식", "탕 / 찌개 / 전골", "태국 음식", "퓨전 양식", "프랑스 음식", "한정식 / 백반 / 정통 한식",
    # "해산물 요리"]
    cafe_list = ['카페 / 디저트', '베이커리']
    pub_list = ['이자카야 / 오뎅 / 꼬치', '치킨 / 호프 / 펍', '칵테일 / 와인', '전통 주점 / 포차']
    kind = db.get_value('place_kind')

    if kind in cafe_list or kind in pub_list:
        None

    else:
        db.update_value('category', '식사')
        try:
            print('POST TO place_DB. Category is 식사')
            doc_ref = db.collection("Place_DB")
            doc_ref.add(db.to_dict())
        except:
            print("PLACE DB ERROR")

        try:
            print("POST TO STATION DB. Category is", category)
            doc_ref = db.collection(u"Station DB").document(place).collection(category).document(R_name)
            doc_ref.set({
                u'name': R_name,
                u'a_station': place,
                u'category': category,
                u'kind': kind,
                u'key': key1})
            print("매장 이름: {} 플레이스: {} 카테고리: {} 주소: {} 종류: {} 공유 키 값: {}".format(R_name, place, category, addr, kind,
                                                                                key1))
        except:
            print("STATION DB ERROR")
