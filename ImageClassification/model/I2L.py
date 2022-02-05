import torchvision.models as models
import torch.nn as nn
import torch

class InceptionV3(nn.Module):
        def __init__(self):
                super(InceptionV3, self).__init__()
                self.model = models.inception_v3(pretrained=True)

        def forward(self, y):
                if self.training:
                        y = self.model(y).logits
                        return y # output shape (None, 8, 8, 1000)
                else:
                        y = self.model(y)
                        return y # output shape (None, 8, 8, 1000)

class LSTM(nn.Module):
        def __init__(self, embedding_dim, classes, dropout):
                super(LSTM, self).__init__()
                self.lstm = nn.LSTM(
                        input_size=3,
                        hidden_size=embedding_dim,
                        batch_first=True,
                        dropout=dropout,
                        bidirectional=True
                )
                self.rnn_fc = nn.Linear(embedding_dim*2, 1000)
                self.final_layer = nn.Sequential(
                        nn.Linear(1000+1000, 1000),
                        nn.Linear(1000, classes)
                )
                self.dropout = nn.Dropout(dropout)

        def forward(self, enc_out, dec_inp):
                hidden, _ = self.lstm(dec_inp.unsqueeze(0))
                hidden = hidden.view(hidden.size(1), -1)
                hidden = self.rnn_fc(hidden)
                concat = torch.cat([enc_out, hidden], dim=1)
                # print(enc_out.size(), hidden.size(), concat.size())
                output = self.dropout(self.final_layer(concat))
                return output

class I2L(nn.Module):
        def __init__(self, embedding_dim, classes, dropout):
                super(I2L, self).__init__()
                self.cnn = InceptionV3()
                self.rnn = LSTM(embedding_dim, classes, dropout)

        def forward(self, img, color_list):
                cnn_output = self.cnn(img)
                output = nn.Softmax()(self.rnn(cnn_output, color_list))

                return output