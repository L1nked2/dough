import sys
sys.path.append('..')
# from ImageProcessing import center_crop
from ImageClassification.utils.ImageProcessing import ImageTransform


import numpy as np
import torch.utils.data as data
from glob import glob
import matplotlib.pyplot as plt
import pandas as pd

def file_list(path):
    dir_list = glob(f'{path}/*')
    dir_list.remove('./data/cluster_result_sample.csv')
    real_dir_list = []
    for dir in dir_list:
        img_list = glob(f'{dir}/thumbnail_inside/*.jpg')
        real_dir_list += img_list

    return real_dir_list

class DoughDataset(data.Dataset):
    def __init__(self, path_list, annotation_dir, transform, train=True):
        self.path_list = path_list
        self.annotation = pd.read_csv(f'{annotation_dir}/cluster_result_sample.csv', encoding='cp949')
        # print(self.annotation)
        self.transform = transform
        self.train = train

    def __len__(self):
        return len(self.path_list)

    def __getitem__(self, idx):
        img_path = self.path_list[idx]
        img = plt.imread(img_path)
        img = self.transform(img)
        # change if csv changes
        index = self.annotation.index[self.annotation['hash']==img_path[7:43]].tolist()[0] # label = self.annotation[self.annotation['hash']==img_path[8:44]].iloc[0, 2]
        label = self.annotation.iloc[index, 2]
        # encoder = [0]*CLASSIFIER
        # encoder[label] = 1
        # encoder = torch.Tensor(encoder)
        return img, label


class PassTheData():
    def __init__(self, args):
        base_path = args.path
        BATCH = args.batch_size
        test_size = args.test_size
        # train_test split
        img_path_list = file_list(base_path)

        train_img_path_list = img_path_list[test_size:]
        test_img_path_list = img_path_list[:test_size]
        # print(train_img_path_list)
        train_dataset = DoughDataset(
            path_list=train_img_path_list,
            annotation_dir=base_path,
            transform=ImageTransform(args)
        )
        test_dataset = DoughDataset(
            path_list=test_img_path_list,
            annotation_dir=base_path,
            transform=ImageTransform(args),
            train=False
        )
        self.train_dataloader = data.DataLoader(dataset=train_dataset, batch_size=BATCH, shuffle=True)
        self.test_dataloader = data.DataLoader(dataset=test_dataset, batch_size=BATCH, shuffle=True)

    def pass_train_dataloader(self):
        return self.train_dataloader

    def pass_test_dataloader(self):
        return self.test_dataloader


if __name__=='__main__':

    PASS = PassTheData()
    train_dataloader = PASS.pass_train_dataloader()


    train_img, train_label = next(iter(train_dataloader))
    print(f"Feature batch shape: {train_img.size()}")
    print(f"Labels batch shape: {train_label.size()}")

    img = train_img.squeeze()
    print(img.size())
    plt.imshow(np.moveaxis(img.numpy(), 0, -1), cmap="gray")
    plt.show()
    print(f"Label: {train_label}")

