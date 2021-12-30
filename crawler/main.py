from dough_crawler import *
# from firestore_lib import *

def crawl(stations, search_keywords, crawler_options, done_list):
    dhc = DoughCrawler()
    for station_name in stations:
        for search_keyword in search_keywords:
            if f'{station_name}_{search_keyword}' in done_list:
                continue
            else:
                dhc.run_crawler_naver(station_name=station_name, search_keyword=search_keyword, options=crawler_options)

def upload_to_db(raw_db):
    raise NotImplementedError
    # TODO
    # (1) open `./raw_db` and start converting & uploading
    # raw_db is the file dumped with `dill`

if __name__ == "__main__":
    stations = ['강남역', '뚝섬역', '합정역']
    search_keywords = ['맛집', '카페', '술집']
    crawler_options = dict(log=True, msg=True)
    done_list = os.listdir('./raw_db')

    #crawl(stations, search_keywords, crawler_options, done_list)

    upload_to_db(raw_db=done_list)