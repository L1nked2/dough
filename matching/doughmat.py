import numpy as np
import pandas as pd
import os, time
score_mean = 4
len_a = 23
len_b = 15
len_c = 7
dim_a = 3
dim_b = 4
dim_c = 2

def preprocessing_csv(file_path):
    # get csv from file_path(=String) and return raw_data(=pd.DataFrame)
    # preprocess given csv file to readable csv
    new_file_path = 'user_data\\user_data.csv'
    header_size = 30
    # all : 51
    # non-parametric : 5
    # parametric : 46
    non_parameter = ['s_data', 'f_date', 'gender', 'birth', 'phone_num']
    columns = 'ID,s_data,f_date,gender,birth,' \
              'A02,A05,A06,A14,A15,A16,A19,A23,A24,A25,A26,A29,A30,A33,A35,A36,A38,A39,A41,A42,A44,A45,A51,' \
              'B02,B04,B05,B07,B10,B11,B13,B14,B16,B18,B19,B24,B25,B26,B29,' \
              'C01,C03,C04,C05,C06,C07,C08,' \
              'phone_num\n'
    with open(file_path, encoding='utf-8') as f_in, open(new_file_path, 'w') as f_out:
        for i in range(header_size):
            f_in.readline()
        f_out.write(columns)
        for line in f_in.readlines():
            f_out.write(line)
    raw_data = pd.read_csv(new_file_path, encoding='ANSI').drop(columns=non_parameter)
    return raw_data


def preprocessing_data(raw_data, norm=False):
    # get raw_data(=pd.DataFrame) and return normalized data(=pd.DataFrame)
    # normalize method based on norm (0: -4, 1: mean)
    data = raw_data - score_mean
    data['ID'] = data['ID'] + score_mean
    if norm:  # normalize to 0 mean
        mean_series = data.iloc[:, 1:].mean(axis=1)
        for i in range(data.shape[0]):
            data.iloc[i, 1:] = data.iloc[i, 1:] - mean_series.iloc[i]
    return data


def read_csv(filetype='', file_suffix=''):
    file = os.path.sep.join([filetype, filetype])  # File name
    if file_suffix != '':
        file = file + '_' + file_suffix + '.csv'
        data = pd.read_csv(file, encoding='ANSI')
        data = data.iloc[:, 1:]
    else:
        file = file + file_suffix + '.csv'
        data = pd.read_csv(file, encoding='ANSI')
        data = data.iloc[:, 1:]
    return data


def slice_part(origin_data, part=''):
    # get origin_data(=npArray) and return sliced_data(=npArray)
    # slice given data based on part
    # parametric : 45
    # a: 23, b: 15, c: 7
    # 'A02,A05,A06,A14,A15,A16,A19,A23,A24,A25,A26,A29,A30,A33,A35,A36,A38,A39,A41,A42,A44,A45,A51,'
    # 'B02,B04,B05,B07,B10,B11,B13,B14,B16,B18,B19,B24,B25,B26,B29,'
    # 'C01,C03,C04,C05,C06,C07,C08,'
    if part == 'a':
        sliced_data = origin_data[0:len_a]
    elif part == 'b':
        sliced_data = origin_data[len_a:len_a+len_b]
    elif part == 'c':
        sliced_data = origin_data[len_a+len_b:]
    else:
        sliced_data = None
    return sliced_data


def get_position(pca_inv, coef, user_parameter_sparse, part=''):
    user_parameter_full = np.matmul(coef, user_parameter_sparse)
    user_pos = np.matmul(pca_inv, user_parameter_full).T
    if part == 'a':
        user_pos = user_pos[:, 0:dim_a]
    elif part == 'b':
        user_pos = user_pos[:, 0:dim_b]
    elif part == 'c':
        user_pos = user_pos[:, 0:dim_c]
    else:
        user_pos = None
    return user_pos


def get_distance(vec_a, vec_b):
    if len(vec_a) != len(vec_b):
        return -1
    sum = 0
    length = len(vec_a)
    for i in range(length):
        
    return


def calc_session(pos_a, pos_b, pos_c):
    cluster_num = [-1, -1, -1]
    if len(pos_a) != len(pos_b) and len(pos_b) != len(pos_c):
        return cluster_num
    for vec in pos_a:

    return cluster_num
