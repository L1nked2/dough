import sys
sys.path.append('..')
# from ImageProcessing import center_crop
from ImageClassification.utils.ImageProcessing import ImageTransform

import torch
import numpy as np
import torch.utils.data as data
from glob import glob
import matplotlib.pyplot as plt
import pandas as pd
from tqdm import tqdm

def filtered_colored(path_list, args):
    input_list = {'list' : [], 'color' : []}
    for path in tqdm(path_list):
        im = plt.imread(path)
        H, W, C = np.shape(im)
        if H >= 299 and W >= 299 and C == 3:
            input_list['list'].append(path)
            randint = np.random.randint(0, min(H, W), size=2 * args.colors)
            color_list = []
            for i in range(len(randint)):
                if i % 2 == 0:
                    color_list += [list(im[randint[i], randint[i+1], :] / 255)]

            input_list['color'].append(np.array(color_list))

    for i in range(len(input_list['color'])):
        input_list['color'][i] = list(np.mean(np.array(input_list['color'])[i], axis=0))

    return input_list

def file_list(path, args):
    dir_list = glob(f'{path}/*')
    if './data/file_list.csv' in dir_list: dir_list.remove('./data/file_list.csv')
    if './data/file_list.csv' in dir_list: dir_list.remove('./data/file_list.xlsx')
    if './data/trash' in dir_list: dir_list.remove('./data/trash')

    np.random.shuffle(dir_list)
    dir_list = list(dir_list)

    test_dir_list = dir_list[:args.test_size]
    train_dir_list = dir_list[args.test_size:]
    print('------image loading and throwing away------')

    real_train = []
    for train_dir in train_dir_list:
        img_list = glob(f'{train_dir}/{args.level}.jpg')
        real_train += img_list

    print('Processing...')
    real_train = filtered_colored(real_train, args)

    real_test = []
    for test_dir in test_dir_list:
        img_list = glob(f'{test_dir}/{args.level}.jpg')
        real_test += img_list

    real_test = filtered_colored(real_test, args)

    return real_train, real_test


def regular(dic, df, args):
    freq = df.groupby(['Cluster_a']).count()
    number = min(freq['Name'])

    cluster = {f'{i}': df[df['Cluster_a']==i]['Name'].tolist() for i in range(args.classes)}

    for i in range(args.classes): cluster[f'{i}'] = cluster[f'{i}'][0:number]

    # print(cluster)
    cluster_list = list(np.array(list(cluster.values())).reshape(1, args.classes*number).squeeze(0))

    real_dic = {'list' : [], 'color' : []}
    for path in dic['list']:
        for name in cluster_list:
            if path[7:43] == name: real_dic['list'].append(path)

    for r_l in real_dic['list']:
        for l, c in zip(dic['list'], dic['color']):
            if r_l == l: real_dic['color'].append(c)

    return real_dic

class DoughDataset(data.Dataset):
    def __init__(self, dic, df, transform, args):
        self.path_list = dic['list']
        self.annotation = df  # pd.read_csv(f'{args.path}/file_list.csv', encoding='utf-8')
        # print(self.annotation)
        self.transform = transform
        self.args = args
        self.colors = dic['color']
    def __len__(self):
        return len(self.path_list)

    def __getitem__(self, idx):
        img_path = self.path_list[idx]
        img = plt.imread(img_path)
        img = self.transform(img)
        color = self.colors[idx]
        # change if csv changes
        # print(self.annotation)
        # print(self.annotation[self.annotation['Name']==img_path[7:43]])
        index = self.annotation.index[self.annotation['Name']==img_path[7:43]].tolist()[0] # label = self.annotation[self.annotation['hash']==img_path[8:44]].iloc[0, 2]
        # print(index)
        name = self.annotation[self.annotation['Name']==img_path[7:43]].iloc[0, 0]
        label = self.annotation.iloc[index, 1]
        hot_label = [0] * self.args.classes
        hot_label[label] = 1
        smooth_label = []
        for l in hot_label:
            l = l*(1-self.args.label_smoothing) + self.args.label_smoothing / self.args.classes
            smooth_label.append(l)

        return name, torch.tensor(img, dtype=torch.float32), torch.tensor(smooth_label, dtype=torch.float32), torch.tensor(color, dtype=torch.float32)

def train_test_split(dic, test_size):
    total_size = len(dic['list'])

    train_dic = {'list' : dic['list'][int(test_size*total_size):], 'color' : dic['color'][int(test_size*total_size):]}
    test_dic = {'list': dic['list'][:int(test_size * total_size)], 'color': dic['color'][:int(test_size * total_size)]}

    return train_dic, test_dic

class PassTheData():
    def __init__(self, args):

        base_path = args.path
        batch = args.batch_size
        df = pd.read_csv(f'{args.path}/file_list.csv', encoding='utf=8')
        train_dic, test_dic = file_list(base_path, args)
        train_dic = regular(dic=train_dic, df=df, args=args)

        # train_test split

        train_dic, val_dic = train_test_split(
            train_dic,
            test_size=0.2
        )

        train_dataset = DoughDataset(
            dic=train_dic,
            transform=ImageTransform(args),
            df=df,
            args=args
        )
        val_dataset = DoughDataset(
            dic=val_dic,
            transform=ImageTransform(args),
            df=df,
            args=args
        )
        self.train_dataloader = data.DataLoader(dataset=train_dataset, batch_size=batch, shuffle=True)
        self.val_dataloader = data.DataLoader(dataset=val_dataset, batch_size=batch, shuffle=True)

        test_dataset = DoughDataset(
            dic=test_dic,
            transform=ImageTransform(args),
            df=df,
            args=args
        )

        self.test_dataloader = data.DataLoader(dataset=test_dataset, batch_size=1, shuffle=True)

    def pass_train_dataloader(self):
        return self.train_dataloader

    def pass_val_dataloader(self):
        return self.val_dataloader

    def pass_test_dataloader(self):
        return self.test_dataloader

