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
