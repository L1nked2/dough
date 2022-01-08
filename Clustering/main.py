import numpy as np
import pandas as pd
import os, time
import pickle, gzip
import matplotlib.pyplot as plt
import matplotlib as mpl
import dough as dh
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn import preprocessing as pp
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve, average_precision_score
from sklearn.metrics import roc_curve, auc, roc_auc_score
from sklearn.cluster import KMeans

color = sns.color_palette()
current_path = os.getcwd()
file = os.path.sep.join(['', '20210910_all_data.csv'])  # File name

raw_data = dh.preprocessing_csv(current_path+file)
raw_data = dh.preprocessing_data(raw_data, norm=True)

print(raw_data.head())
raw_data.to_csv('raw_user_data.csv', encoding='ANSI')
(row_num, col_num) = raw_data.shape
raw_data_ga = dh.slice_data(raw_data, part='a')
raw_data_gb = dh.slice_data(raw_data, part='b')
raw_data_gc = dh.slice_data(raw_data, part='c')


# pca
dh.get_pca_vec(raw_data_ga, vec_num=4, file_suffix='a')
dh.get_pca_vec(raw_data_gb, vec_num=4, file_suffix='b')
dh.get_pca_vec(raw_data_gc, vec_num=4, file_suffix='c')
data_pca_a = dh.get_pca_transform(raw_data_ga, n_components=3, file_suffix='a')
data_pca_b = dh.get_pca_transform(raw_data_gb, n_components=4, file_suffix='b')
data_pca_c = dh.get_pca_transform(raw_data_gc, n_components=2, file_suffix='c')
dh.get_pca_variance_ratio(raw_data_ga, max_num=10, file_suffix='a')
dh.get_pca_variance_ratio(raw_data_gb, max_num=10, file_suffix='b')
dh.get_pca_variance_ratio(raw_data_gc, max_num=10, file_suffix='c')

# determining kmeans cluster number
cluster_num_a = 8
cluster_num_b = 5
cluster_num_c = 4
# cluster_num_a = dh.get_kmeans_cluster_num(data_pca_a, max_num=25, file_suffix='a')
# cluster_num_b = dh.get_kmeans_cluster_num(data_pca_b, max_num=25, file_suffix='b')
# cluster_num_c = dh.get_kmeans_cluster_num(data_pca_c, max_num=25, file_suffix='c')
print(cluster_num_a, cluster_num_b, cluster_num_c)

# kmeans only place
kmeans_result_a = dh.get_kmeans_result(data_pca_a, n_clusters=cluster_num_a, file_suffix='a')

# kmeans only food
kmeans_result_b = dh.get_kmeans_result(data_pca_b, n_clusters=cluster_num_b, file_suffix='b')

# kmeans only drink
kmeans_result_c = dh.get_kmeans_result(data_pca_c, n_clusters=cluster_num_c, file_suffix='c')

"""
# A coeff calc
coef_result_a = []
for i in range(1, 56):
    coef_row = []
    for j in range(1, 56):
        index_x = 'A' + f'{i}'.zfill(2)
        index_y = 'A' + f'{j}'.zfill(2)
        result = np.corrcoef(raw_data_ga[index_x].to_numpy(), raw_data_ga[index_y].to_numpy())[0, 1]
        coef_row.append(result)
    coef_result_a.append(coef_row)
pd.DataFrame(coef_result_a).to_csv('coef_result_a.csv', encoding='ANSI')

# B coeff calc
coef_result_b = []
for i in range(1, 30):
    coef_row = []
    for j in range(1, 30):
        index_x = 'B' + f'{i}'.zfill(2)
        index_y = 'B' + f'{j}'.zfill(2)
        result = np.corrcoef(raw_data_gb[index_x].to_numpy(), raw_data_gb[index_y].to_numpy())[0, 1]
        coef_row.append(result)
    coef_result_b.append(coef_row)
pd.DataFrame(coef_result_b).to_csv('coef_result_b.csv', encoding='ANSI')

# C coeff calc
coef_result_c = []
for i in range(1, 9):
    coef_row = []
    for j in range(1, 9):
        index_x = 'C' + f'{i}'.zfill(2)
        index_y = 'C' + f'{j}'.zfill(2)
        result = np.corrcoef(raw_data_gc[index_x].to_numpy(), raw_data_gc[index_y].to_numpy())[0, 1]
        coef_row.append(result)
    coef_result_c.append(coef_row)
pd.DataFrame(coef_result_c).to_csv('coef_result_c.csv', encoding='ANSI')

"""


