import sys

terminal_log_filenames = sys.argv[1:]
assert len(terminal_log_filenames) == 4, "args must be `<date>upload_terminal{0, 1, 2, 3}`"

all_stations = []
for terminal_log_filename in terminal_log_filenames:
    logs = open(terminal_log_filename).readlines()
    station_logs = filter(lambda line : "/media/k/DIR_FOR_CRAWLING" in line, logs)
    stations = list(map(lambda station_log  : station_log.rstrip("\n").split("/")[-1], station_logs))

    stations_wo_possibly_incompletely_uploaded_station = stations[:-1]
    all_stations += stations_wo_possibly_incompletely_uploaded_station

print(f"uploaded stations are...\n{all_stations}")



