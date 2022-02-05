import torch
import ImageClassification.utils.ImageLoading as ImageLoading
from tqdm import tqdm
import pandas as pd
import numpy as np
import pickle
from copy import deepcopy
def perc(li):
    m = max(li)
    cnt = 0
    for e in li:
        cnt += (m==e)
    return cnt/len(li) * 100
    
def vote(dic):
    prediction = {}
    for name in dic['hash']:
        if name not in prediction.keys():
            prediction[f'{name}'] = []

    for name, pred in zip(dic['hash'], dic['predict']):
        prediction[f'{name}'].append(pred)
    
    raw_pred = deepcopy(prediction)
    for key in prediction.keys():
        prediction[f'{key}'] = np.array(prediction[f'{key}'])
        prediction[f'{key}'] = max(prediction[f'{key}'], key=list(prediction[f'{key}']).count)
    
    for key, value in zip(list(raw_pred.keys()), list(raw_pred.values())):
        
    	print('Name:,', key, ',Predictions:,', value, f'{perc(value):<3}', ',Won:,', prediction[f'{key}'])
    
    answer = {
        'Name' : list(prediction.keys()),
        'pred' : list(prediction.values())
    }

    return answer

def inference(args):

    print('\n------------------Now predicting------------------')
    model = torch.load('./100E_ALL_I2L_net.pt', map_location=torch.device('cpu'))
    model.eval()

    if args.GPU:
        device = torch.device('cuda')
        model.to(device)

    PASS = ImageLoading.PassTheData(args)

    inf_dataloader = PASS.pass_inf_dataloader()

    names = []
    preds = []
    reals = []
    with torch.no_grad():
        print('\n------------inferencing---------------')

        for name, Xs, _,  cs in tqdm(inf_dataloader): # for name, Xs, ys in tqdm(predict_dataloader):
            # print(name, Xs, ys)

            if args.GPU:
                device = torch.device('cuda')
                Xs = Xs.to(device)
                cs = cs.to(device)

            pred = model(Xs, cs)
            # print(pred.cpu().numpy())
            pred = pred.argmax(1).cpu().numpy()

            for n, p in zip(name, pred):
                names.append(n)
                preds.append(p)

    answers = {
        'hash' : names,
        'predict' : preds,
    }

    prediction = vote(answers)

    prediction_df = pd.DataFrame(prediction)
    prediction_df.to_csv('./inference.csv', index=False)
    
    inference = {}
    for name, pred in zip(prediction_df.iloc[:,0], prediction_df.iloc[:, 1]):
    	inference[name] = pred
    
    with open('./inference.pkl', 'wb') as f:
        pickle.dump(inference, f)
