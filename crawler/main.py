from turtle import update
from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db, update_cluster

if __name__ == "__main__":
    DB_PATH = "./raw_db"
    PHOTO_DIR_PATH = "./temp_img"
    LOG_DIR_PATH = "./log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    CLUSTER_RESULT_PATH = "./sample_cluster_result.pkl"

    STATIONS = ['사당역']#, '방배역', '서초역', '교대역']
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    DO_CRAWL = True
    DOWNLOAD_PHOTO = False
    DO_UPLOAD = False
    DO_UPADTE_CLUSTER = False

    if DO_CRAWL:
        crawl(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST, DOWNLOAD_PHOTO)
    if DO_UPLOAD:
        convert_documents_and_upload_to_db (DB_PATH, PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH)
    if DO_UPADTE_CLUSTER:
        update_cluster(CLUSTER_RESULT_PATH)