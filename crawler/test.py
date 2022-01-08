from dough_crawler import *
from firestore_lib import *
import numpy as np
import pandas as pd

db_list_path = './raw_db'
db_list_files = list(file for file in os.listdir(db_list_path)
                     if os.path.isfile(os.path.join(db_list_path, file)))
dhc = DoughCrawler()
place_uuid_list = list()
cluster_a_list = list()
place_info = dict()
for file in db_list_files:
    dhc.load(os.path.join(db_list_path, file))
    for db in dhc.get_db_list():
        place_info[db.get_value('place_uuid')] = db.get_value('place_name')
        #place_uuid_list.append(db.get_value('place_uuid'))
        #cluster_a_list.append("")


with open('./tmp/cluster_result.csv', 'w+') as f:
    for key in place_info.keys():
        f.write(f'{key},{place_info[key]},-1\n')


