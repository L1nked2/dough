import sys
import os

crawled_station_categories = os.listdir("/media/k/DIR_FOR_CRAWLING/raw_db")
crawled_stations_with_repetition = [station_category.split("_")[0] for station_category in crawled_station_categories]
crawled_stations = list(set(crawled_stations_with_repetition))
fully_crawled_stations = sorted(list(filter(lambda station : crawled_stations_with_repetition.count(station) == 3, crawled_stations)))

print(f"cralwed stations are...\n{fully_crawled_stations}")


