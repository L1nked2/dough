from dough_crawler import *
from firestore_lib import *
import time
import csv

stations = ['강남역', '뚝섬역', '합정역']
search_keywords = ['맛집', '카페', '술집']
crawler_options = dict(log=True, msg=True)
done_list = os.listdir('./raw_db')

dhc = DoughCrawler()
for station_name in stations:
    for search_keyword in search_keywords:
        if f'{station_name}_{search_keyword}_db' in done_list:
            continue
        else:
            dhc.run_crawler_naver(station_name=station_name, search_keyword=search_keyword, options=crawler_options)
            # test code for category analysis
            """
            db_list = dhc.get_db_list()
            category_csv_path = f'category_output/{station_name}_{search_keyword}.csv'
            f = open(category_csv_path, 'w+', encoding='ANSI', newline='')
            wr = csv.writer(f)
            for item in db_list:
                wr.writerow([item.get_value('place_name'), item.get_value('place_category')])
            f.close()
            """


