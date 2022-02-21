import sys
import os
  
raw_db_path = sys.argv[1]
assert len(sys.argv) == 2, "args must be `path/to/raw_db`, e.g. /media/k/DIR_FOR_CRAWLING/raw_db"

crawled_station_categories = os.listdir(raw_db_path)
crawled_stations_with_repetition = [station_category.split("_")[0] for station_category in crawled_station_categories]
crawled_stations = list(set(crawled_stations_with_repetition))
fully_crawled_stations = sorted(list(filter(lambda station : crawled_stations_with_repetition.count(station) == 3, crawled_stations)))

print(f"cralwed stations are...\n{fully_crawled_stations}")


