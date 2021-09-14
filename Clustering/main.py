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

dh.pca_calc_variance_ratio(raw_data_gb, 10, file_suffix='b')
dh.pca_calc_variance_ratio(raw_data_gc, 10, file_suffix='c')

# determining kmeans cluster number
"""
cluster_num_a = dh.get_kmeans_cluster_num(raw_data_ga, max_num=25, file_suffix='a')
cluster_num_b = dh.get_kmeans_cluster_num(raw_data_gb, max_num=25, file_suffix='b')
cluster_num_c = dh.get_kmeans_cluster_num(raw_data_gc, max_num=25, file_suffix='c')
print(cluster_num_a)
print(cluster_num_b)
print(cluster_num_c)
"""
cluster_num_a = 5
cluster_num_b = 4
cluster_num_c = 3


# kmeans only place
kmeans_label_a = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids_a = pd.DataFrame(data=[], index=range(cluster_num_a), columns=['centroids'])
kmeans_result_a = KMeans(n_clusters=cluster_num_a, n_init=30)
kmeans_result_a.fit(raw_data_ga.to_numpy())
kmeans_label_a = pd.DataFrame(kmeans_result_a.labels_)
kmeans_centroids_a = pd.DataFrame(kmeans_result_a.cluster_centers_)
kmeans_label_a.to_csv('kmeans_label_a.csv', encoding='ANSI')
kmeans_centroids_a.to_csv('kmeans_centroids_a.csv', encoding='ANSI')

# parameter by cluster
mean_series = kmeans_centroids_a.iloc[:, :].mean(axis=0)
for i in range(kmeans_centroids_a.shape[0]):
    kmeans_centroids_a.iloc[:, i] = kmeans_centroids_a.iloc[:, i] - mean_series.iloc[i]
kmeans_centroids_a_quantized = kmeans_centroids_a.applymap(lambda x: x/abs(x) if abs(x) > 0.8 else 0)
#print(kmeans_centroids_a_vectorized)
kmeans_centroids_a_quantized.to_csv('kmeans_centroids_a_quantized.csv', encoding='ANSI')


# kmeans only food
kmeans_label_b = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids_b = pd.DataFrame(data=[], index=range(cluster_num_b), columns=['centroids'])
kmeans_result_b = KMeans(n_clusters=cluster_num_b, n_init=30)
kmeans_result_b.fit(raw_data_gb.to_numpy())
kmeans_label_b = pd.DataFrame(kmeans_result_b.labels_)
kmeans_centroids_b = pd.DataFrame(kmeans_result_b.cluster_centers_)
#print(kmeans_label, kmeans_centroids)
kmeans_label_b.to_csv('kmeans_label_b.csv', encoding='ANSI')
kmeans_centroids_b.to_csv('kmeans_centroids_b.csv', encoding='ANSI')

# kmeans only drink
kmeans_label_c = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids_c = pd.DataFrame(data=[], index=range(cluster_num_c), columns=['centroids'])
kmeans_result_c = KMeans(n_clusters=cluster_num_c, n_init=30)
kmeans_result_c.fit(raw_data_gc.to_numpy())
kmeans_label_c = pd.DataFrame(kmeans_result_c.labels_)
kmeans_centroids_c = pd.DataFrame(kmeans_result_c.cluster_centers_)
#print(kmeans_label, kmeans_centroids)
kmeans_label_c.to_csv('kmeans_label_c.csv', encoding='ANSI')
kmeans_centroids_c.to_csv('kmeans_centroids_c.csv', encoding='ANSI')

"""
pca = PCA()

train_PCA_GA = pca.fit(kmeans_centroids_a.to_numpy())
pf_a = pd.DataFrame(train_PCA_GA.components_)
pf_a.to_csv('pca_cluster_a.csv', encoding='ANSI')
train_PCA_GB = pca.fit(kmeans_centroids_b.to_numpy())
pf_b = pd.DataFrame(train_PCA_GB.components_)
pf_b.to_csv('pca_cluster_b.csv', encoding='ANSI')
train_PCA_GC = pca.fit(kmeans_centroids_c.to_numpy())
pf_c = pd.DataFrame(train_PCA_GC.components_)
pf_c.to_csv('pca_cluster_c.csv', encoding='ANSI')
"""
