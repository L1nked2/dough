"""
Module firebase_doucment
  a module for initiating & converting a document that will be uploaded to 
  Firebase's DB's collection

Classes
  PlaceDocument
  |_ Public Methods
      Document, convert_with
  
  StationDocument
  |_ Public Methods

Functions
  - 
"""



### TODO

### 내가 고려해야 할 collection은 place_db와 station_db 뿐
  # (양식은 Notion 참고)

###


class PlaceDocument:
  def __init__(self, place_data_dict : dict):
    raise NotImplementedError
    # will contain which collection itself belongs to

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
  def __init__(self, station_data_dict : dict):
    raise NotImplementedError