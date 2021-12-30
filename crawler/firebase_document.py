"""
Module firebase_doucment
  a module for initiating & converting a document that will be uploaded to 
  Firebase's DB's collection

Classes
  Document
  |_ Public Methods
      Document, convert_with

Functions
  - 
"""


class Document:
    def __init__(self):
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