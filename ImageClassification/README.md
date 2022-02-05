# How to execute

(0) `ln -s /media/k/DIR_FOR_CRAWLING/temp_img ./data`
(1) `vi ~/.bashrc` and comment/uncomment appropriate `pyenv init ...` commands,
     depending on whether you are locally connected or on remote.
(2) `source ~/.bashrc`
(3) `pyenv activate dough-crawler-env`
(4) `python -V` to check current version is <b>3.9.0</b>
(5) `python run.py -g 0`
