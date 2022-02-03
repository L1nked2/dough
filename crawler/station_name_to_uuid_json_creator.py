from firebase_db import DB_and_CDN
import firebase_admin
import json

class StationDBReader(DB_and_CDN):
  def get_station_name_to_uuid_dict(self):
    station_name_to_uuid = dict()

    station_docs = self._db_station_collection.stream()
    for station_doc in station_docs: 
      station_dict = station_doc.to_dict()
      name, uuid = station_dict['station_name'], station_dict['station_uuid']
      station_name_to_uuid[name] = uuid

    return station_name_to_uuid

  
if __name__ == "__main__":
  reader = StationDBReader()
  station_name_to_uuid = reader.get_station_name_to_uuid_dict()
  print(station_name_to_uuid)
  with open("station_name_to_uuid.json", "w") as json_file:
    json.dump(station_name_to_uuid, json_file, ensure_ascii=False)