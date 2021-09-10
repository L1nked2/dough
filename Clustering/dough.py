import numpy as np
import pandas as pd
import os, time
import datetime
import pickle, gzip
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib as mpl
from sklearn import preprocessing as pp
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve, average_precision_score
from sklearn.metrics import roc_curve, auc, roc_auc_score
now = datetime.datetime.now()
color = sns.color_palette()
kmeans_elbow_threshold = 0.90


def preprocessing_csv(file_path):
    new_file_path = 'user_data.csv'
    header_size = 48
    # all : 103
    # non-parametric : 9 ['ID', 's_data', 'f_date', 'region', 'O1', 'O2', 'O3', 'phone_num', 'prize_per']
    # parametric : 94 (2 - 55 - 29 - 8) = 0~1, 2~56, 57~85, 86~93
    non_parameter = ['ID', 's_data', 'f_date', 'region', 'O1', 'O2', 'O3', 'phone_num', 'prize_per']
    columns = 'ID,s_data,f_date,gender,birth,region,O1,' \
              'A01,A02,A03,A04,A05,A06,A07,A08,A09,A10,A11,A12,A13,A14,A15,A16,A17,A18,A19,A20,' \
              'A21,A22,A23,A24,A25,A26,A27,A28,A29,A30,A31,A32,A33,A34,A35,A36,A37,A38,A39,A40,' \
              'A41,A42,A43,A44,A45,A46,A47,A48,A49,A50,A51,A52,A53,A54,A55,O2,' \
              'B01,B02,B03,B04,B05,B06,B07,B08,B09,B10,B11,B12,B13,B14,B15,B16,B17,B18,B19,B20,' \
              'B21,B22,B23,B24,B25,B26,B27,B28,B29,O3,' \
              'C01,C02,C03,C04,C05,C06,C07,C08,' \
              'phone_num,prize_per\n'
    with open(file_path, encoding='UTF8') as f_in, open(new_file_path, 'w') as f_out:
        for i in range(header_size):
            f_in.readline()
        f_out.write(columns)
        for line in f_in.readlines():
            f_out.write(line)
    raw_data = pd.read_csv(new_file_path, encoding='ANSI').drop(columns=non_parameter)
    return raw_data


def preprocessing_data(raw_data, norm=0):
    # delete wrong birth, replace gender(0:1 = female:male)
    # normalize method based on norm (0: -4, 1: mean)
    str_expr = "(birth > 1900) and (birth < " + str(now.year) + ")"
    data = raw_data.query(str_expr).replace('여', 0).replace('남', 1)
    data['birth'] = data['birth'].apply(lambda x: now.year - x + 1)
    data = data.rename(columns={"birth": "age"})
    if norm == 0:  # normalize to -3 ~ 3
        data = data - 4
        age_sc = data['age'].max() - data['age'].min()
        data['age'] = data['age'].apply(lambda x: ((x + 4) / age_sc - 1) * 6)
        data['gender'] = data['gender'].apply(lambda x: (x + 3.5) * 6)
    return data


def pca_calc_variance_ratio(pca, num):
    ipc = pd.DataFrame(pca.explained_variance_ratio_).T
    evr = []
    for i in range(1, num, 1):
        evr.append(ipc.loc[:, 0:i].sum(axis=1).values[0])
    evr = pd.DataFrame(evr).transpose()
    evr.to_csv("variance_ratio.csv", encoding='ANSI')
    return evr


def get_kmeans_cluster_num(raw_data, max_num=25, file_suffix=''):
    kmeans_inertia = pd.DataFrame(data=[], index=range(2, max_num), columns=['inertia'])
    for init_cluster_num in range(2, max_num):
        kmeans_result = KMeans(n_clusters=init_cluster_num, n_init=30)
        kmeans_result.fit(raw_data.to_numpy())
        kmeans_inertia.loc[init_cluster_num] = kmeans_result.inertia_
    file_name = 'kmeans_inertia_' + file_suffix + '.csv'
    cluster_num = 0
    prev_slope = kmeans_inertia['inertia'][3]-kmeans_inertia['inertia'][2]
    for i in range(3, max_num-1):
        cluster_num = i
        if ((kmeans_inertia['inertia'][i+1]-kmeans_inertia['inertia'][i]) / prev_slope) > kmeans_elbow_threshold:
            break
        prev_slope = kmeans_inertia['inertia'][i+1]-kmeans_inertia['inertia'][i]
    if file_suffix != '':
        pd.DataFrame(kmeans_inertia).T.to_csv(file_name, encoding='ANSI')
    return cluster_num
