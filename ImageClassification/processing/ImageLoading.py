import sys
sys.path.append('.')
import os


import torch.utils.data as data
from torchvision import transforms

from glob import glob
from PIL import Image

image_path = '../data/'
crop_size = 20
BATCH = 64

def file_list(path):
    dir_list = glob(path)

    for filename in dir_list:
        if filename == f''

class ImageTransform():
    def __init__(self, mean, std):
        self.data_transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.CenterCrop(crop_size)
            transforms.Normalize(mean, std)
        ])

    def __call__(self, img):
        return self.data_transform(img)

class DoughDataset(data.Dataset):
    def __init__(self, file_list, transform, train=1):
        self.file_list = file_list
        self.transform = transform
        self.train = train
    def __len__(self):
        return len(self.file_list)

    if self.train == 1:
        def __getitem__(self, index):
            img_path = self.file_list[index]
            img = Image.open(img_path)
            img_transformed = self.transform(img)

            return img_transformed
    else:
        def __getitem__(self, index): # This part change
            img_path = self.file_list[index]
            img = Image.open(img_path)
            img_transformed = self.transform(img)

            return img_transformed

'''
train_dataset = DoughDataset('##########')
test_dataset = DoughDataset('##########', train=0)

train_dataloader = data.DataLoader(dataset=train_dataset, batch_size=BATCH, shuffle=True)
test_dataloader = data.DataLoader(dataset=test_dataset, batch_size=BATCH, shuffle=True)
'''

if __name__=='__main__':
