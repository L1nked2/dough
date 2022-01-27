import pickle
import json
import time
import httpx, requests
from copy import deepcopy

NAVER_STATION_QUERY_ROOT_URL = 'https://map.naver.com/v5/api/search'
NAVER_GRAPHQL_URL = 'https://pcmap-api.place.naver.com/graphql'
NAVER_RESTAURANT_API_ROOT_URL = 'https://map.naver.com/v5/api/sites/summary'
MAX_QUERY_RETRY = 10
RETRY_DELAY = 3
MAX_NUM_PAGES = 6

class CategoryCrawler:
  def __init__(self, collected_category_dir_path, naver_restaurant_query_json_path):
    self._collected_category_dir_path = collected_category_dir_path
    with open(naver_restaurant_query_json_path, "r", encoding='utf-8') as f:
      self._naver_restaurant_query_json = json.load(f)

  # def _get_station_info(self, station):
  #   # send station query
  #   for i in range(MAX_QUERY_RETRY):
  #     time.sleep(RETRY_DELAY*i)
  #     if not i == 0 : print(f"Retrying station query for {i} time more...")
  #     station_resp = httpx.get(NAVER_STATION_QUERY_ROOT_URL, params=dict(query=station, displayCount=1, lang='ko'))
  #     if station_resp.status_code == 200: break
  #   assert station_resp.status_code == 200, f"Station query retried {MAX_QUERY_RETRY} times more but still status code {station_resp.status_code}, not 200"
  #   station_raw_info = station_resp.json()['result']['place']['list'][0]
  #   return station_raw_info

  def _get_cookie(self):
    cookie_res = requests.get("https://www.naver.com/")
    if cookie_res.status_code == 200:
      site_cookies = cookie_res.cookies.get_dict()
    return site_cookies

  def _get_place_links(self, station, search_keyword, cookies):
    HEADER = {
      "method": "POST", "content-type": "application/json",
      "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/95.0.4638.69 Safari/537.36"
    }

    place_links = [] 
    for pageIdx in range(MAX_NUM_PAGES):
      # set query
      place_links_query_json = deepcopy(self._naver_restaurant_query_json)
      place_links_query_json['variables']['input']['query'] = f'{station} {search_keyword}'
      place_links_query_json['variables']['input']['start'] = 50 * pageIdx + 1
      place_links_query_str = json.dumps(place_links_query_json)

      # send query
      for i in range(MAX_QUERY_RETRY):
        time.sleep(RETRY_DELAY*i)
        if not i == 0 : print(f"Retrying place query for {i} time more...")
        #################################################
        place_raw_links_resp = requests.post(url=NAVER_GRAPHQL_URL, headers=HEADER,
                              data=place_links_query_str, cookies=cookies)
        # GraphQL 말고 naver api get으로!! <-- 이거 안 끊김
        if place_raw_links_resp.status_code == 200: break
      assert place_raw_links_resp.status_code == 200, f"Restaurant query retried {MAX_QUERY_RETRY} times more but still status code {place_raw_links_resp.status_code}, not 200"
      place_raw_links = place_raw_links_resp.json()['data']['restaurants']['items']
      place_links.extend([place_raw_link['id'] for place_raw_link in place_raw_links])
    return place_links

  def _collect_categories(self, place_links):
    collected_categories = set()
    for place_link in place_links:
      place_full_link = f'{NAVER_RESTAURANT_API_ROOT_URL}/{place_link}'
      
      for i in range(MAX_QUERY_RETRY):
        try:
          place_resp = requests.get(url=place_full_link, params={"lang" : "ko"})
          break
        except requests.exceptions.ConnectionError:
          print(f"connection error, retrying for {i}th time")
          time.sleep(5*i)

      if not place_resp.status_code == 200:
        print(f"{place_link} request failed, status code {place_resp.status_code}")
        continue
      place_resp_json = place_resp.json()

      if not 'category' in place_resp_json.keys():
        print(f"category not in json of f{place_link}")
        continue
      place_category = place_resp_json['category']
      collected_categories.add(place_category)
    return collected_categories

  def _save(self, station, search_keyword, collected_categories):
    with open(f"{self._collected_category_dir_path}/cat_{station}_{search_keyword}.pkl", 'wb') as f:
      print(collected_categories)
      pickle.dump(collected_categories, f)

  def run(self, station, search_keyword):
    cookies = self._get_cookie()
    place_links = self._get_place_links(station, search_keyword, cookies)
    collected_categories = self._collect_categories(place_links)
    self._save(station, search_keyword, collected_categories)


def crawl_only_category(stations, search_keywords, collected_category_dir_path,
  naver_restaurant_query_json_path):
  
  category_crawler = CategoryCrawler(collected_category_dir_path, naver_restaurant_query_json_path)
  for station in stations:
    for search_keyword in search_keywords:
      print(f"{station}_{search_keyword}")
      category_crawler.run(station, search_keyword)
