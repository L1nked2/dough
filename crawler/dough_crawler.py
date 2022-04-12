"""
class DoughCrawler

Fn crawl()

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
import dill, pickle
import uuid
#from firestore_lib import *

import httpx

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
    menuImages='place_menu_photo_list',
    images='place_provided_photo_list',
    phone='place_telephone',
    x='place_coor_x',
    y='place_coor_y',
    reviewCount='place_reviews'
)


class DoughCrawler:
    def __init__(self, db_path, photo_dir_path, log_dir_path, crawl_only_ten_places_for_test, **kwargs):
        # attributes initializing
        self.log = True
        current_time = datetime.datetime.now().isoformat('-', timespec='seconds').replace(':', '')
        self.log_path = f'{log_dir_path}/log_{current_time}.txt'
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

        # check and make directories
        if not os.path.isdir(photo_dir_path):
            os.mkdir(photo_dir_path)
        if not os.path.isdir(db_path):
            os.mkdir(db_path)
        if not os.path.isdir(log_dir_path):
            os.mkdir(log_dir_path)

        self.photo_dir_path = photo_dir_path
        self.db_path = db_path
        self.log_dir_path = log_dir_path

        # open logfile
        if self.log:
            self.log_file = open(self.log_path, "w+")

        # crawling limit
        self.crawl_only_ten_places_for_test = crawl_only_ten_places_for_test

        return

    def __del__(self):
        # close log
        if self.log:
            self.log_file.close()
        return

    def clear(self, db_path, photo_dir_path, log_dir_path, crawl_only_ten_places_for_test, **kwargs):
        self.__init__(db_path, photo_dir_path, log_dir_path, crawl_only_ten_places_for_test, **kwargs)
        return

    def run_crawler_naver(self, station_name=None, search_keyword=None, options=None):
        self.crawler_msg(f'{station_name} {search_keyword} crawling start')
        self.clear(self.db_path, self.photo_dir_path, self.log_dir_path, self.crawl_only_ten_places_for_test, **options)
        self.set_arg_naver(station=station_name, search_keyword=search_keyword, delay=3)
        self.get_place_link_list_naver()
        self.get_place_info_naver()
        self.save(name=f'{station_name}_{search_keyword}')
        self.crawler_msg(f'{station_name} {search_keyword} crawling done')

    def set_arg_naver(self, station='', search_keyword='', delay=0):
        naver_restaurant_query_json['variables']['input']['query'] = f'{station} {search_keyword}'
        station_query_table = dict(query=station, displayCount=1, lang='ko')

        station_res_json = None
        for i in range(MAX_QUERY_RETRY):
            time.sleep(delay*i)
            if not i == 0 : print(f"Retrying query for {i} time more...")
            station_res = httpx.get(naver_station_query_root_url,
                                    params=station_query_table)
            if station_res.status_code == 200:
                station_res_json = station_res.json()
                break
        
        if station_res.status_code != 200: 
            # sleep 100s
            print("will sleep for 100s")
            httpx.get(naver_station_query_root_url, params=dict(query="다른역", displayCount=1, lang='ko'))
            time.sleep(100) # sleep for 100s!

            # one more time
            station_res_json = None
            for i in range(MAX_QUERY_RETRY):
                time.sleep(delay*i)
                if not i == 0 : print(f"One more time: Retrying query for {i} time more...")
                station_res = httpx.get(naver_station_query_root_url,
                                        params=station_query_table)
                if station_res.status_code == 200:
                    station_res_json = station_res.json()
                    break

        assert station_res.status_code!=None, f"query retried {MAX_QUERY_RETRY} times more and slept 100s but keep showing status code that is not 200."

        self.station_raw_info = station_res_json['result']['place']['list'][0]
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
        if self.crawl_only_ten_places_for_test:
            NUM_PLACE_MAX = 10
        else:
            NUM_PLACE_MAX = 300 # by default, max 300 places for "강남역 맛집"

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
            if len(self.place_link_list) > NUM_PLACE_MAX:
                break
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
                if len(self.place_link_list) > NUM_PLACE_MAX:
                    break
                try:
                    self.place_link_list.append(item['id'])
                except AttributeError:
                    continue


        if not os.path.isdir(f'{self.photo_dir_path}'):
            os.mkdir(f'{self.photo_dir_path}')
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
        except KeyError:
            self.crawler_msg(f'menu images not exists, {link}')

        # get image_provided
        img_links_provided = []
        try:
            for item in res['images']:
                if item['type'] == 'DRT':
                    img_links_provided.append(item['url'])
            res['images'] = img_links_provided
        except (KeyError, TypeError):
            self.crawler_msg(f'img_provided not exists, {link}')

        # add items to current_place_db
        for key in parse_table_naver:
            try:
                place_db[parse_table_naver[key]]= res[key]
            except KeyError:
                self.crawler_msg(f'{link}, {parse_table_naver[key]} treated as None')
                place_db[parse_table_naver[key]] = None
        place_db['place_naver_link'] = f'{naver_restaurant_root_url}/{link}'
        place_db['parent_station_list'] = [self.naver_station_name]
        place_db['place_last_timestamp'] = datetime.date.today().isoformat()
        place_db['place_uuid'] = str(uuid.uuid5(uuid.NAMESPACE_DNS, link))

        try :
            place_db['place_time'] = res['previewImages'][-1]['modDate']
        except :
            place_db['place_time'] = None


        # make directory for images
        place_uuid = place_db['place_uuid']
        local_path = f'{self.photo_dir_path}/{place_uuid}'
        if not os.path.isdir(local_path):
            os.mkdir(local_path)
            os.mkdir(f'{local_path}/menu')
            os.mkdir(f'{local_path}/food')
            os.mkdir(f'{local_path}/inside')
            os.mkdir(f'{local_path}/thumbnail_inside')
            os.mkdir(f'{local_path}/thumbnail_food')

        # download menu, provided images
        # self._download_photo(place_db, 'menu')
        # self._download_photo(place_db, 'provided')
        
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
        self.current_place_db[f'place_{relations}_photo_list'] = img_links

        # download images
        # self._download_photo(self.current_place_db, relations)
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

	    place_reviews=None,
            place_time=None,

            place_main_photo_list=[],
            place_provided_photo_list=[],
            place_inside_photo_list=[],
            place_food_photo_list=[],
            place_menu_photo_list=[],
            
            place_telephone=None,
            place_last_timestamp=None,
            parent_station_list=[],
            place_coor_x=None,
            place_coor_y=None,
            place_views=0,
            place_likes=0, 
            place_recent_views=0,
        )

        self.current_place_db = place_document_empty
        self.current_place_db["parent_station_list"].append(self.naver_station_name)
        for link in self.place_link_list:
            try:
                validity = self._get_place_info_naver_basic(link)
                # if validity:
                    # self._get_place_info_naver_photo(link, relations='food')
                    # self._get_place_info_naver_photo(link, relations='inside')
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

    def _download_photo(self, place_db, img_type):
        if img_type is None:
            self.crawler_msg('type is empty')
            raise TypeError

        img_url_array = place_db[f'place_{img_type}_photo_list']
        place_uuid = place_db['place_uuid']

        if img_type == 'provided' or img_type == 'food' or img_type == 'inside':
            local_path_root = f'{self.photo_dir_path}/{place_uuid}'
            if img_type == 'provided':
                prefix = 'a'
            elif img_type == 'food':
                prefix = 'f'
            else:
                prefix = 'i'
        elif img_type == 'menu':
            local_path_root = f'{self.photo_dir_path}/{place_uuid}/menu'
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
            img_url_array[index] = (url, file_path) 

        return

    def save(self, name=None):
        if name is not None:
            path = f'{self.db_path}/{name}'
        else:
            path = f'{self.db_path}/db'
        data_body = [self.station_raw_info, self.place_db_list]

       # print(data_body)

        file = open(path, "wb+")
        dill.dump(data_body, file=file)
        file.close()
        return path

    def load(self, path):
        file = open(path, "rb")
        data_body = dill.load(file)
        self.station_raw_info = data_body[0]
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

def crawl(stations, search_keywords, crawler_options, 
    db_path, photo_dir_path, log_dir_path, crawl_only_ten_places_for_test):
    done_list = os.listdir(db_path)
    dhc = DoughCrawler(db_path, photo_dir_path, log_dir_path, crawl_only_ten_places_for_test)
    for station_name in stations:
        for search_keyword in search_keywords:
            if f'{station_name}_{search_keyword}' in done_list:
                continue
            else:
                dhc.run_crawler_naver(station_name=station_name, search_keyword=search_keyword, options=crawler_options)
