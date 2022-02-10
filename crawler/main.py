from utils import create_dirs_if_not_exist, csv_to_list
from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db, update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly, update_cluster
import os

if __name__ == "__main__":

    ## shared configs
    DB_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/raw_db"
    PHOTO_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/temp_img"
    LOG_DIR_PATH = "/media/k/DIR_FOR_CRAWLING/log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    create_dirs_if_not_exist([DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH])

    ## configs for crawling
    DO_CRAWL = False
    ALREADY_CRAWLED_STATIONS = ['가정중앙시장역', '가좌역', '가평역', '강남대역', '강남역', '강매역', '강촌역', '개봉역', '개포동역', '개화역', '건대입구역', '계양역', '고잔역', '곡산역', '공릉역', '광명사거리역', '구래역', '구로디지털단지역', '구반포역', '구산역', '구의역', '굽은다리역', '금촌역', '기흥역', '길동역', '길음역', '김유정역', '김포공항역', '까치산역', '남춘천역', '남한산성입구역', '논현역', '달미역', '대흥역', '덕소역', '덕정역', '도화역', '독바위역', '독정역', '돌곶이역', '동두천역', '동두천중앙역', '동인천역', '동춘역', '둔전역', '둔촌오륜역', '마두역', '마포구청역', '마포역', '명일역', '모란역', '문래역', '문정역', '미금역', '발곡역', '백석역', '백양리역', '버티고개역', '범골역', '부천시청역', '사당역', '사리역', '산성역', '삼산체육관역', '삼송역', '상갈역', '상록수역', '상봉역', '상일동역', '서울대입구역', '서울숲역', '서울역역', '서정리역', '서현역', '석계역', '석바위시장역', '석천사거리역', '선릉역', '선정릉역', '성균관대역', '성신여대입구역', '성환역', '소래포구역', '솔밭공원역', '송내역', '송탄역', '송파역', '수지구청역', '수진역', '숭의역', '시우역', '시흥능곡역', '시흥대야역', '신갈역', '신금호역', '신사역', '신설동역', '신용산역', '신중동역', '신풍역', '신현역', '안국역', '야목역', '약수역', '양재시민의숲역', '양정역', '양주역', '양천향교역', '어룡역', '어천역', '역곡역', '연수역', '영등포구청역', '영등포역', '예술회관역', '오목천역', '오산대역', '오산역', '온수역', '왕십리역', '원당역', '원덕역', '월드컵경기장역', '을지로3가역', '인천공항2터미널역', '인천터미널역', '작전역', '잠실역', '장한평역', '전대.에버랜드역', '정발산역', '정부과천청사역', '제물포역', '지석역', '지축역', '지행역', '진위역', '청계산입구역', '청명역', '탑석역', '퇴계원역', '파주역', '풍산역', '한남역', '한대앞역', '한양대역', '홍대입구역', '효창공원앞역', '흥선역']
    ALL_STATIONS = [station+"역" for station in csv_to_list("./all_metro_list.csv")]
    STATIONS = list (set(ALL_STATIONS) - set(ALREADY_CRAWLED_STATIONS))
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)    
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    ## configs for upload
    DO_UPLOAD = True
    ALREADY_UPLOADED_STATIONS = ['효창공원앞역_맛집', '범골역_카페', '마포구청역_맛집', '까치산역_카페', '풍산역_술집', '돌곶이역_맛집', '상갈역_카페', '김유정역_술집', '동두천중앙역_맛집', '서울대입구역_카페', '사리역_술집', '양재시민의숲역_맛집', '예술회관역_술집', '동인천역_술집', '야목역_술집', '솔밭공원역_카페', '수지구청역_술집', '영등포구청역_카페', '동두천역_술집', '전대.에버랜드역_맛집', '남한산성입구역_카페', '청명역_카페', '백석역_맛집', '모란역_술집', '개봉역_카페', '서현역_술집', '안국역_맛집', '금촌역_술집', '온수역_술집', '고잔역_카페', '어룡역_술집', '서현역_맛집', '강매역_술집']
    STATIONS_CRAWLED = os.listdir(DB_DIR_PATH)
    STATIONS_TO_UPLOAD = sorted(list(set(STATIONS_CRAWLED)-set(ALREADY_UPLOADED_STATIONS)))
    print(STATIONS_TO_UPLOAD)

    ## configs for upload_station
    DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY = False

    ## configs for update_cluster
    DO_UPADTE_CLUSTER = False
    CLUSTER_RESULT_PATH = "./sample_cluster_result.pkl"

    if DO_CRAWL:
        print(STATIONS)        
        crawl(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST)
    if DO_UPLOAD:
        convert_documents_and_upload_to_db (STATIONS_TO_UPLOAD, DB_DIR_PATH,  PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH)
    if DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY:
        update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly(STATIONS_CRAWLED, DB_DIR_PATH)
    if DO_UPADTE_CLUSTER:
        update_cluster(CLUSTER_RESULT_PATH)
