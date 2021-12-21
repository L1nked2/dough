import * as functions from "firebase-functions";
// import firebaseAdmin from "firebase-admin";
import express = require("express");
import {getKakaoToken, createFirebaseToken} from "./login";
import {getPlaceInfo, getUserInfo, getStationInfo} from "./loader";
// import bodyParser = require("body-parser");
const app = express();
// app.use("/", routes);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// place info routes
app.get("/api/place", (req, res) => {
  getPlaceInfo("00000001_0", "00000001").then((placeInfo) => {
    res.json(placeInfo);
  });
});

app.post("/api/place", (req, res) => {
  getPlaceInfo(req.body.stationId, req.body.placeId).then((placeInfo) => {
    res.json(placeInfo);
  });
});

// station info routes
app.get("/api/station", (req, res) => {
  getStationInfo("00000001", "0").then((stationInfo) => {
    res.json(stationInfo);
  });
});

app.post("/api/station", (req, res) => {
  getStationInfo(req.body.stationId, req.body.category).then((stationInfo) => {
    res.json(stationInfo);
  });
});

// user info routes
app.get("/api/user", (req, res) => {
  getUserInfo("00000001").then((userInfo) => {
    res.json(userInfo);
  });
});

app.post("/api/user", (req, res) => {
  getUserInfo(req.body.userId).then((userInfo) => {
    res.json(userInfo);
  });
});

// login using kakao code
app.get("/api/login", (req, res) => {
  res.send("Forbidden GET /login");
});

app.post("/api/login", (req, res) => {
  const {code} = req.body;
  console.log(`code: ${code}`);
  getKakaoToken(code).then((token) => {
    if (!token) {
      return res.status(400).send({error: "There is no token."})
          .send({message: "Access token is a required parameter."});
    }
    console.log(`Verifying Kakao token: ${token}`);
    createFirebaseToken(token)
        .then((firebaseToken) => {
          console.log(`Returning firebase token to user: ${firebaseToken}`);
          return res.send({access_token: firebaseToken});
        });
    return;
  });
});

export const api = functions.https.onRequest(app);
