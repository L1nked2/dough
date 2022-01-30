from utils import create_dirs_if_not_exist, csv_to_list
from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db, update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly, update_cluster

if __name__ == "__main__":
    DB_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/raw_db"
    PHOTO_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/temp_img"
    LOG_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    create_dirs_if_not_exist([DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH])
    CLUSTER_RESULT_PATH = "./sample_cluster_result.pkl"

    ALL_STATIONS = [station+"역" for station in csv_to_list("./all_metro_list.csv")]
    STATIONS = list (set(ALL_STATIONS) - set(["구로디지털단지역", "홍대입구역", "선릉역", "잠실역", "강남역"]))
    print(STATIONS)
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    DO_CRAWL = True
    DO_UPLOAD = False
    DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY = False
    DO_UPADTE_CLUSTER = False

    if DO_CRAWL:
        crawl(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST)
    if DO_UPLOAD:
        convert_documents_and_upload_to_db (DB_DIR_PATH, PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH)
    if DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY:
        update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly(DB_DIR_PATH)
    if DO_UPADTE_CLUSTER:
        update_cluster(CLUSTER_RESULT_PATH)
