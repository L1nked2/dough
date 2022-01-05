import sys
sys.path.append('..')
sys.path.append('.')

from ImageClassification.model.CoAtNet import CoAtNet
import ImageClassification.utils.ImageLoading as ImageLoading
from ImageClassification.model.CoAtNet import weight_init
import torch.nn as nn
import torch.optim as optim
import torch

'''
Something for training
'''


def train_loop(dataloader, model, loss_fn, optimizer, args):
    size = len(dataloader.dataset)

    for batch, (_, X, y) in enumerate(dataloader):
        if args.GPU:
            device = torch.device('cuda')
            X = X.to(device)
            y = y.to(device)
        pred = model(X)
        # pred = pred.unsqueeze(0)
        # print(pred.argmax(1), y)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        # if batch % 100 == 0:
        loss, current = loss.item(), batch * len(X)
        print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")


def tes_loop(dataloader, model, loss_fn, args):
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    test_loss, correct = 0, 0

    with torch.no_grad():
        for _, X, y in dataloader:
            if args.GPU:
                device = torch.device('cuda')
                X = X.to(device)
                y = y.to(device)
            pred = model(X)
            # pred = pred.unsqueeze(0)
            test_loss += loss_fn(pred, y).item()
            # print(pred.argmax(1), y)
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")

def save_checkpoint(epoch,  model, optimizer, path):
    state = {
        'EPOCH' : epoch,
        'State_dict' : model.state_dict(),
        'optimizer' : optimizer.state_dict()
    }
    torch.save(state, path)


def train(args):
    learning_rate = args.lr
    EPOCHS = args.epochs
    image_size = args.img_size
    classes = args.classes
    dropout_rate = args.dropout_rate

    coatnet = CoAtNet(in_ch=3, image_size=image_size, dropout_rate=dropout_rate, classes=classes)
    coatnet.apply(weight_init)

    if args.GPU:
        device = torch.device('cuda')
        coatnet.to(device)

    coatnet.train()

    PASS = ImageLoading.PassTheData(args)
    train_dataloader = PASS.pass_train_dataloader()
    test_dataloader = PASS.pass_test_dataloader()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(coatnet.parameters(), lr=learning_rate)

    for t in range(EPOCHS):
        print('\n')
        print(f"Epoch {t+1}\n-------------------------------")

        train_loop(train_dataloader, coatnet, criterion, optimizer, args)
        tes_loop(test_dataloader, coatnet, criterion, args)

        save_checkpoint(EPOCHS, coatnet, optimizer, './trained_coatnet.pt')

    print("Done!")

# model save and load
# making submission(to_csv)
