"""
file for category crawling.
"""
import os, pickle, csv
from dough_crawler import crawl_only_category

def csv_to_list(csv_path):
  lst = list()
  with open(csv_path,'r') as f:
      reader = csv.reader(f)
      for row in reader:
          lst.append(row[0])
  print(lst)
  return lst

def save_only_diff(collected_category_dir_path, existing_category_to_tag_table_dir_path):

  ##### for kind in ['술집', '맛집', '카페] --> 각각 kind 마다 all_collected_categories 하나, diff csv 하나 있어야 함
  
  all_collected_categories = set()
  for entry in os.listdir(collected_category_dir_path):
    station_type_pickle = os.path.join(collected_category_dir_path, entry)
    if not station_type_pickle.endswith('.pkl'): continue 
  
    collected_categories_for_current_station_type = pickle.load(open(station_type_pickle, "rb")) # e.g. category set colleted for 강남역_맛집
    assert isinstance(collected_categories_for_current_station_type, set)
    all_collected_categories.update(collected_categories_for_current_station_type)

  # open and set difference --> into csv

  pass 


if __name__ == "__main__":
    DB_PATH = "/media/k/DB/DIR_FOR_CRAWLING/raw_db"
    PHOTO_DIR_PATH = "/media/k/DB/DIR_FOR_CRAWLING/temp_img"
    LOG_DIR_PATH = "/media/k/DB/DIR_FOR_CRAWLING/log"
    COLLECTED_CATEGORY_DIR_PATH = "/media/k/DB/DIR_FOR_CRAWLING/collected_categories"

    STATIONS = csv_to_list("./all_metro_list.csv")
    SEARCH_KEYWORD = ['술집', '카페', '맛집']
    CRAWLER_OPTIONS = dict(log=True, msg=True)
    CRAWL_ONLY_TEN_PLACES_FOR_TEST = False

    crawl_only_category(STATIONS, SEARCH_KEYWORD, CRAWLER_OPTIONS, 
    DB_PATH, PHOTO_DIR_PATH, LOG_DIR_PATH, CRAWL_ONLY_TEN_PLACES_FOR_TEST, COLLECTED_CATEGORY_DIR_PATH)

    EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH = "./cat_to_tag_table"
    # save_only_diff(COLLECTED_CATEGORY_DIR_PATH , EXISTING_CATEGORY_TO_TAG_TABLE_DIR_PATH)