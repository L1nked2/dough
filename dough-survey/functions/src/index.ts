import * as functions from "firebase-functions";
// import firebaseAdmin from "firebase-admin";
import express = require("express");
import {kakaoLogin} from "./login";
import {getInfo} from "./loader";
import cors from "cors";
// import bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// login using kakao code
app.get("/api/login", (req, res) => {
  res.send("Forbidden GET /login");
});

app.post("/api/login", (req, res) => {
  kakaoLogin(req).then((token) => {
    res.send({access_token: token});
  });
});

// getInfo routes, provide test data
app.get("/api/:infoType", (req, res) => {
  const type = req.params.infoType;
  if (type === "place") {
    req.body.stationId = "00000001";
    req.body.placeId = "00000001";
  } else if (type === "station") {
    req.body.stationId = "00000001";
    req.body.userToken = "";
    req.body.category = "음식점";
    req.body.tags = [""];
  } else if (type === "user") {
    req.body.userToken = "";
  } else if (type === "post") {
    req.body.postId = "00000001";
  }
  getInfo(type, req).then((info) => {
    res.json(info);
  });
});

app.post("/api/:infoType", (req, res) => {
  const type = req.params.infoType;
  getInfo(type, req).then((info) => {
    res.json(info);
  });
});

export const api = functions.https.onRequest(app);
