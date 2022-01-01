"""
Module firebase_doucment
  a module for initiating & converting a document that will be uploaded to 
  Firebase's DB's collection

Classes
  PlaceDocument
  |_ Public Methods
      PlaceDocument, has_photo_folder, convert_with, into_dict
  
  StationDocument
  |_ Public Methods
      StationDocument, into_dict
Functions
  - 
"""

import numpy as np
from numpy.lib.function_base import place 
import pandas as pd
import os

class PlaceDocument:
  def __init__(self, place_data_dict : dict):
    self._name = place_data_dict['place_name']
    self._uuid = place_data_dict['place_uuid']
    self._category = place_data_dict['place_category']
    self._cluster_a = place_data_dict['place_cluster_a']
    self._cluster_b = place_data_dict['place_cluster_b']
    self._coor_x = place_data_dict['place_coor_x']
    self._coor_y = place_data_dict['place_coor_y']
    self._kind = place_data_dict['place_kind']
    self._operating_time = place_data_dict['place_operating_time']
    self._views = place_data_dict['place_views']
    self._likes = place_data_dict['place_likes']
    self._recent_views = place_data_dict['place_recent_views']

    self._main_photo_list = place_data_dict['place_main_photo_list']
    self._provided_photo_list = place_data_dict['place_provided_photo_list']
    self._food_photo_list = place_data_dict['place_food_photo_list']
    self._inside_photo_list = place_data_dict['place_inside_photo_list']
    self._menu_photo_list = place_data_dict['place_menu_photo_list']

    self._road_address = place_data_dict['place_road_address']
    self._legacy_address = place_data_dict['place_legacy_address']
    self._menu_info = place_data_dict['place_menu_info']
    self._naver_link = place_data_dict['place_naver_link']
    self._telephone = place_data_dict['place_telephone']
    self._parent_station_list = place_data_dict['parent_station_list']
    self._last_timestamp = place_data_dict['place_last_timestamp']

    self.has_converted = False

  def into_dict(self) -> dict :
    place_data_dict = dict()
    place_data_dict['place_name'] = self._name 
    place_data_dict['place_uuid'] = self._uuid 
    place_data_dict['place_category'] = self._category
    place_data_dict['place_cluster_a'] = self._cluster_a
    place_data_dict['place_cluster_b'] = self._cluster_b 
    place_data_dict['place_coor_x'] = self._coor_x
    place_data_dict['place_coor_y'] = self._coor_y
    place_data_dict['place_kind'] = self._kind
    place_data_dict['place_operating_time'] = self._operating_time
    place_data_dict['place_views'] = self._views
    place_data_dict['place_likes'] = self._likes
    place_data_dict['place_recent_views'] = self._recent_views

    place_data_dict['place_food_photo_list'] = self._food_photo_list
    place_data_dict['place_inside_photo_list'] = self._inside_photo_list
    place_data_dict['place_menu_photo_list'] = self._menu_photo_list
    place_data_dict['place_main_photo_list'] = self._main_photo_list 
    place_data_dict['place_provided_photo_list'] = self._provided_photo_list

    place_data_dict['place_road_address'] = self._road_address
    place_data_dict['place_legacy_address'] = self._legacy_address
    place_data_dict['place_menu_info'] = self._menu_info
    place_data_dict['place_naver_link'] = self._naver_link
    place_data_dict['place_telephone'] = self._telephone
    place_data_dict['parent_station_list'] = self._parent_station_list
    place_data_dict['place_last_timestamp'] = self._last_timestamp
    return place_data_dict

  def has_photo_folder(self, category_to_tag_dir="./temp_img"):
    raise NotImplementedError

  def convert_with(self, 
    category_to_tag_dir="./cat_to_tag_table",
    photo_dir="./temp_img",
    classifier_path=None):

    self._fill_in_category(category_to_tag_dir)
    self._fill_in_photo_lists(photo_dir)
    self._fill_in_cluster_a(classifier_path)

  # (1) fill in category with files in `category_to_tag`
  # CODE COPY-PASTED FROM 이어진's
  def _fill_in_category(self, cat_to_tag_table_path):
    cat_to_tag_table_list = list()
    cat_to_tag_table_list.append(
        pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_res.csv', 
        encoding='cp949').to_numpy())
    cat_to_tag_table_list.append(
        pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_cafe.csv', 
        encoding='cp949').to_numpy())
    cat_to_tag_table_list.append(
        pd.read_csv(f'{cat_to_tag_table_path}/category_to_tag_table_drink.csv', 
        encoding='cp949').to_numpy())

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
        temp_tags = np.append(item[1:], category)
        cat_to_tag_table[item[0]] = temp_tags

    temp_category = self._category
    if temp_category in cat_to_tag_table.keys():
      temp_kind = cat_to_tag_table[temp_category]
      self._kind = temp_kind[:-2]
      self._cluster_b = temp_kind[-2]
      self._category = temp_kind[-1]
    else: 
      print(f' category of {self._name} is weird. Its category is {temp_category}')

     
  # (2) fill in *_photo_lists with `photo_dir_path`

  """
  <old>
  _food : full
  _inside : full
  _provided : full
  _main : empty

  <auxiliary>
  /food
  /inside
  (/menu ... will not be used here)
  /thumbnail_food
  /thumbnail_inside

  <new_expected>
  _food' = subset of _food, determined by /food
  _inside' = subset of _inside, determined by /inside
  _provided' = _provided
  _main = one from _inside, determined by /thumbnail_inside ; zero~three from _food, determined by /thumbnail_food
  """
  def _fill_in_photo_lists(self, photo_dir_path):

    place_dir_path = os.path.join(photo_dir_path, )
    food_dir = os.path.join(photo_dir_path, "/food")
    inside_dir = os.path.join(photo_dir_path, "/inside")
    main_food_dir = os.path.join(photo_dir_path, "/thumbnail_food")
    main_inside_dir = os.path.join(photo_dir_path, "/thumbnail_inside")

    # food_entries: e.g. ["f0.jpg", "f1.jpg", ...]
    food_entries, inside_entries = os.listdir(food_dir), os.listdir(inside_dir)
    main_food_entries, main_food_entries = os.listdir(main_food_dir), os.listdir(main_inside_dir)

    print(food_entries)
    #food_indexe


    raise NotImplementedError
  
  
  # (3) fill in cluster_a with `classifier_path`
  def _fill_in_cluster_a(self):
    pass # classifier side not implemented yet
    #raise NotImplementedError


class StationDocument:
  def __init__(self, raw_station_data_dict : dict):
    self._name = raw_station_data_dict['name']
    self._coor_x = raw_station_data_dict['x']
    self._coor_y = raw_station_data_dict['y']
    self._views = 0 
    self._place_list = list()

  def into_dict(self) -> dict:
    station_data_dict = dict()
    station_data_dict['station_name'] = self._name 
    station_data_dict['station_coor_x'] = self._coor_x
    station_data_dict['station_coor_y'] = self._coor_y 
    station_data_dict['station_views'] = self._views
    station_data_dict['place_list'] = self._place_list
    return station_data_dict