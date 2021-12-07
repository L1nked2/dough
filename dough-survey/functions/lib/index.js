"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = require("firebase-functions");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const express = require("express");
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
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map