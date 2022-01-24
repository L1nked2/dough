"""
Mock-up for cluster classifier.

Input : directory like
photos
  |_ dfa235-df34
    |_ a0.jpg
    |_ f0.jpg
    |_ i0.jpg
  |_ bgir34-123a
     |_ ...

Output :
dictionary of
  place_uuid → assigned_cluster
|_ pickle로 dump해서 반환
"""

import pickle
import os

PHOTO_DIR_PATH = "./temp_img"

uuid_to_cluster = dict()

for place_uuid in os.listdir(PHOTO_DIR_PATH):
  uuid_to_cluster[place_uuid] = -10

with open("sample_cluster_result.pkl", 'wb') as f:
  pickle.dump(uuid_to_cluster, f)
