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
file = os.path.sep.join(['', '20210907_all_data_366.csv'])  # File name

raw_data = dh.preprocessing_csv(current_path+file)
raw_data = dh.preprocessing_data(raw_data)
# all : 103
# non-parametric : 9 ['ID', 's_data', 'f_date', 'region', 'O1', 'O2', 'O3', 'phone_num', 'prize_per']
# parametric : 94 (2 - 55 - 29 - 8) = 0~1, 2~56, 57~85, 86~93
print(raw_data.head())
raw_data.to_csv('raw_user_data.csv', encoding='ANSI')
(row_num, col_num) = raw_data.shape
raw_data_ga = raw_data.drop(raw_data.columns[0:2], axis=1)
raw_data_ga = raw_data_ga.drop(raw_data.columns[57:94], axis=1)
raw_data_gb = raw_data.drop(raw_data.columns[0:57], axis=1)
raw_data_gb = raw_data_gb.drop(raw_data.columns[86:94], axis=1)
raw_data_gc = raw_data.drop(raw_data.columns[0:86], axis=1)

"""
# pca
pca_a = PCA(n_components=0.99)
pca_b = PCA(n_components=0.99)
pca_c = PCA(n_components=0.99)

train_PCA_GA = pca_a.fit(raw_data_ga.to_numpy())
pf_a = pd.DataFrame(train_PCA_GA.components_)
pf_a.to_csv('pca_a.csv', encoding='ANSI')

train_PCA_GB = pca_b.fit(raw_data_gb.to_numpy())
pf_b = pd.DataFrame(train_PCA_GB.components_)
pf_b.to_csv('pca_b.csv', encoding='ANSI')

train_PCA_GC = pca_c.fit(raw_data_gc.to_numpy())
pf_c = pd.DataFrame(train_PCA_GC.components_)
pf_c.to_csv('pca_c.csv', encoding='ANSI')
"""

# kmeans
cluster_num_a = dh.get_kmeans_cluster_num(raw_data_ga, max_num=25, file_suffix='a')
cluster_num_b = dh.get_kmeans_cluster_num(raw_data_gb, max_num=25, file_suffix='b')
cluster_num_c = dh.get_kmeans_cluster_num(raw_data_gc, max_num=25, file_suffix='c')
print(cluster_num_a)
print(cluster_num_b)
print(cluster_num_c)

"""
# kmeans with 8 clusters
kmeans_label = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids = pd.DataFrame(data=[], index=range(8), columns=['centroids'])
kmeans_result = KMeans(n_clusters=8)
kmeans_result.fit(raw_data.to_numpy())
kmeans_label = pd.DataFrame(kmeans_result.labels_)
kmeans_centroids = pd.DataFrame(kmeans_result.cluster_centers_)
#print(kmeans_label, kmeans_centroids)
kmeans_label.to_csv('kmeans_label.csv', encoding='ANSI')
kmeans_centroids.to_csv('kmeans_centroids.csv', encoding='ANSI')
"""
# kmeans only place
kmeans_label_a = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids_a = pd.DataFrame(data=[], index=range(cluster_num_a), columns=['centroids'])
kmeans_result_a = KMeans(n_clusters=cluster_num_a)
kmeans_result_a.fit(raw_data_ga.to_numpy())
kmeans_label_a = pd.DataFrame(kmeans_result_a.labels_)
kmeans_centroids_a = pd.DataFrame(kmeans_result_a.cluster_centers_)
#print(kmeans_label, kmeans_centroids)
kmeans_label_a.to_csv('kmeans_label_a.csv', encoding='ANSI')
kmeans_centroids_a.to_csv('kmeans_centroids_a.csv', encoding='ANSI')

# kmeans only drink
kmeans_label_c = pd.DataFrame(data=[], index=range(row_num), columns=['label'])
kmeans_centroids_c = pd.DataFrame(data=[], index=range(cluster_num_c), columns=['centroids'])
kmeans_result_c = KMeans(n_clusters=cluster_num_c)
kmeans_result_c.fit(raw_data_gc.to_numpy())
kmeans_label_c = pd.DataFrame(kmeans_result_c.labels_)
kmeans_centroids_c = pd.DataFrame(kmeans_result_c.cluster_centers_)
#print(kmeans_label, kmeans_centroids)
kmeans_label_c.to_csv('kmeans_label_c.csv', encoding='ANSI')
kmeans_centroids_c.to_csv('kmeans_centroids_c.csv', encoding='ANSI')