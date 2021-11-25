import time
import copy
import os
import requests
import json
import datetime
import re
from selenium import webdriver
from selenium.common.exceptions import *
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
from haversine import haversine
from firestore_lib import *

naver_graphql_url = 'https://pcmap-api.place.naver.com/graphql'
naver_restaurant_api_root_url = 'https://map.naver.com/v5/api/sites/summary'
naver_restaurant_root_url = 'https://pcmap.place.naver.com/restaurant'
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
    category='place_category',
    bizhourInfo='place_operating_time',
    menus='place_menu',
    menuImages='place_photo_menu',
    phone='place_telephone',
    x='place_coor_x',
    y='place_coor_y',
)


class DoughCrawler:
    def __init__(self, **kwargs):
        # attributes initializing
        self.place_link_list = []
        self.duplicate_prone_flag = False
        self.site_cookies = None
        self.naver_arg_set_flag = False
        self.photo_error_list = []
        self.place_db_list = []
        self.station_info = dict()
        self.delay = 0
        self.current_place_db = None
        self.do_img_send = True
        self.__dict__.update((k, v) for k, v in kwargs.items())
        # webdriver initializing
        options = webdriver.ChromeOptions()
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        options.add_argument('headless')
        options.add_argument('window-size=1920x1080')
        options.add_argument("disable-gpu")
        self.driver = webdriver.Chrome('./chromedriver.exe', options=options)
        self.driver.implicitly_wait(3)
        self.driver.refresh()
        return

    def clear(self, **kwargs):
        self.__init__(**kwargs)
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
                                   params=station_query_table)
        if station_res.status_code == 200:
            station_res = station_res.json()
        self.station_info = station_res['result']['place']['list'][0]
        cookie_res = requests.get("https://www.naver.com/")
        if cookie_res.status_code == 200:
            self.site_cookies = cookie_res.cookies.get_dict()
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

    def get_place_link_list_naver(self):
        if not self.naver_arg_set_flag:
            raise AttributeError
        naver_header = {
            "method": "POST", "content-type": "application/json",
            "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/95.0.4638.69 Safari/537.36"
        }
        for page in range(NAVER_PAGE_MAX):
            self._set_naver_restaurant_query_page(page)
            naver_query_str = json.dumps(naver_restaurant_query_json)
            try:
                res = requests.post(url=naver_graphql_url, headers=naver_header,
                                    data=naver_query_str, cookies=self.site_cookies).json()
            except json.decoder.JSONDecodeError:
                print('get_place_link_list_naver: response error occurred while getting link_list, retry query')
                is_valid = False
                res = None
                print("attempts:", end=" ", flush=True)
                for i in range(MAX_QUERY_RETRY):
                    print(f'{i+1}/{MAX_QUERY_RETRY}', end=" ", flush=True)
                    res = requests.post(url=naver_graphql_url, headers=naver_header,
                                        data=naver_query_str, cookies=self.site_cookies)
                    time.sleep(self.delay * i)  # linearly increasing delay
                    if res.status_code == 200:
                        is_valid = True
                        break
                print('')
                if is_valid and res:
                    res = res.json()
                else:
                    print('get_place_link_list_naver: list fetching failed')
                    print(res, res.headers)  # test
                    return None
            item_list = res['data']['restaurants']['items']
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

    def _get_place_info_naver_basic(self, res, station_name, link):
        # manipulate data
        restaurant_link = f'{naver_restaurant_root_url}/{link}'
        if check_db_existence(restaurant_link):
            return False
        place_db = self.current_place_db
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
        place_uuid = place_db.get_value('place_uuid')
        local_path = f'./temp_img/{place_name}_{place_uuid}'
        os.mkdir(local_path)
        os.mkdir(f'{local_path}/menu')
        os.mkdir(f'{local_path}/provided')
        os.mkdir(f'{local_path}/inside')
        os.mkdir(f'{local_path}/food')

        # upload menu images
        img_links = []
        for item in res['menus']:
            del item['isRecommended']
        for item in res['menuImages']:
            img_links.append(item['imageUrl'])
        img_array = self._upload_photo_naver(img_links, place_db, 'menu')
        res['menuImages'] = img_array

        # station_coor = (float(self.station_info['y']), float(self.station_info['x']))
        # place_coor = (float(place_db.get_value('place_coor_y')), float(place_db.get_value('place_coor_x')))
        # distance_to_station = haversine(station_coor, place_coor)
        # place_db.update_pair('distance_to_station', distance_to_station)
        return True

    def _get_place_info_naver_photo_provided(self, link):
        img_links = []
        target_url = f'{naver_restaurant_root_url}/{link}/photo?filterType=업체사진'
        self.driver_get(target_url=target_url)
        page_src = self.driver.page_source
        soup = BeautifulSoup(page_src, 'html.parser')
        photo_list = soup.find_all("img", id=re.compile("ibu_[1-9]?\\d"))
        for photo_index in range(min(MAX_IMG_NUM, len(photo_list))):
            photo_link = re.sub(r"&quality=95&type=f180_180", r"&type=w750", photo_list[photo_index].get('src'))
            img_links.append(photo_link)
        return img_links

    def _get_place_info_naver_photo(self, link, relations=''):
        if not self.naver_arg_set_flag:
            print('naver argument not set')
            raise AttributeError
        # webdriver method (provided)
        if relations == 'provided':
            photo_category = 'place_photo_provided'
            img_links = self._get_place_info_naver_photo_provided(link)

        # api method (food, inside)
        else:
            if relations == 'food':
                photo_category = 'place_photo_food'
                query_relation = '음식'
            elif relations == 'inside':
                photo_category = 'place_photo_inside'
                query_relation = '내부'
            else:
                raise AttributeError

            naver_header = {
                "method": "POST", "content-type": "application/json",
                "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                              "Chrome/95.0.4638.69 Safari/537.36"
            }
            self._set_naver_photo_query_arg(link, relations=query_relation)
            naver_query_str = json.dumps(naver_photo_query_json)
            try:
                res = requests.post(url=naver_graphql_url, headers=naver_header,
                                    data=naver_query_str, cookies=self.site_cookies).json()
            except json.decoder.JSONDecodeError:
                print('get_place_info_naver: response error occurred while getting photo, retry query')
                is_valid = False
                res = None
                print("attempts:", end=" ", flush=True)
                for i in range(MAX_QUERY_RETRY):
                    print(f'{i+1}/{MAX_QUERY_RETRY}', end=" ", flush=True)
                    res = requests.post(url=naver_graphql_url, headers=naver_header,
                                        data=naver_query_str, cookies=self.site_cookies)
                    time.sleep(self.delay * i)  # linearly increasing delay
                    if res.status_code == 200:
                        is_valid = True
                        break
                print('')
                if is_valid and res:
                    res = res.json()
                else:
                    print('get_place_info_naver: photo fetching failed')
                    self.photo_error_list.append({'link': link, 'relation': relations})
                    return
            img_links = []
            for item in res[0]['data']['sasImages'][0]['items']:
                img_links.append(item['imgUrl'])

        # sending images to server
        img_url_array = self._upload_photo_naver(img_links, self.current_place_db, relations)
        self.current_place_db.update_pair(photo_category, img_url_array)
        return

    def get_place_info_naver(self, station_name):
        self._remove_duplicates()
        self.current_place_db = DB(place_db_empty)
        params = {"lang": "ko"}

        for link in self.place_link_list:
            actual_link = f'{naver_restaurant_api_root_url}/{link}'
            res = requests.get(url=actual_link, params=params).json()
            try:
                validity = self._get_place_info_naver_basic(res, station_name, link)
                if validity:
                    self._get_place_info_naver_photo(link, relations='provided')
                    self._get_place_info_naver_photo(link, relations='food')
                    self._get_place_info_naver_photo(link, relations='inside')
            except TypeError:
                print('type error occurred while getting place_info_naver')
                continue
            self.place_db_list.append(copy.deepcopy(self.current_place_db))
            print(self.current_place_db.to_dict()['place_name'], 'added to db list')
        if not self.photo_error_list:
            print('photo error list')
            for link in self.photo_error_list:
                print(link)
        return

    def _upload_photo_naver(self, img_links, place_db, img_type):
        img_url_array = []
        img_num = min(MAX_IMG_NUM, len(img_links))
        for index in range(img_num):
            url = img_links[index]
            crawled_url = img_upload_from_link(url,
                                               img_type=img_type,
                                               place_name=place_db.get_value('place_name'),
                                               place_uuid=place_db.get_value('place_uuid'),
                                               img_num=index,
                                               do_img_send=self.do_img_send
                                               )
            img_url_array.append(crawled_url)
        return img_url_array
