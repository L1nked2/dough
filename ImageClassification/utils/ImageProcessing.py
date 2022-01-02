import numpy as np
import matplotlib.pyplot as plt
from torchvision import transforms


'''
def center_crop(im):
    width, height, depth = im.shape  # Get dimensions

    if depth !=3:
        depth, width, height = im.shape

    si = int(np.round(img_size/2))

    left = int(np.round(width / 2 - si))
    right = int(np.round(width / 2 + si))
    top = int(np.round(height / 2 + si))
    bottom = int(np.round(height / 2 - si))

    # Crop the center of the image
    im_cropped = im[bottom:top, left:right, :]

    return im_cropped
'''

class ImageTransform():
    def __init__(self, args):
        self.data_transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.RandomCrop(args.img_size), # transforms.Resize(args.img_size)
            transforms.GaussianBlur(kernel_size=3)
        ])

    def __call__(self, img):
        return self.data_transform(img)

'''
something more for utils
'''

if __name__=='__main__':
    # randimg = np.random.random((1000, 600, 3))
    randimg = plt.imread('../whale.jpg')
    plt.imshow(randimg)
    plt.show()
    T = ImageTransform()
    T_img = T(randimg)
    T_img = np.moveaxis(T_img.numpy(), 0, -1)
    plt.imshow(T_img)
    plt.show()