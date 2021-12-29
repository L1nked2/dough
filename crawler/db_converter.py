from dough_crawler import *
from firestore_lib import *
import time
import numpy as np
import pandas as pd


"""
1-1 of convertor (read csv and fill category of Document object)
"""

cat_to_tag_table_path = f'./cat_to_tag_table'
db_list_path = './raw_db'
db_list_files = list(file for file in os.listdir(db_list_path)
                     if os.path.isfile(os.path.join(db_list_path, file)))
cat_to_tag_table_list = list()
cat_to_tag_table_list.append(
    pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_res.csv', encoding='cp949').to_numpy())
cat_to_tag_table_list.append(
    pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_cafe.csv', encoding='cp949').to_numpy())
cat_to_tag_table_list.append(
    pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_drink.csv', encoding='cp949').to_numpy())
dhc = DoughCrawler()

cat_to_tag_table = dict()

for cat_list_index in range(3):
    for item in cat_to_tag_table_list[cat_list_index]:
        item = item[~pd.isna(item)]
        if cat_list_index == 0:
            category = '음식점'
        elif cat_list_index == 1:
            category = '카페'
        elif cat_list_index == 2:
            category = '술집'
        else:
            raise KeyError
        temp_tags = np.append(item[1:], category)
        cat_to_tag_table[item[0]] = temp_tags

for file in db_list_files:
    dhc.load(os.path.join(db_list_path, file))
    for db in dhc.get_db_list():
        temp_category = db.get_value('place_category')
        try:
            temp_kind = cat_to_tag_table[temp_category]
            db.update_pair('place_kind', temp_kind[:-2])
            db.update_pair('place_cluster_b', temp_kind[-2])
            db.update_pair('place_category', temp_kind[-1])
            db.kind_filled = True
            db.cluster_filled = True
        except KeyError:
            name = db.get_value('place_name')
            print(f'category {temp_category} is unavailable on table, {name}')
    dhc.save(f'f_{file}')
