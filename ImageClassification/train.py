import sys
sys.path.append('.')
sys.path.append('./processing')
sys.path.append('./data')
from model.CoAtNet import CoAtNet
from processing import ImageLoading

import torch.nn as nn
import torch.optim as optim
import torch

'''
Something for training
'''

learning_rate = 1e-3
batch_size = 1
EPOCHS = 10
image_size = 224
CLASSIFIER = 8

coatnet = CoAtNet(3, image_size)
PASS = ImageLoading.PassTheData()

train_dataloader = PASS.pass_train_dataloader()
test_dataloader = PASS.pass_test_dataloader()

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(coatnet.parameters(), lr=learning_rate)


def train_loop(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)

    for batch, (X, y) in enumerate(dataloader):
        pred = model(X)
        pred = pred.unsqueeze(0)
        # print(pr)
        # print(pred)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        # if batch % 100 == 0:
        loss, current = loss.item(), batch * len(X)
        print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")


def tes_loop(dataloader, model, loss_fn):
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    test_loss, correct = 0, 0

    with torch.no_grad():
        for X, y in dataloader:
            pred = model(X)
            pred = pred.unsqueeze(0)
            test_loss += loss_fn(pred, y).item()
            print(pred.argmax(1))
            print(y)
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= num_batches
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")


for t in range(EPOCHS):
    print(f"Epoch {t+1}\n-------------------------------")
    train_loop(train_dataloader, coatnet, criterion, optimizer)
    tes_loop(test_dataloader, coatnet, criterion)

print("Done!")
