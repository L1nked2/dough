import csv 
import os 

def csv_to_list(csv_path):
  lst = list()
  with open(csv_path,'r') as f:
      reader = csv.reader(f)
      for row in reader:
          lst.append(row[0])
  print(lst)
  return lst

def create_dirs_if_not_exist(dirs : list[str]):
  for dir in dirs: 
    if not os.path.isdir(dir):
      os.mkdir(dir)