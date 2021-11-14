from dough_crawler import *
from firestore_lib import *
import time

"""
max_page = 1
# 장소 받기
print("핫 플레이스 검색: ")
place = input()
target_root = 'https://www.mangoplate.com'
target_url = target_root + '/search/{place}?keyword=&page={page}'
dhc = DoughCrawler()
for page in range(1, max_page + 1):
    dhc.driver_get(target_url, place=place, page=page)
    dhc.get_place_link_list_mangoplate('restaurant')
# print(dhc.place_link_list)

# 맛집 정보 파싱
dhc.get_place_info_mangoplate(target_root, place)
"""
station_name = '강남역'
dhc = DoughCrawler()
dhc.set_arg_naver(query=station_name + '맛집')
dhc.get_place_link_list_naver()
dhc.get_place_info_naver(station_name)
# time.sleep(3)
