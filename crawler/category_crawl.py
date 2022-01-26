"""
file for category crawling.
"""
import os, pickle

from numpy import iterable
from utils import csv_to_list, iterable_to_csv, create_dirs_if_not_exist
from dough_crawler import crawl_only_category

def save_only_diff(collected_category_dir_path, existing_category_to_tag_table_dir_path):
  for kind, kind_eng in [('술집', 'drink'), ('맛집', 'res'), ('카페','cafe')]:
    # union all the collected categories
    all_collected_categories = set()
    for entry in os.listdir(collected_category_dir_path):
      station_type_pickle = os.path.join(collected_category_dir_path, entry)
      if not station_type_pickle.endswith(f'_{kind}.pkl'): continue 
    
      collected_categories_for_current_station_type = pickle.load(open(station_type_pickle, "rb")) # e.g. category set colleted for 강남역_맛집
      all_collected_categories.update(collected_categories_for_current_station_type)

    # open existing category csv and compute difference
    existing_categories = set(csv_to_list(f"{existing_category_to_tag_table_dir_path}/category_to_tag_table_{kind_eng}.csv", encoding='cp949')[1:])
    new_categories = all_collected_categories.difference(existing_categories)
    iterable_to_csv(new_categories, csv_path=f"{existing_category_to_tag_table_dir_path}/new_cat_{kind}.csv")


if __name__ == "__main__":
    DB_DIR_PATH = "./raw_db"
    PHOTO_DIR_PATH = "./temp_img"
    LOG_DIR_PATH = "./log"
    COLLECTED_CATEGORY_DIR_PATH = "./collected_categories"
    EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    create_dirs_if_not_exist([DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, COLLECTED_CATEGORY_DIR_PATH, EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH])

    STATIONS = csv_to_list("./all_metro_list.csv")
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    DO_CRAWL = False
    DO_COMPUTE_DIFF = True 

    if DO_CRAWL:
      crawl_only_category(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, 
      DB_DIR_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST, COLLECTED_CATEGORY_DIR_PATH)

    if DO_COMPUTE_DIFF:
      save_only_diff(COLLECTED_CATEGORY_DIR_PATH , EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH)