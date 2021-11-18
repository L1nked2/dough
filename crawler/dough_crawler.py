from selenium import webdriver
from selenium.common.exceptions import *
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import copy
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

NAVER_PAGE_MAX = 6  # maximum 6
with open("naver_query.json", "r", encoding='UTF8') as naver_json:
    naver_query_json = json.load(naver_json)
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


class DoughCrawler:
    def __init__(self, target_url=None, **kwargs):
        self.place_link_list = []
        self.duplicate_prone_flag = False
        self.naver_arg_set_flag = False
        self.place_db_list = []
        self.station_info = dict()
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

    def driver_get(self, target_url, **kwargs):
        if target_url:
            try:
                self.driver.get(target_url.format(**kwargs))
            except AttributeError:
                print('AttributeError, check target_url and attributes')
        return

    def set_arg_naver(self, station='', search_keyword=''):
        naver_query_json['variables']['input']['query'] = station + search_keyword
        station_query_table = dict(query=station, displayCount=1, lang='ko')
        station_res = requests.get(naver_station_query_root_url,
                                   params=station_query_table).json()
        self.station_info = station_res['result']['place']['list'][0]
        self.naver_arg_set_flag = True
        return

    @staticmethod
    def _set_naver_query_page(page):
        naver_query_json['variables']['input']['start'] = 50 * page + 1
        return

    def init_place_link_list(self):
        self.place_link_list.clear()
        return

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
        naver_header = {"method": "POST", "content-type": "application/json"}
        for page in range(NAVER_PAGE_MAX):
            self._set_naver_query_page(page)
            naver_query_str = json.dumps(naver_query_json)
            res = requests.post(url=naver_graphql_url, headers=naver_header, data=naver_query_str)
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

    def get_place_info_naver(self, station_name):
        self._remove_duplicates()
        place_db = DB(place_db_empty)
        params = {"lang": "ko"}
        for link in self.place_link_list:
            actual_link = naver_restaurant_api_root_url + str(link)
            res = requests.get(url=actual_link, params=params).json()
            try:
                restaurant_link = naver_restaurant_root_url + str(link)
                place_db.update_pair('place_naver_link', restaurant_link)
                place_db.update_pair('station_name', station_name)
                place_db.update_pair('place_last_timestamp', datetime.date.today().isoformat())
                img_array = []
                for item in res['menus']:
                    del item['isRecommended']
                for item in res['menuImages']:
                    img_array.append(item['imageUrl'])
                res['menuImages'] = img_array
                for key in parse_table_naver:
                    try:
                        place_db.update_pair(parse_table_naver[key], res[key])
                    except KeyError:
                        place_db.update_pair(parse_table_naver[key], None)
                place_db.update_pair('place_uuid', uuid.uuid5(uuid.NAMESPACE_DNS, service_domain))
                station_coor = (float(self.station_info['y']), float(self.station_info['x']))
                place_coor = (float(place_db.get_value('place_coor_y')), float(place_db.get_value('place_coor_x')))
                distance_to_station = haversine(station_coor, place_coor)
                place_db.update_pair('distance_to_station', distance_to_station)
            except TypeError:
                continue
            #print(place_db.to_dict())
            self.place_db_list.append(copy.deepcopy(place_db))
        return
