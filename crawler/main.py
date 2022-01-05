from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db

if __name__ == "__main__":
    DB_PATH = "./raw_db" # "./old_raw_db"
    PHOTO_DIR_PATH = "./temp_img"
    LOG_DIR_PATH = "./log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    STATIONS = ['강남역', '뚝섬역', '합정역']
    SEARCH_KEYWORD = ['맛집', '카페', '술집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)

    DO_CRAWL = True   
    DO_UPLOAD = False

    """
    USE_OLD_DB
    What is this?

    (1) the already-cralwed data in `old_raw_db` (previously named `raw_db`)
    contains dumped data of class `DB` of `firestore_lib.py`.

    (2) But we're not using `firestore_lib.py` anymore, thus no `DB` class either. 
        Crawler in `dough_crawler` now stores the data about place with dictionary type, instead of `DB` class.

    (3) In order to load alread-ycrawled data in `old_raw_db`, we need to bring back `DB` class of `firestore_lib.py`

    (4) After 22-01-04 (Tue), we'll crawl from the beginning with current cralwer, and will deprecate `old_raw_db`.
        This code section is only necessary until 22-01-04 (Tue).
    """
    USE_OLD_DB = True

    if DO_CRAWL:
        crawl(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH)
    if DO_UPLOAD:
        convert_documents_and_upload_to_db (DB_PATH, PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH, USE_OLD_DB)