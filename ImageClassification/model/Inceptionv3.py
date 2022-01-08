import torchvision.models as models
import torch.nn as nn

class InceptionV3(nn.Module):
        def __init__(self):
                super(InceptionV3, self).__init__()
                self.model = models.inception_v3(pretrained=True)

        def forward(self, y):
                y = self.model(y)
                return y # output shape (None, 8, 8, 2048)

class LSTM(nn.Module):
        def __init__(self, color, embedding_dim, classes, dropout):
                super(LSTM, self).__init__()
                self.lstm = nn.LSTM(
                        input_size=3 * color,
                        hidden_size=embedding_dim,
                        batch_first=True,
                        dropout=dropout,
                        bidirectional=True
                )
                self.rnn_fc = nn.Linear(embedding_dim, 1000)
                self.final_layer = nn.Linear(1000+2048, classes)
                self.dropout = nn.Dropout(dropout)

        def forward(self, enc_out, dec_inp):
                hidden, _ = self.lstm(dec_inp)
                






























'''
def inception(args):
        model = models.inception_v3(pretrained=True)
        if not args.fine_tune:
                for parameter in model.parameters():
                        parameter.requires_grad = False
        
        # Handle the auxilary net
        num_features = model.AuxLogits.fc.in_features
        model.AuxLogits.fc = nn.Sequential(
                nn.Dropout(args.dropout_rate),
                nn.Linear(num_features, args.classes)
                # nn.Softmax()
        )
        # Handle the primary net
        num_features = model.fc.in_features
        model.fc = nn.Sequential(
                nn.Dropout(args.dropout_rate),
                nn.Linear(num_features, args.classes)
                # nn.Softmax()
        )
        
        return model
'''