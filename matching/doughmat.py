import numpy as np
import pandas as pd
import os
import math as math
score_mean = 4
parameter_len_a = 23
parameter_len_b = 15
parameter_len_c = 7
cluster_max_num = [8, 5, 4]
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
        mean_series_a = data.iloc[:, 1:parameter_len_a + 1].mean(axis=1)
        mean_series_b = data.iloc[:, parameter_len_a + 1:parameter_len_a + parameter_len_b + 1].mean(axis=1)
        mean_series_c = data.iloc[:, -parameter_len_c:].mean(axis=1)
        for i in range(data.shape[0]):
            data.iloc[i, 1:parameter_len_a + 1] -= mean_series_a.iloc[i]
            data.iloc[i, parameter_len_a + 1:parameter_len_a + parameter_len_b + 1] -= mean_series_b.iloc[i]
            data.iloc[i, -parameter_len_c:] -= mean_series_c.iloc[i]
    return data


def read_csv(filetype='', file_suffix=''):
    file = os.path.sep.join([filetype, filetype])  # File name
    if file_suffix != '':
        file = f'{file}_{file_suffix}.csv'
        data = pd.read_csv(file, encoding='ANSI')
        data = data.iloc[:, 1:]
    else:
        file = f'{file}_{file_suffix}.csv'
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
        sliced_data = origin_data[0:parameter_len_a]
    elif part == 'b':
        sliced_data = origin_data[parameter_len_a:parameter_len_a + parameter_len_b]
    elif part == 'c':
        sliced_data = origin_data[-parameter_len_c:]
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
        raise ArithmeticError
        return -1
    distance = 0
    length = len(vec_a)
    for i in range(length):
        distance += (vec_a[i] - vec_b[i]) ** 2
    return math.sqrt(distance)


def get_score(positions, centroids):
    score_list = []
    for each_centroid in centroids:
        centroid_score = 0
        for each_user in positions:
            centroid_score += get_distance(each_centroid, each_user)
        score_list.append(centroid_score)
    return score_list


def calc_cost(score_list):
    for part_index in range(len(score_list)):
        for element_index in range(len(score_list[part_index])):
            element = score_list[part_index][element_index]
            score_list[part_index][element_index] = element ** 2  # x^2 fit
    return score_list


def calc_session(pos, centroids):
    cluster_num = np.full(len(centroids), -1)
    # check is empty
    if not pos or not centroids:
        return cluster_num
    # check part number
    if len(pos) != len(centroids):
        return cluster_num
    # check length of each vector
    part_length = len(pos)
    user_length = len(pos[0])
    for part_index in range(part_length):
        if len(pos[part_index][0]) != len(centroids[part_index][0]):
            return cluster_num
        for user_index in range(len(pos[part_index])):
            if len(pos[part_index][user_index]) != len(pos[part_index][0]):
                return cluster_num
        for cluster_index in range(len(centroids[part_index])):
            if len(centroids[part_index][cluster_index]) != len(centroids[part_index][0]):
                return cluster_num
    # calc cost
    score_list = []
    for part_index in range(part_length):
        score_list.append(get_score(pos[part_index], centroids[part_index]))
    cost_list = calc_cost(score_list)
    # find cluster
    for index in range(len(cluster_num)):
        cluster_num[index] = np.argmin(cost_list[index])
    return cluster_num
