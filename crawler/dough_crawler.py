import time

from selenium import webdriver
from selenium.common.exceptions import *
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import copy
import os
import requests
import json
import datetime
from haversine import haversine
from firestore_lib import *

naver_graphql_url = 'https://pcmap-api.place.naver.com/graphql'
naver_restaurant_api_root_url = 'https://map.naver.com/v5/api/sites/summary/'
naver_restaurant_root_url = 'https://pcmap.place.naver.com/restaurant/'
naver_station_query_root_url = 'https://map.naver.com/v5/api/search'
service_domain = "https://www.babyak.kr"

NAVER_PAGE_MAX = 6  # maximum page number, < 6
MAX_IMG_NUM = 20  # maximum image number for each category, < 30
MAX_QUERY_RETRY = 10
with open("naver_get_restaurants_query.json", "r", encoding='UTF8') as open_json:
    naver_restaurant_query_json = json.load(open_json)
with open("naver_get_photo_query.json", "r", encoding='UTF8') as open_json:
    naver_photo_query_json = json.load(open_json)
parse_table_naver = dict(
    name='place_name',
    fullRoadAddress='place_road_address',
    address='place_legacy_address',
    categories='place_category',
    bizhourInfo='place_operating_time',
    menus='place_menu',
    menuImages='place_photo_menu',
    phone='place_telephone',
    x='place_coor_x',
    y='place_coor_y',
)


def check_db_existence(restaurant_link):
    return False


class DoughCrawler:
    def __init__(self, target_url=None, **kwargs):
        self.place_link_list = []
        self.duplicate_prone_flag = False
        self.naver_arg_set_flag = False
        self.photo_error_list = []
        self.place_db_list = []
        self.station_info = dict()
        self.delay = 0
        options = webdriver.ChromeOptions()
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        options.add_argument('headless')
        options.add_argument('window-size=1920x1080')
        options.add_argument("disable-gpu")
        self.driver = webdriver.Chrome('./chromedriver.exe', options=options)
        self.driver.implicitly_wait(3)
        self.driver.refresh()
        self.driver_get(target_url, **kwargs)
        return

    def clear(self):
        self.place_link_list = []
        self.duplicate_prone_flag = False
        self.naver_arg_set_flag = False
        self.photo_error_list = []
        self.place_db_list = []
        self.station_info = dict()
        return

    def driver_get(self, target_url, **kwargs):
        if target_url:
            try:
                self.driver.get(target_url.format(**kwargs))
            except AttributeError:
                print('AttributeError, check target_url and attributes')
        return

    def set_arg_naver(self, station='', search_keyword='', delay=0):
        naver_restaurant_query_json['variables']['input']['query'] = f'{station} {search_keyword}'
        station_query_table = dict(query=station, displayCount=1, lang='ko')
        station_res = requests.get(naver_station_query_root_url,
                                   params=station_query_table).json()
        self.station_info = station_res['result']['place']['list'][0]
        self.delay = delay
        self.naver_arg_set_flag = True
        return

    @staticmethod
    def _set_naver_restaurant_query_page(page):
        naver_restaurant_query_json['variables']['input']['start'] = 50 * page + 1
        return

    @staticmethod
    def _set_naver_photo_query_arg(link, relations=None):
        naver_photo_query_json[0]['variables']['input']['businessId'] = link
        naver_photo_query_json[0]['variables']['input']['display'] = MAX_IMG_NUM
        naver_photo_query_json[0]['variables']['input']['relations'] = [relations]
        return

    def init_place_link_list(self):
        self.place_link_list.clear()
        return

    def get_db_list(self):
        return self.place_db_list

    def get_place_link_list_mangoplate(self, *substring):
        page_src = self.driver.page_source
        soup = BeautifulSoup(page_src, 'html.parser')
        for item in soup.find_all('a'):
            try:
                if item.get('href').find(*substring) != -1:
                    self.place_link_list.append(item.get('href'))
            except AttributeError:
                continue
        self.duplicate_prone_flag = True
        return self.place_link_list

    def get_place_link_list_naver(self):
        if not self.naver_arg_set_flag:
            raise AttributeError
        naver_header = {
            "method": "POST", "content-type": "application/json",
        }
        for page in range(NAVER_PAGE_MAX):
            self._set_naver_restaurant_query_page(page)
            naver_query_str = json.dumps(naver_restaurant_query_json)
            res = requests.post(url=naver_graphql_url, headers=naver_header, data=naver_query_str)
            time.sleep(self.delay)
            # print(res)  # test
            item_list = res.json()['data']['restaurants']['items']
            for item in item_list:
                try:
                    self.place_link_list.append(item['id'])
                except AttributeError:
                    continue
        self.duplicate_prone_flag = True
        return self.place_link_list

    def _remove_duplicates(self):
        if self.duplicate_prone_flag:
            self.place_link_list = list(set(self.place_link_list))
        return

    def get_place_info_mangoplate(self, root_url, station_name):
        self._remove_duplicates()
        place_db = DB(place_db_empty)
        for link in self.place_link_list:
            actual_link = root_url + link
            self.driver_get(actual_link)
            page_src = self.driver.page_source
            soup = BeautifulSoup(page_src, 'html.parser')
            place_db.update_pair('station_name', station_name)
            for key in place_db.get_keys():
                if key == 'place_name':
                    result = soup.find('h1', attrs={'class': 'restaurant_name'})
                    if result:
                        place_db.update_pair(key, result.get_text())
                        print(result.get_text())
                elif key == 'place_address':
                    pass
                else:
                    pass
        self.place_db_list.append(place_db)
        return

    @staticmethod
    def _get_place_info_naver_basic(place_db, res, station_name, link):
        # manipulate data
        restaurant_link = naver_restaurant_root_url + str(link)
        if check_db_existence(restaurant_link):
            return False
        for key in parse_table_naver:
            try:
                place_db.update_pair(parse_table_naver[key], res[key])
            except KeyError:
                place_db.update_pair(parse_table_naver[key], None)
        place_db.update_pair('place_naver_link', restaurant_link)
        place_db.update_pair('parent_stations', [station_name])
        place_db.update_pair('place_last_timestamp', datetime.date.today().isoformat())
        place_db.update_pair('place_uuid', uuid.uuid5(uuid.NAMESPACE_DNS, restaurant_link))

        # make directory for images
        place_name = place_db.get_value('place_name')
        os.mkdir(f'./temp_img/{place_name}')
        os.mkdir(f'./temp_img/{place_name}/menu')
        os.mkdir(f'./temp_img/{place_name}/provided')
        os.mkdir(f'./temp_img/{place_name}/inside')
        os.mkdir(f'./temp_img/{place_name}/food')

        # upload images
        img_array = []
        for item in res['menus']:
            del item['isRecommended']
        for index in range(len(res['menuImages'])):
            img_upload_from_link(res['menuImages'][index]['imageUrl'],
                                 img_type='menu',
                                 place_name=place_db.get_value('place_name'),
                                 place_uuid=place_db.get_value('place_uuid'),
                                 img_num=index)
            img_array.append(res['menuImages'][index]['imageUrl'])
        res['menuImages'] = img_array

        # station_coor = (float(self.station_info['y']), float(self.station_info['x']))
        # place_coor = (float(place_db.get_value('place_coor_y')), float(place_db.get_value('place_coor_x')))
        # distance_to_station = haversine(station_coor, place_coor)
        # place_db.update_pair('distance_to_station', distance_to_station)
        return True

    def _get_place_info_naver_photo(self, place_db, link, relations=''):
        if not self.naver_arg_set_flag:
            print('naver argument not set')
            raise AttributeError
        if relations == 'provided':
            photo_category = 'place_photo_provided'
            query_relation = '업체사진'
        elif relations == 'food':
            photo_category = 'place_photo_food'
            query_relation = '음식'
        elif relations == 'inside':
            photo_category = 'place_photo_inside'
            query_relation = '내부'
        else:
            raise AttributeError
        naver_header = {"method": "POST", "content-type": "application/json"}
        self._set_naver_photo_query_arg(link, relations=query_relation)
        naver_query_str = json.dumps(naver_photo_query_json)
        try:
            res = requests.post(url=naver_graphql_url, headers=naver_header, data=naver_query_str).json()
        except json.decoder.JSONDecodeError:
            print('response error occurred, retry query')
            is_valid = False
            res = None
            for i in range(MAX_QUERY_RETRY):
                res = requests.post(url=naver_graphql_url, headers=naver_header, data=naver_query_str)
                time.sleep(self.delay)
                if res.status_code == 200:
                    is_valid = True
                    break
            if is_valid and res:
                res = res.json()
            else:
                print('fetching failed')
                self.photo_error_list.append(link)
                return
        img_url_array = []
        img_num = min(MAX_IMG_NUM, len(res[0]['data']['sasImages'][0]['items']))
        for index in range(img_num):
            url = res[0]['data']['sasImages'][0]['items'][index]['imgUrl']
            actual_url = img_upload_from_link(url,
                                              img_type=relations,
                                              place_name=place_db.get_value('place_name'),
                                              place_uuid=place_db.get_value('place_uuid'),
                                              img_num=index)
            img_url_array.append(actual_url)
        place_db.update_pair(photo_category, img_url_array)
        return

    def get_place_info_naver(self, station_name):
        self._remove_duplicates()
        place_db = DB(place_db_empty)
        params = {"lang": "ko"}

        for link in self.place_link_list:
            actual_link = naver_restaurant_api_root_url + str(link)
            res = requests.get(url=actual_link, params=params).json()
            try:
                validity = self._get_place_info_naver_basic(place_db, res, station_name, link)
                if validity:
                    self._get_place_info_naver_photo(place_db, link, relations='provided')
                    self._get_place_info_naver_photo(place_db, link, relations='food')
                    self._get_place_info_naver_photo(place_db, link, relations='inside')
            except TypeError:
                print('type error occurred while getting place_info_naver')
                continue
            print(place_db.to_dict()['place_name'])
            self.place_db_list.append(copy.deepcopy(place_db))
        if not self.photo_error_list:
            print('photo error list')
            for link in self.photo_error_list:
                print(link)
        return
