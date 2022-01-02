import torch
import torch.optim as optim
from ImageClassification.model.CoAtNet import CoAtNet
import ImageClassification.utils.ImageLoading as ImageLoading
import pandas as pd


def predict(args):
    saved_coatnet = CoAtNet(in_ch=3, image_size=args.img_size, dropout_rate=args.dropout_rate, classes=args.classes)
    saved_optimizer = optim.Adam(saved_coatnet.parameters(), lr = args.lr)

    checkpoint = torch.load('./trained_coatnet.pt')
    saved_coatnet.load_state_dict(checkpoint['State_dict'], strict=False)
    saved_optimizer.load_state_dict(checkpoint['optimizer'])

    if args.GPU:
        device = torch.device('cuda')
        saved_coatnet.to(device)
    # epoch = checkpoint['EPOCH']
    # loss = checkpoint['loss']

    PASS = ImageLoading.PassTheData(args)
    saved_coatnet.eval()

    test_dataloader = PASS.pass_test_dataloader()
    with torch.no_grad():
        names = []
        preds = []
        answers = [] # if real
        for i, (name, X, y) in enumerate(test_dataloader):
            # print(i, name, X, y)
            if args.GPU:
                device = torch.device('cuda')
                X = X.to(device)
                y = y.to(device)

            pred = saved_coatnet(X)
            pred = pred.argmax(1).cpu().numpy()

            for n, p, y in zip(name, pred, y.cpu().numpy()):
                print(n, p, y)
                names.append(n)
                preds.append(p)
                answers.append(y) # if real

        answers = {
            'hash' : names,
            'predict' : preds,
            'answer' : answers # if real
        }

    answers_df = pd.DataFrame(answers)
    answers_df.to_csv('./predict.csv', index=False)





