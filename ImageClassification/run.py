
####### NOT REFACTORED ######
from ImageClassification.utils.train_part import train
import argparse


def parse():
    parser = argparse.ArgumentParser(description='Train Unet on FastMRI challenge Images',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('-g', '--GPU-NUM', type=int, default=0, help='GPU number to allocate')
    parser.add_argument('-b', '--batch-size', type=int, default=2, help='Batch size')
    parser.add_argument('-e', '--epochs', type=int, default=10, help='Number of epochs')
    parser.add_argument('-c', '--classes', type=int, default=8, help='Number of classes')
    parser.add_argument('-s', '--img-size', type=int, default=224, help='Size of Image, num*num')
    parser.add_argument('-l', '--lr', type=float, default=1e-3, help='Learning rate')
    parser.add_argument('-t', '--test-size', type=int, default=2, help='Size of test dataset')
    parser.add_argument('-p', '--path', type=str, default='./data', help='train_part module is in utils dir')

    args = parser.parse_args()

    return args


if __name__ == '__main__':
    args = parse()
    # print(args)
    # print(args.batch_size)
    train(args)