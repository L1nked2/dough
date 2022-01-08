import sys
sys.path.append('..')
sys.path.append('.')

import ImageClassification.utils.ImageLoading as ImageLoading
from ImageClassification.model.I2L import I2L
from ImageClassification.utils.predict import vote

import torch.nn as nn
import torch.optim as optim
import torch
import matplotlib.pyplot as plt
import numpy as np

'''
Something for training
'''


def train_loop(dataloader, model, loss_fn, optimizer, scheduler, args):
    size = len(dataloader.dataset)

    train_loss = 0
    for batch, (_, X, y, c) in enumerate(dataloader):
        if args.GPU:
            device = torch.device('cuda')
            X = X.to(device)
            y = y.to(device)
            c = c.to(device)

        pred = model(X, c)

        '''
        plt.subplot(1, 2, 1)
        plt.imshow(np.moveaxis(X.cpu().detach().numpy()[0], 0, -1))
        plt.subplot(1, 2, 2)
        plt.imshow(np.moveaxis(X.cpu().detach().numpy()[1], 0, -1))
        plt.show()
        '''
        # print(pred.cpu().detach().numpy())

        # print(pred.argmax(1).cpu().numpy(), y.argmax(1).cpu().numpy())

        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        train_loss += loss.item()


        if batch % 100 == 0:
            loss, current = loss.item(), batch * len(X)
            print(f"loss: {loss:>10f}  [{current:>5d}/{size:>5d}]")

    scheduler.step()
    train_loss /= size

    return train_loss

def val_loop(dataloader, model, loss_fn, args):
    size = len(dataloader.dataset)
    num_batches = len(dataloader)
    val_loss, correct = 0, 0

    names = []
    preds = []
    reals = []

    with torch.no_grad():
        for name, Xs, ys, cs in dataloader:
            if args.GPU:
                device = torch.device('cuda')
                Xs = Xs.to(device)
                ys = ys.to(device)
                cs = cs.to(device)

            pred = model(Xs, cs)
            # print(pred.argmax(1).cpu().numpy(), y.argmax(1).cpu().numpy())
            val_loss += loss_fn(pred, ys).item()
            correct += (pred.argmax(1) == ys.argmax(1)).type(torch.float).sum().item()

            for n, p, y in zip(name, pred.argmax(1).cpu().numpy(), ys.argmax(1).cpu().numpy()):  # vote system needed
                names.append(n)
                preds.append(p)
                reals.append(y)  # if real

        answers = {
            'hash': names,
            'predict': preds,
            'answer': reals  # if real
        }

    _, correct = vote(answers)

    val_loss /= num_batches
    print(f"Val Error: \n Accuracy: {(100*correct):>0.2f}%, Avg loss: {val_loss:>8f} \n")

    return correct, val_loss


def train(args):
    print('\n------------------Now training------------------')
    learning_rate = args.lr
    EPOCHS = args.epochs
    weight_decay = args.weight_decay

    model = I2L(embedding_dim=args.embedding_dim, classes=args.classes, dropout=args.dropout_rate)

    if args.GPU:
        device = torch.device('cuda')
        model.to(device)

    PASS = ImageLoading.PassTheData(args)
    train_dataloader = PASS.pass_train_dataloader()
    val_dataloader = PASS.pass_val_dataloader()

    # criterion = nn.CrossEntropyLoss()
    criterion = nn.MSELoss()
    # optimizer = optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=learning_rate, weight_decay=weight_decay)
    optimizer = optim.SGD(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = optim.lr_scheduler.StepLR(optimizer=optimizer, step_size=5, gamma=0.5)

    history = {'accuracy':[], 'train_loss': [], 'test_loss':[]}
    for t in range(EPOCHS):
        print('\n')
        print(f"Epoch {t+1}\n-------------------------------")
        # for f in => K-fold

        model.train()
        train_loss = train_loop(train_dataloader, model, criterion, optimizer, scheduler, args)
        model.eval()
        correct, val_loss = val_loop(val_dataloader, model, criterion, args)

        history['train_loss'].append(train_loss)
        history['accuracy'].append(correct)
        history['test_loss'].append(val_loss)

        if correct >= max(history['accuracy']):
            torch.save(model, './I2L_net.pt')


    plt.figure(figsize=(10, 5))

    plt.subplot(1, 2, 1)
    plt.title('Accuracy')
    plt.plot(range(EPOCHS), history['accuracy'])
    plt.subplot(1, 2, 2)
    plt.title('loss')
    plt.plot(range(EPOCHS), history['test_loss'], history['train_loss'])
    plt.show()
    print("Done!")