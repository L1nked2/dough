"""
file for category creating
"""
import os, pickle

from utils import csv_to_list, iterable_to_csv, create_dirs_if_not_exist
from category_crawler import crawl_only_category

def save_only_diff(collected_category_dir_path, existing_category_to_tag_table_dir_path):
  entire_existing_categories= set()
  # 'other' : 호텔같은 category ... 이미 한 번 봐서 category_to_tag_table_other.csv에 저장되어 있다면,
  # new_cat_{kind}.csv 에 다시 들어가지 않게 제외시켜야 함
  for kind_eng in ['drink', 'res', 'cafe', 'other']:
    existing_categories = set(csv_to_list(f"{existing_category_to_tag_table_dir_path}/category_to_tag_table_{kind_eng}.csv", encoding='cp949')[1:])
    entire_existing_categories.update(existing_categories)

  for kind, kind_eng in [('술집', 'drink'), ('맛집', 'res'), ('카페','cafe')]:
    # union all the collected categories
    all_collected_categories = set()
    for entry in os.listdir(collected_category_dir_path):
      station_type_pickle = os.path.join(collected_category_dir_path, entry)
      if not station_type_pickle.endswith(f'_{kind}.pkl'): continue 
    
      collected_categories_for_current_station_type = pickle.load(open(station_type_pickle, "rb")) # e.g. category set colleted for 강남역_맛집
      all_collected_categories.update(collected_categories_for_current_station_type)

    new_categories = all_collected_categories.difference(entire_existing_categories)
    iterable_to_csv(new_categories, csv_path=f"{existing_category_to_tag_table_dir_path}/new_cat_{kind}.csv")


if __name__ == "__main__":
    DB_DIR_PATH = "./raw_db"
    PHOTO_DIR_PATH = "./temp_img"
    LOG_DIR_PATH = "./log"
    COLLECTED_CATEGORY_DIR_PATH = "./collected_categories"
    EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    create_dirs_if_not_exist([DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, COLLECTED_CATEGORY_DIR_PATH, EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH])

    STATIONS = [station+"역" for station in csv_to_list("./all_metro_list.csv")][239:] # ["구로디지털단지역", "홍대입구역", "선릉역", "잠실역", "강남역"]
    print(STATIONS)   
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    DO_CRAWL = False
    DO_COMPUTE_DIFF = True

    if DO_CRAWL:
      crawl_only_category(STATIONS, SEARCH_KEYWORD, COLLECTED_CATEGORY_DIR_PATH, 'naver_get_restaurants_query.json')
      
    if DO_COMPUTE_DIFF:
      save_only_diff(COLLECTED_CATEGORY_DIR_PATH, EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH)