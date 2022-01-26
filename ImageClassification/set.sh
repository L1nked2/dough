#!/bin/bash

V0=$(apt list | grep python3 | wc -l)
if [ ${V0} -eq 0 ] ; then
  sudo apt install python3
fi

V1=$(pip list | grep torch | wc -l)
if [ ${V1} -eq 0 ] ; then
  pip3 install torch==1.10.1+cpu torchvision==0.11.2+cpu torchaudio==0.10.1+cpu -f https://download.pytorch.org/whl/cpu/torch_stable.html
fi

V2=$(pip list | grep matplotlib | wc -l)
if [ ${V2} -eq 0 ] ; then
  pip3 install matplotlib
fi

V3=$(pip list | grep pandas | wc -l)
if [ ${V3} -eq 0 ] ; then
  pip3 install pandas
fi

V4=$(pip list | grep tqdm | wc -l)
if [ ${V4} -eq 0 ] ; then
  pip3 install tqdm
fi

V5=$(pip list | grep glob | wc -l)
if [ ${V5} -eq 0 ] ; then
  pip3 install glob
fi