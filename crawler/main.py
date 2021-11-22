from dough_crawler import *
from firestore_lib import *
import time
import csv


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
dhc = DoughCrawler()

dhc.clear()
station_name = '강남역'
dhc.set_arg_naver(station=station_name, search_keyword='맛집', delay=1)
print('naver_link_list_get start')
dhc.get_place_link_list_naver()
print('naver_link_list_get done')
print('naver_info_get start')
dhc.get_place_info_naver(station_name)
print('naver_info_get done')
time.sleep(10)
print('upload_db start')
upload_db(dhc.place_db_list, db_type='place')
print('upload_db done')

# test code for category analysis
db_list = dhc.get_db_list()
category_set_1 = set()
category_set_2 = set()
for item in db_list:
    category_set_1.add(item.get_value('place_category')[0])
    category_set_2.add(item.get_value('place_category')[1])
f1 = open('category_output_1.csv', 'w+', encoding='utf-8', newline='')
f2 = open('category_output_2.csv', 'w+', encoding='utf-8', newline='')
wr1 = csv.writer(f1)
wr2 = csv.writer(f2)
wr1.writerow(list(category_set_1))
wr2.writerow(list(category_set_2))
f1.close()
f2.close()
print('all process done')
# time.sleep(3)
