from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db

if __name__ == "__main__":
    DB_PATH = "./raw_db"
    PHOTO_DIR_PATH = "./temp_img"
    LOG_DIR_PATH = "./log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    STATIONS = ['합정역']
    SEARCH_KEYWORD = ['술집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = True

    DO_CRAWL = True
    DO_UPLOAD = True

    if DO_CRAWL:
        crawl(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST)
    if DO_UPLOAD:
        convert_documents_and_upload_to_db (DB_PATH, PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH)