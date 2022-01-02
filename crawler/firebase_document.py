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
import uuid

class PlaceDocument:
  def __init__(self, place_data_dict : dict):
    self._name = place_data_dict['place_name']
    self._uuid = str(place_data_dict['place_uuid'])
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
    
    assert len(place_data_dict['parent_station_list']) == 1, "at crawling, each place dict actually have only one parent station"
    self._parent_station = place_data_dict['parent_station_list'][0]

    self._last_timestamp = place_data_dict['place_last_timestamp']

    self.has_converted = False

  def get_uuid(self) -> str:
    return self._uuid

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
    place_data_dict['parent_station_list'] = [self._parent_station] # list, because after uploaded to DB, parent can be more than one.
    place_data_dict['place_last_timestamp'] = self._last_timestamp
    return place_data_dict

  def has_photo_folder(self, photo_dir_path="./temp_img") -> bool:
    uuids = os.listdir(photo_dir_path)    
    return str(self._uuid) in uuids

  def convert_with(self, 
    category_to_tag_dir="./cat_to_tag_table",
    photo_dir="./temp_img",
    classifier_path=None):

    self._fill_in_category(category_to_tag_dir)
    self._fill_in_photo_lists(photo_dir)
    self._fill_in_cluster_a(classifier_path)
    self.has_converted = True


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
      temp_kind = cat_to_tag_table[temp_category].tolist()
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
  _food' = _food (OLD : subset of _food, determined by /food ... cancelled due to time constraints of labeler)
  _inside' = _inside (OLD : subset of _inside, determined by /inside ... cancelled due to time constraints of labeler)
  _provided' = _provided
  _main = one from _inside, determined by /thumbnail_inside ; zero~three from _food, determined by /thumbnail_food
  """
  def _fill_in_photo_lists(self, photo_dir_path):
    # e.g. "./temp_img/505e7ffc-dd02-5ade-bc1d-4704a86e2385/"    
    place_dir_path = os.path.join(photo_dir_path, str(self._uuid))

    # paths to photo directoires
    main_food_dir, main_inside_dir = os.path.join(place_dir_path, "thumbnail_food"), os.path.join(place_dir_path, "thumbnail_inside")

    # main_food_entries: e.g. ["f0.jpg", "f24.jpg", "a6.jpg"]
    main_food_entries, main_inside_entries = os.listdir(main_food_dir), os.listdir(main_inside_dir)

    # "f24.jpg" --> "f", 24
    def extract_kind_index(entry : str) -> tuple[str, int]:
      first_char = entry[0] # "f"
      assert first_char in ["a", "f", "i"]
      number = entry[1:].split(".")[0] # "24"
      assert number.isnumeric()
      return first_char, int(number) 

    main_food_infos = [extract_kind_index(entry) for entry in main_food_entries]
    main_inside_infos = [extract_kind_index(entry) for entry in main_inside_entries]
   
    assert 0<=len(main_food_infos)<=3
    assert len(main_inside_infos)==1

    # [("i", 4), ("a", 4), ("f", 4), ("f", 27)]
    main_infos = main_inside_infos + sorted(main_food_infos) 

    def select_photo_link(kind : str, index : int) -> int:
      if kind == "f":
        return self._food_photo_list[index]
      elif kind == "a":
        return self._provided_photo_list[index]
      elif kind == "i":
        return self._inside_photo_list[index]
      else:
        assert False, "kind must be one of f, a, i"

    self._main_photo_list = [select_photo_link(info[0], info[1]) for info in main_infos]
  
  
  # (3) fill in cluster_a with `classifier_path`
  def _fill_in_cluster_a(self, classfier_path: str):
    self._cluster_a = -2
    # classifier side not implemented yet
    #raise NotImplementedError


class StationDocument:
  def __init__(self, raw_station_data_dict : dict):
    NAVER_LINK_PREFIX = "https://pcmap.place.naver.com/restaurant/"
    self._naver_link =  NAVER_LINK_PREFIX + raw_station_data_dict['id']
    self._uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, self._naver_link))
    self._name = raw_station_data_dict['name']
    self._coor_x = raw_station_data_dict['x']
    self._coor_y = raw_station_data_dict['y']
    self._views = 0 
    self._place_list = list()

  def get_uuid(self) -> str:
    return self._uuid

  def into_dict(self) -> dict:
    station_data_dict = dict()
    station_data_dict['station_naver_link'] = self._naver_link
    station_data_dict['station_uuid'] = self._uuid
    station_data_dict['station_name'] = self._name 
    station_data_dict['station_coor_x'] = self._coor_x
    station_data_dict['station_coor_y'] = self._coor_y 
    station_data_dict['station_views'] = self._views
    station_data_dict['place_list'] = self._place_list
    return station_data_dict