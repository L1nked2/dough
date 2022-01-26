import csv 
import os
from typing import Iterable 

def csv_to_list(csv_path, encoding='utf-8'):
  lst = list()
  with open(csv_path,'r', encoding=encoding) as f:
    reader = csv.reader(f)
    for row in reader:
        lst.append(row[0])
  return lst

def iterable_to_csv(iterable: Iterable, csv_path):
  with open(csv_path, 'w') as f:
    writer = csv.writer(f)
    for item in iterable:
      writer.writerow([item])

def create_dirs_if_not_exist(dirs : list[str]):
  for dir in dirs: 
    if not os.path.isdir(dir):
      os.mkdir(dir)