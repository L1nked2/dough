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

from functools import total_ordering
from typing import Tuple
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

    # photo_list : list[Tuple[str, str]] ... list of (naver_link, local_path),
    # e.g. [('https://ldb-phinf.pstatic.net/20180705_282/1530759989688zRQlF_JPEG/4nh2bHk85UfvJqrIbWv22dA5.jpg', './temp_img/8cba5d13-d5d3-5b78-9fd1-f865ac3e8e61/menu/0.jpg'), ...]
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

    # need to use this to upload CDN link to DB
    def drop_naver_link (photo_list : list[Tuple[str, str]]) -> list[str]:
      return [cdn_link for (naver_link, cdn_link) in photo_list]
    
    place_data_dict['place_food_photo_list'] = drop_naver_link(self._food_photo_list)
    place_data_dict['place_inside_photo_list'] = drop_naver_link(self._inside_photo_list)
    place_data_dict['place_menu_photo_list'] = drop_naver_link(self._menu_photo_list)
    place_data_dict['place_main_photo_list'] = drop_naver_link(self._main_photo_list)
    place_data_dict['place_provided_photo_list'] = drop_naver_link(self._provided_photo_list)

    place_data_dict['place_road_address'] = self._road_address
    place_data_dict['place_legacy_address'] = self._legacy_address
    place_data_dict['place_menu_info'] = self._menu_info
    place_data_dict['place_naver_link'] = self._naver_link
    place_data_dict['place_telephone'] = self._telephone
    place_data_dict['parent_station_list'] = [self._parent_station] # list, because after uploaded to DB, parent can be more than one.
    place_data_dict['place_last_timestamp'] = self._last_timestamp
    return place_data_dict

  def has_photo_folder(self, place_uuids_in_photo_dir: list[str]) -> bool:
    return str(self._uuid) in place_uuids_in_photo_dir

  def convert_with(self, category_to_tag_dir):
    self._fill_in_category(category_to_tag_dir)
    self._fill_in_main_photo_list()
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

     
  # (2) fill in *_photo_lists
  """
  main(=thumbnail) photos will be determined later. For now, just fill in
    (1) provided photos 0~3
    (2) if no 4 provided photos, inside 0 & food3
  """ 
  def _fill_in_main_photo_list(self):
    if len(self._provided_photo_list) >= 4 :
      self._main_photo_list = self._provided_photo_list[0:4]
    else:
      self._main_photo_list = self._inside_photo_list[0:1] + self._food_photo_list[0:3]


class StationDocument:
  def __init__(self, raw_station_data_dict : dict):
    NAVER_LINK_PREFIX = "https://pcmap.place.naver.com/restaurant/"
    self._naver_link =  NAVER_LINK_PREFIX + raw_station_data_dict['id']
    self._uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, self._naver_link))
    self._name = StationDocument._parse_name(raw_station_data_dict['name'])
    self._coor_x = raw_station_data_dict['x']
    self._coor_y = raw_station_data_dict['y']
    self._views = 0 
    self._place_list = list()

  # '강남역 2호선' -> '강남역'
  def _parse_name(raw_name : str) -> str:
    tokens = raw_name.split() 
    assert len(tokens) == 2 , "name of station info must be in forms of 00역 0호선"
    return tokens[0]

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