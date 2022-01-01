"""
class DoughCrawler

WHAT FUNCTION IS API?
 .run_crawler_naver (this will do (1)~(4) all)

(1) Request query (e.g. 강남역 맛집) to graphql_url => ( 음식점 id ) list 만듦 ( len <= 300 ) 
(2) Request query (음식점 id) to restaruant_api_url => (음식점 제공 사진, 메뉴판 사진) list
(3) Request query (음식점 id) to graphql_url => (유저들이 찍어놓은 음식/내부 사진) list
(4) Convert the collected data to our DB's format, in `firestore_lib.py`
"""
  
import time
import copy
import os
import requests
import json
import datetime
import re
import dill
import uuid
#from firestore_lib import *

naver_graphql_url = 'https://pcmap-api.place.naver.com/graphql'
naver_restaurant_api_root_url = 'https://map.naver.com/v5/api/sites/summary'
naver_restaurant_root_url = 'https://pcmap.place.naver.com/restaurant'
naver_station_query_root_url = 'https://map.naver.com/v5/api/search'

NAVER_PAGE_MAX = 6  # maximum page number, <= 6
MAX_IMG_NUM = 20  # maximum image number for inside, food category, <= 30
MAX_QUERY_RETRY = 10  # maximum query retry attempts
with open("naver_get_restaurants_query.json", "r", encoding='UTF8') as open_json:
    naver_restaurant_query_json = json.load(open_json)
with open("naver_get_photo_query.json", "r", encoding='UTF8') as open_json:
    naver_photo_query_json = json.load(open_json)
parse_table_naver = dict(
    name='place_name',
    fullRoadAddress='place_road_address',
    address='place_legacy_address',
    category='place_category',
    bizHour='place_operating_time',
    menus='place_menu_info',
    menuImages='place_photo_menu',
    images='place_photo_provided',
    phone='place_telephone',
    x='place_coor_x',
    y='place_coor_y',
)


class DoughCrawler:
    def __init__(self, **kwargs):
        # attributes initializing
        self.log = True
        current_time = datetime.datetime.now().isoformat('-', timespec='seconds').replace(':', '')
        self.log_path = f'./log/log_{current_time}.txt'
        self.msg = True
        # db set arg to be added, changed after crawl or load db
        # variables for only crawling
        self.place_link_list = []
        self.duplicate_prone_flag = False
        self.site_cookies = None

        # naver arguments
        self.naver_arg_set_flag = False
        self.naver_station_name = None
        self.naver_search_keyword = None
        self.naver_search_query = None
        self.delay = 0

        # variables for db collecting
        # data to be saved by self.save(), can be loaded with self.load()
        self.station_raw_info = dict()
        self.current_place_db = None
        self.place_db_list = []
        self.photo_error_list = []

        # update for attributes
        self.__dict__.update((k, v) for k, v in kwargs.items())

        # check and make directories
        if not os.path.isdir(f'./temp_img'):
            os.mkdir(f'./temp_img')
        if not os.path.isdir(f'./raw_db'):
            os.mkdir(f'./raw_db')
        if not os.path.isdir(f'./log'):
            os.mkdir(f'./log')

        # open logfile
        if self.log:
            self.log_file = open(self.log_path, "w+")

        return

    def __del__(self):
        # close log
        if self.log:
            self.log_file.close()
        return

    def clear(self, **kwargs):
        self.__init__(**kwargs)
        return

    def run_crawler_naver(self, station_name=None, search_keyword=None, options=None):
        self.crawler_msg(f'{station_name} {search_keyword} crawling start')
        self.clear(**options)
        self.set_arg_naver(station=station_name, search_keyword=search_keyword, delay=3)
        self.get_place_link_list_naver()
        self.get_place_info_naver()
        self.save(name=f'{station_name}_{search_keyword}')
        self.crawler_msg(f'{station_name} {search_keyword} crawling done')

    def set_arg_naver(self, station='', search_keyword='', delay=0):
        naver_restaurant_query_json['variables']['input']['query'] = f'{station} {search_keyword}'
        station_query_table = dict(query=station, displayCount=1, lang='ko')
        station_res = requests.get(naver_station_query_root_url,
                                   params=station_query_table)
      
        if station_res.status_code == 200:
            station_res = station_res.json()
        else:
            assert "status_code not 200"

        self.station_raw_info = station_res['result']['place']['list'][0]
        cookie_res = requests.get("https://www.naver.com/")
        if cookie_res.status_code == 200:
            self.site_cookies = cookie_res.cookies.get_dict()
        self.naver_station_name = station
        self.naver_search_keyword = search_keyword
        self.delay = delay
        self.naver_search_query = f'{station}_{search_keyword}'
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

    def _remove_duplicates(self):
        if self.duplicate_prone_flag:
            self.place_link_list = list(set(self.place_link_list))
        return

    def get_db_list(self):
        return self.place_db_list

    def get_place_link_list_naver(self):
        if not self.naver_arg_set_flag:
            self.crawler_msg('naver arguments not set; set naver arguments before getting link list')
            raise AttributeError
        self.crawler_msg('naver_link_list_get start')
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
                self.crawler_msg('response error occurred while getting link_list, retry query', log=False)
                is_valid = False
                res = None
                self.crawler_msg("attempts:", end=" ", flush=True)
                for i in range(MAX_QUERY_RETRY):
                    self.crawler_msg(f'{i+1}/{MAX_QUERY_RETRY}', end=" ", flush=True)
                    res = requests.post(url=naver_graphql_url, headers=naver_header,
                                        data=naver_query_str, cookies=self.site_cookies)
                    time.sleep(self.delay * i)  # linearly increasing delay
                    if res.status_code == 200:
                        is_valid = True
                        break
                self.crawler_msg('')
                if is_valid and res:
                    res = res.json()
                else:
                    self.crawler_msg(f'list fetching failed, {self.naver_search_query}')
                    return None
            item_list = res['data']['restaurants']['items']
            for item in item_list:
                try:
                    self.place_link_list.append(item['id'])
                except AttributeError:
                    continue
        if not os.path.isdir(f'./temp_img/{self.naver_search_query}'):
            os.mkdir(f'./temp_img/{self.naver_search_query}')
        self.duplicate_prone_flag = True

        self.crawler_msg('naver_link_list_get done')
        return self.place_link_list

    def _get_place_info_naver_basic(self, link):

        restaurant_link = f'{naver_restaurant_api_root_url}/{link}'

        # manipulate raw_data
        params = {"lang": "ko"}
        res = requests.get(url=restaurant_link, params=params).json()
        place_db = self.current_place_db

        # get menu
        try:
            for item in res['menus']:
                del item['isRecommended']
        except (TypeError, KeyError):
            self.crawler_msg(f'menu not exists, {link}')

        # get menu image
        img_links = []
        try:
            for item in res['menuImages']:
                img_links.append(item['imageUrl'])
            res['menuImages'] = img_links
        except TypeError:
            self.crawler_msg(f'menu images not exists, {link}')

        # get image_provided
        img_links_provided = []
        try:
            for item in res['images']:
                if item['type'] == 'DRT':
                    img_links_provided.append(item['url'])
            res['images'] = img_links_provided
        except TypeError:
            self.crawler_msg(f'img_provided not exists, {link}')

        # add items to current_place_db
        for key in parse_table_naver:
            try:
                place_db[parse_table_naver[key]]= res[key]
            except KeyError:
                self.crawler_msg(f'{link}, {parse_table_naver[key]} treated as None')
                place_db[parse_table_naver[key]] = None
        place_db['place_naver_link'] = f'{naver_restaurant_root_url}/{link}'
        place_db['parent_stations'] = [self.naver_station_name]
        place_db['place_last_timestamp'] = datetime.date.today().isoformat()
        place_db['place_uuid'] = str(uuid.uuid5(uuid.NAMESPACE_DNS, link))

        # make directory for images
        place_uuid = place_db['place_uuid']
        local_path = f'./temp_img/{self.naver_search_query}/{place_uuid}'
        if not os.path.isdir(local_path):
            os.mkdir(local_path)
            os.mkdir(f'{local_path}/menu')
            os.mkdir(f'{local_path}/food')
            os.mkdir(f'{local_path}/inside')
            os.mkdir(f'{local_path}/thumbnail_inside')
            os.mkdir(f'{local_path}/thumbnail_food')

        # download menu, provided images
        self._download_photo(self.naver_search_query, place_db, 'menu')
        self._download_photo(self.naver_search_query, place_db, 'provided')
        return True

    def _get_place_info_naver_photo(self, link, relations=''):
        if not self.naver_arg_set_flag:
            self.crawler_msg('naver argument not set')
            raise AttributeError

        # get food, inside photo using api method
        if relations == 'food':
            query_relation = '음식'
        elif relations == 'inside':
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
            self.crawler_msg('response error occurred while getting photo, retry query', log=False)
            is_valid = False
            res = None
            self.crawler_msg("attempts:", end=" ", flush=True)
            for i in range(MAX_QUERY_RETRY):
                self.crawler_msg(f'{i+1}/{MAX_QUERY_RETRY}', end=" ", flush=True)
                res = requests.post(url=naver_graphql_url, headers=naver_header,
                                    data=naver_query_str, cookies=self.site_cookies)
                time.sleep(self.delay * i)  # linearly increasing delay
                if res.status_code == 200:
                    is_valid = True
                    break
            self.crawler_msg('')
            if is_valid and res:
                res = res.json()
            else:
                self.crawler_msg(f'{relations}_photo fetching failed, {link}')
                self.photo_error_list.append({'index': len(self.place_db_list), 'relation': relations})
                return

        img_links = []
        try:
            for item in res[0]['data']['sasImages'][0]['items']:
                img_links.append(item['imgUrl'])
        except IndexError:
            self.crawler_msg(f'{relations} photo not exists, {link}')

        # add img_links to current_place_db
        self.current_place_db[f'place_photo_{relations}'] = img_links

        # download images
        self._download_photo(self.naver_search_query, self.current_place_db, relations)
        return

    def get_place_info_naver(self):
        self.crawler_msg('naver_info_get start')
        self._remove_duplicates()

        place_document_empty = dict(
            place_name=None,
            place_uuid=None,
            place_road_address=None,
            place_legacy_address=None,
            place_category=None,
            place_cluster_a=None,
            place_cluster_b=None,
            place_operating_time=None,
            place_kind=None,
            place_menu_info=[],
            place_naver_link=None,
            place_photo_provided=[],
            place_photo_inside=[],
            place_photo_food=[],
            place_photo_menu=[],
            place_photo_main_list=[],
            place_telephone=None,
            place_last_timestamp=None,
            parent_station_list=[],
            place_coor_x=None,
            place_coor_y=None,
            place_views=0,
        )

        self.current_place_db = place_document_empty
        self.current_place_db["parent_station_list"].append(self.naver_station_name)
        for link in self.place_link_list:
            try:
                validity = self._get_place_info_naver_basic(link)
                if validity:
                    self._get_place_info_naver_photo(link, relations='food')
                    self._get_place_info_naver_photo(link, relations='inside')
            except TypeError:
                self.crawler_msg(f'type error occurred while getting place_info_naver, {link}')
                continue
            self.place_db_list.append(copy.deepcopy(self.current_place_db))
            place_name = self.current_place_db['place_name']
            self.crawler_msg(f'{place_name} added to db list')
        if not self.photo_error_list:
            self.crawler_msg('photo error list')
            for item in self.photo_error_list:
                self.crawler_msg(item, end=" ", flush=True)
        self.crawler_msg('naver_info_get done')
        return

    def _download_photo(self, search_query, place_db, img_type):
        if img_type is None:
            self.crawler_msg('type is empty')
            raise TypeError

        img_url_array = place_db[f'place_photo_{img_type}']
        place_uuid = place_db['place_uuid']

        if img_type == 'provided' or img_type == 'food' or img_type == 'inside':
            local_path_root = f'./temp_img/{search_query}/{place_uuid}'
            if img_type == 'provided':
                prefix = 'a'
            elif img_type == 'food':
                prefix = 'f'
            else:
                prefix = 'i'
        elif img_type == 'menu':
            local_path_root = f'./temp_img/{search_query}/{place_uuid}/{img_type}'
            prefix = ''
        else:
            self.crawler_msg(f'invalid image type given;{img_type}')
            raise AttributeError

        for index in range(len(img_url_array)):
            url = img_url_array[index]
            file_path = f'{local_path_root}/{prefix}{index}.jpg'
            if not os.path.isfile(file_path):
                with open(file_path, 'wb+') as f:
                    response = requests.get(url)
                    f.write(response.content)
        return

    def save(self, name=None):
        if name is not None:
            path = f'./raw_db/{name}'
        else:
            path = f'./raw_db/db'
        data_body = [self.station_info, self.place_db_list]
        file = open(path, "wb+")
        dill.dump(data_body, file=file)
        file.close()
        return path

    def load(self, path):
        file = open(path, "rb")
        data_body = dill.load(file)
        self.station_info = data_body[0]
        self.place_db_list = data_body[1]
        return

    def crawler_msg(self, string='', log=True, **kwargs):
        if self.msg:
            if string == '':
                print('', **kwargs)
            elif 'end' in kwargs.keys() and kwargs['end'] == ' ':
                print(f'{string}', **kwargs)
            else:
                print(f'DoughCrawler: {string}', **kwargs)
                self.crawler_log(string, log=log, **kwargs)
        return

    def crawler_log(self, string='', log=True, **kwargs):
        if self.log and log:
            kwargs['file'] = self.log_file
            print(f'DoughCrawler: {string}', **kwargs)
        return
    # to do
    # def _upload_photo_naver(self, img_links, place_db, img_type):  # not appropriate, to be moved to firestore_lib
    # migrate img_transform part to firestore_lib, transform_img_url function(using db_list) add
    # resume_getting_photo function(using photo_error_list) add

