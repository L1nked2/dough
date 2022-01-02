from dough_crawler import *
from firebase_db import convert_documents_and_upload_to_db
# from firestore_lib import *

def crawl(stations, search_keywords, crawler_options, done_list):
    dhc = DoughCrawler()
    for station_name in stations:
        for search_keyword in search_keywords:
            if f'{station_name}_{search_keyword}' in done_list:
                continue
            else:
                dhc.run_crawler_naver(station_name=station_name, search_keyword=search_keyword, options=crawler_options)

def upload_to_db(raw_db : str):
    convert_documents_and_upload_to_db(raw_db)

if __name__ == "__main__":
    DB_PATH = "./old_raw_db"
    stations = ['강남역', '뚝섬역', '합정역']
    search_keywords = ['맛집', '카페', '술집']
    crawler_options = dict(log=True, msg=True)
    done_list = os.listdir(DB_PATH)

    #crawl(stations, search_keywords, crawler_options, done_list)

    upload_to_db(DB_PATH)