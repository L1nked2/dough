import numpy as np
import pandas as pd
import os, time
import pickle, gzip
import matplotlib.pyplot as plt
import matplotlib as mpl
import doughmat as dhm
from sklearn import preprocessing as pp
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve, average_precision_score
from sklearn.metrics import roc_curve, auc, roc_auc_score
from sklearn.cluster import KMeans


def read_csv(path):
    file_a = os.path.sep.join(['centroids', 'centroids_a.csv'])  # File name
    pass

def get_distance():
    pass