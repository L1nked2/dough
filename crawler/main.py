from utils import create_dirs_if_not_exist, csv_to_list
from dough_crawler import crawl
from firebase_db import convert_documents_and_upload_to_db, update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly, update_cluster
import os
import argparse

if __name__ == "__main__":
    ## parse execution options
    parser = argparse.ArgumentParser(description='Which functionality do you want to run?')
    parser.add_argument('--disk_path', required=True, help="path to mount location of disk, e.g. /media/k")
    parser.add_argument('--execution_kind', required=True,  choices=['crawl', 'upload', 'update_station', 'update_cluster'])
    # upload_num only needed for `'upload'` case
    parser.add_argument('--upload_num', choices=[0,1,2,3], type=int, default=-1)
    parser.add_argument('--crawler_num', choices=[0,1,2,3], type=int, default=-1)
    args = parser.parse_args()
    disk_path = args.disk_path
    execution_kind = args.execution_kind
    upload_num = args.upload_num
    crawler_num = args.crawler_num
    
    if execution_kind == 'upload':
        assert upload_num in [0,1,2,3], "should provided different upload num for each terminal, chosen from 0,1,2,3"
    if execution_kind == 'crawl':
        assert crawler_num in [0,1,2,3], "should provided different crawler num for each terminal, chosen from 0,1,2,3"

    ## shared configs
    DB_DIR_PATH = f"{disk_path}/DIR_FOR_CRAWLING/raw_db"
    PHOTO_DIR_PATH = f"{disk_path}/DIR_FOR_CRAWLING/temp_img"
    LOG_DIR_PATH = f"{disk_path}/DIR_FOR_CRAWLING/log"
    CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    create_dirs_if_not_exist([DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH])

    ## configs for crawling
    DO_CRAWL = execution_kind == 'crawl'
    CRAWLER_NUM = int(crawler_num)
    ALL_STATIONS = [station+"역" for station in csv_to_list("./all_metro_list.csv")]
    ALREADY_CRAWLED_STATIONS = ['가정중앙시장역', '가좌역', '가천대역', '강남대역', '강남역', '강동역', '강매역', '강촌역', '개롱역', '개봉역', '개포동역', '개화역', '건대입구역', '검단사거리역', '계산역', '계양역', '고속터미널역', '고잔역', '곡산역', '공릉역', '관악역', '광명사거리역', '구래역', '구로디지털단지역', '구반포역', '구산역', '구의역', '구일역', '굴봉산역', '굽은다리역', '귤현역', '금곡역', '금천구청역', '금촌역', '기흥역', '길동역', '길음역', '김량장역', '김유정역', '김포공항역', '까치산역', '남춘천역', '남한산성입구역', '녹천역', '달미역', '답십리역', '대야미역', '대청역', '대치역', '대흥역', '덕소역', '덕정역', '도화역', '독바위역', '독정역', '돌곶이역', '동대입구역', '동두천역', '동두천중앙역', '동인천역', '동춘역', '둔전역', '둔촌오륜역', '마두역', '마산역', '마장역', '마포구청역', '마포역', '망우역', '면목역', '명일역', '모란역', '무악재역', '문래역', '문정역', '미금역', '미아역', '발곡역', '백석역', '백양리역', '버티고개역', '범골역', '보산역', '봉천역', '부발역', '부천시청역', '부천역', '북한산우이역', '불광역', '사당역', '사릉역', '사리역', '산곡역', '산성역', '삼산체육관역', '삼송역', '삼양역', '상갈역', '상록수역', '상봉역', '상일동역', '상현역', '서울대입구역', '서울숲역', '서울역역', '서정리역', '서현역', '석계역', '석남역', '석바위시장역', '석천사거리역', '선릉역', '선정릉역', '선학역', '성균관대역', '성신여대입구역', '성환역', '세류역', '소래포구역', '소사역', '솔밭공원역', '송내역', '송산역', '송탄역', '송파역', '수원시청역', '수진역', '숭의역', '시우역', '시청역', '시흥능곡역', '시흥대야역', '신갈역', '신내역', '신논현역', '신당역', '신목동역', '신사역', '신설동역', '신연수역', '신용산역', '신중동역', '신풍역', '신현역', '아산역', '안국역', '안산역', '안양역', '야목역', '약수역', '양재시민의숲역', '양정역', '양주역', '양천향교역', '어룡역', '어천역', '여의도역', '역곡역', '역촌역', '연수역', '영등포구청역', '영등포역', '예술회관역', '오금역', '오류동역', '오목천역', '오산역', '오이도역', '온수역', '온양온천역', '왕십리역', '용두역', '용문역', '운연역', '원당역', '원덕역', '원시역', '월드컵경기장역', '을지로3가역', '을지로입구역', '이태원역', '인천공항2터미널역', '인천역', '인천터미널역', '인하대역', '일원역', '임학역', '작전역', '잠실역', '장승배기역', '장한평역', '전대.에버랜드역', '정발산역', '정부과천청사역', '정자역', '제물포역', '종합운동장역', '중곡역', '중화역', '증미역', '지석역', '지축역', '지행역', '진위역', '천안역', '천호역', '청계산입구역', '청담역', '청명역', '탑석역', '테크노파크역', '퇴계원역', '파주역', '판교역', '평택역', '풍산역', '학여울역', '한남역', '한대앞역', '한양대역', '홍대입구역', '효자역', '효창공원앞역', '흥선역', '가산디지털단지역', '갈매역', '강동구청역', '강변역', '거여역', '검단오류역', '경기광주역', '경기도청북부청사역', '경마공원역', '경복궁역', '고색역', '공항시장역', '과천역', '광운대역', '광화문역', '구파발역', '군포역', '금호역', '남동인더스파크역', '내방역', '능곡역', '당정역', '대방역', '덕계역', '도봉산역', '도봉역', '독립문역', '독산역', '동묘앞역', '동천역', '두정역', '등촌역', '뚝섬역', '마곡역', '마전역', '마천역', '매봉역', '매탄권선역', '먹골역', '몽촌토성역', '문산역', '방화역', '배방역', '백마역', '별내역', '병점역', '보평역', '복정역', '봉명역', '부평역', '사가정역', '산본역', '삼각지역', '삼성역', '상계역', '상동역', '상왕십리역', '상월곡역', '상천역', '새절역', '서강대역', '서대문역', '서동탄역', '성복역', '성수역', '세종대왕릉역', '송도달빛축제공원역', '송정역', '수리산역', '수서역', '수지구청역', '시민공원역', '신반포역', '신방화역', '신원역', '신이문역', '신정네거리역', '신창역', '쌍용역', '아신역', '암사역', '압구정로데오역', '애오개역', '야당역', '양촌역', '언주역', '여의나루역', '염창역', '영등포시장역', '오빈역', '완정역', '외대앞역', '용답역', '용마산역', '용산역', '우장산역', '운동장.송담대역', '월계역', '을지로4가역', '의정부시청역', '의정부중앙역', '이천역', '인천가좌역', '인천공항1터미널역', '인천대공원역', '인천대입구역', '일산역', '임진강역', '정릉역', '주안국가산단역', '중계역', '직산역', '천마산역', '청구역', '초당역', '초지역', '춘의역', '충무로역', '충정로역', '탄현역', '태릉입구역', '평내호평역', '평촌역', '평택지제역', '하남검단산역', '한강진역', '한티역', '화전역', '회룡역']

    ALL_STATIONS_TO_CRAWL = list(set(ALL_STATIONS) - set(ALREADY_CRAWLED_STATIONS))
    NUM_STATIONS_TO_CRAWL_PER_TERMINAL = int(len(ALL_STATIONS_TO_CRAWL) / len([0,1,2,3]))
    STATIONS_TO_CRAWL = ALL_STATIONS_TO_CRAWL[CRAWLER_NUM*NUM_STATIONS_TO_CRAWL_PER_TERMINAL : (CRAWLER_NUM+1)*NUM_STATIONS_TO_CRAWL_PER_TERMINAL]

    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)    
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    ## configs for upload
    DO_UPLOAD = execution_kind=='upload'
    UPLOAD_NUM = int(upload_num)
    ALREADY_UPLOADED_STATIONS = []

    STATIONS_CRAWLED = os.listdir(DB_DIR_PATH)
    ALL_STATIONS_TO_UPLOAD = sorted(list(set(STATIONS_CRAWLED)-set(ALREADY_UPLOADED_STATIONS)))
    NUM_STATIONS_TO_UPLOAD_PER_TERMINAL = int(len(ALL_STATIONS_TO_UPLOAD) / len([0,1,2,3]))
    STATIONS_TO_UPLOAD = ALL_STATIONS_TO_UPLOAD[UPLOAD_NUM*NUM_STATIONS_TO_UPLOAD_PER_TERMINAL : (UPLOAD_NUM+1)*NUM_STATIONS_TO_UPLOAD_PER_TERMINAL]

    ## configs for upload_station
    DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY = execution_kind == 'update_station'

    ## configs for update_cluster
    DO_UPADTE_CLUSTER = execution_kind == 'update_cluster'
    CLUSTER_RESULT_PATH = "./sample_cluster_result.pkl"

    if DO_CRAWL:
        print(STATIONS_TO_CRAWL)        
        crawl(STATIONS_TO_CRAWL, SEARCH_KEYWORD, CRAWLER_OPTIONS, DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST)
    if DO_UPLOAD:
        print(STATIONS_TO_UPLOAD)
        convert_documents_and_upload_to_db (STATIONS_TO_UPLOAD, DB_DIR_PATH,  PHOTO_DIR_PATH, CATEGORY_TO_TAG_TABLE_DIR_PATH)
    if DO_UPDATE_STATION_DB_IN_CASE_UPLOAD_TERMINATED_UNEXPECTEDLY:
        update_station_db_in_case_convert_documents_and_upload_to_db_terminated_unexpectedly(ALREADY_UPLOADED_STATIONS, DB_DIR_PATH)
    if DO_UPADTE_CLUSTER:
        update_cluster(CLUSTER_RESULT_PATH)
