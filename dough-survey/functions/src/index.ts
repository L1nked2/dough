import * as functions from "firebase-functions";
// import firebaseAdmin from "firebase-admin";
import express = require("express");
import {getKakaoToken, createFirebaseToken} from "./login";
// import bodyParser = require("body-parser");
const app = express();
// app.use("/", routes);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/api/place", (req, res) => {
  res.send("Forbidden");
});

app.post("/api/place", (req, res) => {
  res.send("Forbidden");
});

app.get("/api/login", (req, res) => {
  res.send("Forbidden GET /login");
});

app.post("/api/login", (req, res) => {
  const {code} = req.body;
  console.log(`req.body: ${req.body.code}`);
  console.log(`req.query: ${req.query.code}`);
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
