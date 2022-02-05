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
    ALREADY_CRAWLED_STATIONS = ["구로디지털단지역", "홍대입구역", "선릉역", "잠실역", "강남역"] + ['가정중앙시장역', '가정중앙시장역', '가정중앙시장역', '가좌역', '가좌역', '가좌역', '가평역', '가평역', '강남역', '강남역', '강남역', '강매역', '강매역', '강매역', '강촌역', '강촌역', '강촌역', '개포동역', '개포동역', '개포동역', '건대입구역', '건대입구역', '건대입구역', '계양역', '계양역', '계양역', '광명사거리역', '광명사거리역', '광명사거리역', '구래역', '구래역', '구래역', '구로디지털단지역', '구로디지털단지역', '구로디지털단지역', '구산역', '구산역', '구산역', '기흥역', '기흥역', '기흥역', '길음역', '길음역', '길음역', '까치산역', '까치산역', '까치산역', '논현역', '대흥역', '대흥역', '대흥역', '덕소역', '덕소역', '덕소역', '덕정역', '덕정역', '덕정역', '도화역', '도화역', '도화역', '독바위역', '독바위역', '독바위역', '동춘역', '동춘역', '동춘역', '둔촌오륜역', '둔촌오륜역', '둔촌오륜역', '마포구청역', '마포구청역', '마포구청역', '마포역', '마포역', '마포역', '명일역', '명일역', '명일역', '모란역', '모란역', '모란역', '발곡역', '발곡역', '발곡역', '백석역', '백석역', '백석역', '백양리역', '백양리역', '백양리역', '부천시청역', '부천시청역', '부천시청역', '사리역', '사리역', '사리역', '산성역', '산성역', '산성역', '삼송역', '삼송역', '삼송역', '상봉역', '상봉역', '상봉역', '상일동역', '상일동역', '상일동역', '서울숲역', '서울숲역', '서울숲역', '서울역역', '서울역역', '서울역역', '석바위시장역', '석바위시장역', '석바위시장역', '선릉역', '선릉역', '선릉역', '성균관대역', '성균관대역', '성균관대역', '성환역', '성환역', '성환역', '소래포구역', '소래포구역', '소래포구역', '솔밭공원역', '솔밭공원역', '솔밭공원역', '송내역', '송내역', '송내역', '송탄역', '송탄역', '송탄역', '숭의역', '숭의역', '숭의역', '시흥능곡역', '시흥능곡역', '시흥능곡역', '시흥대야역', '시흥대야역', '시흥대야역', '신설동역', '신설동역', '신설동역', '신중동역', '신중동역', '신중동역', '신풍역', '신풍역', '야목역', '야목역', '야목역', '약수역', '약수역', '약수역', '양재시민의숲역', '양재시민의숲역', '양재시민의숲역', '양정역', '양정역', '양정역', '연수역', '연수역', '연수역', '영등포구청역', '영등포구청역', '영등포구청역', '영등포역', '영등포역', '영등포역', '예술회관역', '예술회관역', '예술회관역', '원당역', '원당역', '원당역', '월드컵경기장역', '월드컵경기장역', '월드컵경기장역', '을지로3가역', '을지로3가역', '을지로3가역', '잠실역', '잠실역', '잠실역', '장한평역', '장한평역', '장한평역', '전대.에버랜드역', '전대.에버랜드역', '전대.에버랜드역', '지석역', '지석역', '지석역', '퇴계원역', '퇴계원역', '퇴계원역', '풍산역', '풍산역', '풍산역', '한대앞역', '한대앞역', '한대앞역', '한양대역', '한양대역', '한양대역', '홍대입구역', '홍대입구역', '홍대입구역', '효창공원앞역', '효창공원앞역', '효창공원앞역', '흥선역', '흥선역', '흥선역']
    STATIONS = list (set(ALL_STATIONS) - set(ALREADY_CRAWLED_STATIONS))
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
