import numpy as np
import pandas as pd
import os
import time
import datetime
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib as mpl
from sklearn import preprocessing as pp
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
now = datetime.datetime.now()
color = sns.color_palette()
kmeans_elbow_threshold = 0.80


def preprocessing_csv(file_path):
    # get csv from file_path(=String) and return raw_data(=pd.DataFrame)
    # preprocess given csv file to readable csv
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


def preprocessing_data(raw_data, norm=False):
    # get raw_data(=pd.DataFrame) and return normalized data(=pd.DataFrame)
    # delete wrong birth, replace gender(0:1 = female:male)
    # normalize method based on norm (0: -4, 1: mean)
    str_expr = "(birth > 1900) and (birth < " + str(now.year) + ")"
    data = raw_data.query(str_expr).replace('여', 0).replace('남', 1)
    data['birth'] = data['birth'].apply(lambda x: now.year - x + 1)
    data = data.rename(columns={"birth": "age"})
    age_min = data['age'].min()
    age_sc = data['age'].max() - data['age'].min()
    data['age'] = data['age'].apply(lambda x: ((x - age_min) / age_sc) * 6 + 1)
    data['gender'] = data['gender'].apply(lambda x: x * 6 + 1)
    data = data - 4
    if norm:  # normalize to 0 mean
        mean_series = data.iloc[:, 2:].mean(axis=1)
        for i in range(data.shape[0]):
            data.iloc[i, 2:] = data.iloc[i, 2:] - mean_series.iloc[i]
    return data


def slice_data(raw_data, part=''):
    # get raw_data(=pd.DataFrame) and return raw_data_s(=pd.DataFrame)
    # slice given data based on part
    # all : 103
    # non-parametric : 9 ['ID', 's_data', 'f_date', 'region', 'O1', 'O2', 'O3', 'phone_num', 'prize_per']
    # parametric : 94 (2 - 55 - 29 - 8) = 0~1, 2~56, 57~85, 86~93
    if part == 'a':
        raw_data_s = raw_data.drop(raw_data.columns[0:2], axis=1)
        raw_data_s = raw_data_s.drop(raw_data.columns[57:94], axis=1)
    elif part == 'b':
        raw_data_s = raw_data.drop(raw_data.columns[0:57], axis=1)
        raw_data_s = raw_data_s.drop(raw_data.columns[86:94], axis=1)
    elif part == 'c':
        raw_data_s = raw_data.drop(raw_data.columns[0:86], axis=1)
    else:
        raw_data_s = None
    return raw_data_s


def pca_calc_variance_ratio(raw_data, num, file_suffix=''):
    pca = PCA()
    sol = pca.fit(raw_data.to_numpy())
    ipc = pd.DataFrame(sol.explained_variance_ratio_).T
    evr = []
    for i in range(1, num, 1):
        evr.append(ipc.loc[:, 0:i].sum(axis=1).values[0])
    evr = pd.DataFrame(evr).transpose()
    if file_suffix != '':
        file_path = "pca_variance_ratio_" + file_suffix + ".csv"
        evr.to_csv(file_path, encoding='ANSI')
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


def get_pca_vec(raw_data, vec_num=3, file_suffix=''):
    pca = PCA()
    train_pca = pca.fit(raw_data.to_numpy())
    sol_pca = pd.DataFrame(train_pca.components_)
    if file_suffix != '':
        file_path = 'pca_' + file_suffix + '.csv'
        sol_pca.to_csv(file_path, encoding='ANSI')
    sol_pca.drop(sol_pca.index[4:], inplace=True, axis=0)
    sol_pca_sign = sol_pca.apply(lambda x: x / abs(x)).T
    sol_pca_sign = sol_pca_sign.add_prefix('s')
    sol_pca_abs = abs(sol_pca).T.add_prefix('a')
    sol_pca_cb = pd.concat([sol_pca_abs, sol_pca_sign], axis=1)
    re_cb = []
    for i in range(vec_num):
        a_str = 'a' + str(i)
        s_str = 's' + str(i)
        re_cb.append(sol_pca_cb[[a_str, s_str]].sort_values(by=sol_pca_cb.columns[i], ascending=False))
    result = pd.concat([pd.DataFrame(re_cb[0].index) + 1, pd.DataFrame(re_cb[0]['s0'].to_numpy())], axis=1)
    for i in range(1, vec_num):
        s_str = 's' + str(i)
        result = pd.concat([result, pd.DataFrame(re_cb[i].index) + 1, pd.DataFrame(re_cb[i][s_str].to_numpy())], axis=1)
    if file_suffix != '':
        file_path = 'pca_' + file_suffix + '_result.csv'
        result.to_csv(file_path, encoding='ANSI')
    return result
