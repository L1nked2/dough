import numpy as np
import pandas as pd
import os, time
import pickle, gzip
import matplotlib.pyplot as plt
import matplotlib as mpl
import doughmat as dhm
import argparse
from sklearn import preprocessing as pp
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_recall_curve, average_precision_score
from sklearn.metrics import roc_curve, auc, roc_auc_score
from sklearn.cluster import KMeans

# init clusters
centroids_a = dhm.read_csv(filetype='centroids', file_suffix='a')
centroids_b = dhm.read_csv(filetype='centroids', file_suffix='b')
centroids_c = dhm.read_csv(filetype='centroids', file_suffix='c')
centroids = [centroids_a.to_numpy(), centroids_b.to_numpy(), centroids_c.to_numpy()]

# init pca
pca_vector_a = dhm.read_csv(filetype='pca_vectors', file_suffix='a')
pca_vector_b = dhm.read_csv(filetype='pca_vectors', file_suffix='b')
pca_vector_c = dhm.read_csv(filetype='pca_vectors', file_suffix='c')
pca_vector_a_inv = np.linalg.inv(pca_vector_a.to_numpy().T)
pca_vector_b_inv = np.linalg.inv(pca_vector_b.to_numpy().T)
pca_vector_c_inv = np.linalg.inv(pca_vector_c.to_numpy().T)

# init coefficient
coef_result_a = dhm.read_csv(filetype='coef_result', file_suffix='a')
coef_result_b = dhm.read_csv(filetype='coef_result', file_suffix='b')
coef_result_c = dhm.read_csv(filetype='coef_result', file_suffix='c')
coef_result_a = coef_result_a.to_numpy()
coef_result_b = coef_result_b.to_numpy()
coef_result_c = coef_result_c.to_numpy()

# preprocess csv(user data)
raw_data = dhm.preprocessing_csv('all_data.csv')  # File name
user_data = dhm.preprocessing_data(raw_data, norm=True)

# argument parse
parser = argparse.ArgumentParser(description='For given user IDs, make session and calculate solution')
parser.add_argument('--user', '-u', action="extend", nargs="+", type=int)
args = parser.parse_args()
target_users = args.user

# read user -> read user ID
# to be altered later
user_parameter_sparse = user_data.query('ID in @target_users').to_numpy()[:, 1:].T

# slice data and calculate position
user_parameter_sparse_a = dhm.slice_part(user_parameter_sparse, part='a')
user_parameter_sparse_b = dhm.slice_part(user_parameter_sparse, part='b')
user_parameter_sparse_c = dhm.slice_part(user_parameter_sparse, part='c')

user_pos_a = dhm.get_position(pca_vector_a_inv, coef_result_a, user_parameter_sparse_a, part='a')
user_pos_b = dhm.get_position(pca_vector_b_inv, coef_result_b, user_parameter_sparse_b, part='b')
user_pos_c = dhm.get_position(pca_vector_c_inv, coef_result_c, user_parameter_sparse_c, part='c')
user_pos = [user_pos_a, user_pos_b, user_pos_c]
print(dhm.calc_session(user_pos, centroids))


