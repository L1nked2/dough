import torch
import ImageClassification.utils.ImageLoading as ImageLoading
from tqdm import tqdm
from sklearn.metrics import confusion_matrix
import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np


def vote(dic):
    prediction = {}
    for name in dic['hash']:
        if name not in prediction.keys():
            prediction[f'{name}'] = []

    for name, pred, real in zip(dic['hash'], dic['predict'], dic['answer']):
        prediction[f'{name}'].append([pred, real])
    # print(prediction)
    for key in prediction.keys():
        prediction[f'{key}'] = np.array(prediction[f'{key}'])
        # print('directory', prediction[f'{key}'][:, 0], '||->||', 'answer', prediction[f'{key}'][:, 1][0])
        prediction[f'{key}'] = max(prediction[f'{key}'][:, 0], key=list(prediction[f'{key}'][:, 0]).count)

    answer = {
        'Name' : list(prediction.keys()),
        'pred' : list(prediction.values()),
        'answer' : []
    }

    for n1 in prediction.keys():
        ones = 0
        for n2, a in zip(dic['hash'], dic['answer']):
            if n1 == n2 and ones != 1:
                ones = 1
                answer['answer'].append(a)

    right = 0
    size = len(answer['pred'])

    for p, a in zip(answer['pred'], answer['answer']): right += (p == a)

    return answer, right/size

def predict(args):

    print('\n------------------Now predicting------------------')
    model = torch.load('./I2L_net.pt')
    model.eval()

    if args.GPU:
        device = torch.device('cuda')
        model.to(device)

    PASS = ImageLoading.PassTheData(args)

    test_dataloader = PASS.pass_test_dataloader()

    names = []
    preds = []
    reals = []
    with torch.no_grad():
        print('\n------------predicting---------------')

        for name, Xs, ys, cs in tqdm(test_dataloader): # for name, Xs, ys in tqdm(predict_dataloader):
            # print(name, Xs, ys)

            if args.GPU:
                device = torch.device('cuda')
                Xs = Xs.to(device)
                ys = ys.to(device)
                cs = cs.to(device)

            pred = model(Xs, cs)
            # print(pred.cpu().numpy())
            pred = pred.argmax(1).cpu().numpy()
            ys = ys.argmax(1).cpu().numpy()

            for n, p, y in zip(name, pred, ys): # vote system needed
                names.append(n)
                preds.append(p)
                reals.append(y)  # if real

    answers = {
        'hash' : names,
        'predict' : preds,
        'answer' : reals # if real
    }

    prediction, correct = vote(answers)

    print(f'\npredict accuracy is {correct * 100}%')

    # print(len(prediction['Name']), len(prediction['pred']), len(prediction['answer']))
    prediction_df = pd.DataFrame(prediction)
    prediction_df.to_csv('./predict.csv', index=False)

    cf_matrix = confusion_matrix(prediction['pred'], prediction['answer'])
    classes = [f'{i}' for i in range(args.classes)]

    df_cm = pd.DataFrame(cf_matrix / np.sum(cf_matrix), index=classes, columns=classes)

    sns.heatmap(df_cm, annot=True)
    plt.xlabel('answer')
    plt.ylabel('prediction')
    plt.show()
