# How to execute main.py

(1) install python version 3.9.0
  : preferred to use `pyenv` for python & python package version controls.
  
  (1-1) before activating pyenv in our server machine
 	: `vi ~/.bashrc` and change the `eval pyenv init...` part accordingly.
           Then, `source ~/.bashrc` 

(2) install pip modules in `depedency.txt`


(3) configure variables in `main.py` and execute
  (3-1) configuring directory paths in our server machine
        : execute `sudo mount /dev/sdb /media/k` first.

(4) depending on your purpose,
	`python main.py --execution_kind {crawl, upload, update_station, update_cluster}`
	(4-1) we'll run `upload` with 4 terminals, for parallel uploads.
        In order to do so, open 4 terminals and run, for each terminal,
        `python main.py --execution_kind upload --upload_num <terminal_num>`
        where terminal_num is in {0,1,2,3} and unique for each terminal.

(5) after uploading, run `python get_uploaded_stations.py 220211upload_terminal0.txt 220211upload_terminal1.txt 220211upload_terminal2.txt 220211upload_terminal3.txt` to get uploaded stations and update `ALREADY_UPLOADED_STATIONS` in `main.py`
