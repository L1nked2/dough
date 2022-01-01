"""
Module firebase_doucment
  a module for initiating & converting a document that will be uploaded to 
  Firebase's DB's collection

Classes
  PlaceDocument
  |_ Public Methods
      PlaceDocument, convert_with, into_dict
  
  StationDocument
  |_ Public Methods
      StationDocument, into_dict
Functions
  - 
"""

class PlaceDocument:
  def __init__(self, place_data_dict : dict):
    self.__name = place_data_dict['place_name']
    self.__uuid = place_data_dict['place_uuid']
    self.__category = place_data_dict['place_category']
    self.__cluster_a = place_data_dict['place_cluster_a']
    self.__cluster_b = place_data_dict['place_cluster_b']
    self.__photo_main_list = place_data_dict['place_photo_main_list']
    self.__coor_x = place_data_dict['place_coor_x']
    self.__coor_y = place_data_dict['place_coor_y']
    self.__kind = place_data_dict['place_kind']
    self.__operating_time = place_data_dict['place_operating_time']
    self.__views = place_data_dict['place_views']
    self.__likes = place_data_dict['place_likes']
    self.__recent_views = place_data_dict['place_recent_views']
    self.__photo_list = place_data_dict['place_photo_list']
    self.__road_address = place_data_dict['place_road_address']
    self.__legacy_address = place_data_dict['place_legacy_address']
    self.__menu_info = place_data_dict['place_menu_info']
    self.__naver_link = place_data_dict['place_naver_link']
    self.__menu_photo_list = place_data_dict['place_menu_photo_list']
    self.__telephone = place_data_dict['place_telephone']
    self.__parent_station_list = place_data_dict['parent_station_list']
    self.__last_timestamp = place_data_dict['place_last_timestamp']

    self.has_converted = False

  def into_dict(self) -> dict :
    place_data_dict = dict()
    place_data_dict['place_name'] = self.__name 
    place_data_dict['place_uuid'] = self.__uuid 
    place_data_dict['place_category'] = self.__category
    place_data_dict['place_cluster_a'] = self.__cluster_a
    place_data_dict['place_cluster_b'] = self.__cluster_b 
    place_data_dict['place_photo_main_list'] = self.__photo_main_list
    place_data_dict['place_coor_x'] = self.__coor_x
    place_data_dict['place_coor_y'] = self.__coor_y
    place_data_dict['place_kind'] = self.__kind
    place_data_dict['place_operating_time'] = self.__operating_time
    place_data_dict['place_views'] = self.__views
    place_data_dict['place_likes'] = self.__likes
    place_data_dict['place_recent_views'] = self.__recent_views
    place_data_dict['place_photo_list'] = self.__photo_list
    place_data_dict['place_road_address'] = self.__road_address
    place_data_dict['place_legacy_address'] = self.__legacy_address
    place_data_dict['place_menu_info'] = self.__menu_info
    place_data_dict['place_naver_link'] = self.__naver_link
    place_data_dict['place_menu_photo_list'] = self.__menu_photo_list
    place_data_dict['place_telephone'] = self.__telephone
    place_data_dict['parent_station_list'] = self.__parent_station_list
    place_data_dict['place_last_timestamp'] = self.__last_timestamp
    return place_data_dict

  def convert_with(self, 
    category_to_tag_dir="cat_to_tag_table",
    photo_dir="temp_img",
    classifier_path=None):

    # (1) fill in category with files in `category_to_tag`

        # refer to db_convertor.py

    # (2) fill in photo_provided_{food,inside,...} with `photo_dir`

    # (3) fill in main_list (i.e. thumbnail photos) with `photo_dir`

    # (4) fill in cluster_a with `classifier_path`
    
    raise NotImplementedError



class StationDocument:
  def __init__(self, raw_station_data_dict : dict):
    self.__name = raw_station_data_dict['name']
    self.__coor_x = raw_station_data_dict['x']
    self.__coor_y = raw_station_data_dict['y']
    self.__views = 0 
    self.__place_list = list()

  def into_dict(self) -> dict:
    station_data_dict = dict()
    station_data_dict['station_name'] = self.__name 
    station_data_dict['station_coor_x'] = self.__coor_x
    station_data_dict['station_coor_y'] = self.__coor_y 
    station_data_dict['station_views'] = self.__views
    station_data_dict['place_list'] = self.__place_list
    return station_data_dict