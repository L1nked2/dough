from dough_crawler import *
from firestore_lib import *
import time
import csv


def naver_run_crawler(dhc, options, station_name, search_keyword):
    print(f'{station_name} {search_keyword} crawling start')
    dhc.clear(**options)
    dhc.set_arg_naver(station=station_name, search_keyword=search_keyword, delay=3)
    dhc.get_place_link_list_naver()
    dhc.get_place_info_naver()
    dhc.save(name=f'{station_name}_{search_keyword}')

    # test code for category analysis
    db_list = dhc.get_db_list()
    category_csv_path = f'category_output/{station_name}_{search_keyword}.csv'
    f = open(category_csv_path, 'w+', encoding='ANSI', newline='')
    wr = csv.writer(f)
    for item in db_list:
        wr.writerow([item.get_value('place_name'), item.get_value('place_category')])
    f.close()
    print(f'{station_name} {search_keyword} crawling done')


stations = ['강남역', '뚝섬역', '합정역']
search_keywords = ['맛집', '카페', '술집']
crawler_options = dict(log=True, msg=True)
done_list = os.listdir('./raw_db')

dhc = DoughCrawler()
for station_name in stations:
    for search_keyword in search_keywords:
        if f'{station_name}_{search_keyword}_db' in done_list:
            continue
        naver_run_crawler(dhc, crawler_options, station_name, search_keyword)


