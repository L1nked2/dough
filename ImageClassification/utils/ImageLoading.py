import sys
sys.path.append('..')
# from ImageProcessing import center_crop
from ImageClassification.utils.ImageProcessing import ImageTransform

import numpy as np
import torch.utils.data as data
from glob import glob
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split
from tqdm import tqdm

def file_list(path):
    dir_list = glob(f'{path}/*')
    if './data/file_list.csv' in dir_list: dir_list.remove('./data/file_list.csv')
    if './data/trash' in dir_list: dir_list.remove('./data/trash')
    real_dir_list = []
    for dir in dir_list:
        img_list = glob(f'{dir}/*.jpg')
        real_dir_list += img_list

    return real_dir_list

def to_trash(path_list, args):
    df = pd.read_csv(f'{args.path}/file_list.csv', encoding='utf=8')
    print('-----image loading and throwing away------')
    for path in tqdm(path_list):
        im = plt.imread(path)
        # print(np.shape(im))
        if (np.shape(im)[0] < args.img_size or np.shape(im)[1] < args.img_size)or np.shape(im)[2] != 3:
            path_list.remove(path)
            index = df.index[df['Name']==path[7:43]].tolist()[0]
            df.drop(index)

    return path_list, df



class DoughDataset(data.Dataset):
    def __init__(self, path_list, df, transform, args, train=True):
        self.path_list = path_list
        self.annotation = df  # pd.read_csv(f'{args.path}/file_list.csv', encoding='utf-8')
        # print(self.annotation)
        self.transform = transform
        self.train = train
        self.args = args

    def __len__(self):
        return len(self.path_list)

    def __getitem__(self, idx):
        img_path = self.path_list[idx]
        img = plt.imread(img_path)
        img = self.transform(img)
        # change if csv changes
        # print(self.annotation)
        # print(self.annotation[self.annotation['Name']==img_path[7:43]])
        index = self.annotation.index[self.annotation['Name']==img_path[7:43]].tolist()[0] # label = self.annotation[self.annotation['hash']==img_path[8:44]].iloc[0, 2]
        # print(index)
        hash = self.annotation[self.annotation['Name']==img_path[7:43]].iloc[0, 0]
        label = self.annotation.iloc[index, 1]

        return hash, img, label

class PassTheData():
    def __init__(self, args):
        base_path = args.path
        BATCH = args.batch_size
        test_size = args.test_size
        path_list, df = to_trash(file_list(base_path), args)
        # train_test split
        train_img_path_list, test_img_path_list = train_test_split(
            path_list,
            test_size=test_size,
            shuffle=True,
        )
        '''
        img_path_list = file_list(base_path)
        train_img_path_list = img_path_list[test_size:]
        print(img_path_list)
        test_img_path_list = img_path_list[:test_size]
        # print(train_img_path_list)
        '''
        train_dataset = DoughDataset(
            path_list=train_img_path_list,
            transform=ImageTransform(args),
            df=df,
            args=args
        )
        test_dataset = DoughDataset(
            path_list=test_img_path_list,
            transform=ImageTransform(args),
            df=df,
            args=args,
            train=False
        )

        self.train_dataloader = data.DataLoader(dataset=train_dataset, batch_size=BATCH, shuffle=True)
        self.test_dataloader = data.DataLoader(dataset=test_dataset, batch_size=BATCH, shuffle=True)

    def pass_train_dataloader(self):
        return self.train_dataloader

    def pass_test_dataloader(self):
        return self.test_dataloader

