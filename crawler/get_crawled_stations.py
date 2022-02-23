import sys
import os
  
assert len(sys.argv) == 3, "python get_cralwed_stations_py <first_disk> <second_disk> e.g. /media/k /media/k2"

fully_crawled_stations = []
for disk_path in sys.argv[1:]:
    raw_db_path = os.path.join(disk_path, "DIR_FOR_CRAWLING/raw_db")
    crawled_station_categories = os.listdir(raw_db_path)
    crawled_stations_with_repetition = [station_category.split("_")[0] for station_category in crawled_station_categories]
    crawled_stations = list(set(crawled_stations_with_repetition))
    fully_crawled_stations += sorted(list(filter(lambda station : crawled_stations_with_repetition.count(station) == 3, crawled_stations)))

print(f"cralwed stations are...\n{fully_crawled_stations}")


