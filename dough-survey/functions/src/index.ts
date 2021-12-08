import * as functions from "firebase-functions";
import express from "express";
// import * as login from "./login";

const app = express();
// app.use("/", routes);

app.get("/api/place", (req, res) => {
  res.send("Forbidden");
});

app.get("/api/login", (req, res) => {
  res.send("Hello from Express on Firebase!");
});

app.post("/api/login", (req, res) => {
  console.log(req.body);
  res.send("api");
});

export const api = functions.https.onRequest(app);
