"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
// import firebaseAdmin from "firebase-admin";
const express = require("express");
const login_1 = require("./login");
const loader_1 = require("./loader");
// import bodyParser = require("body-parser");
const app = express();
// app.use("/", routes);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// place info routes
app.get("/api/place", (req, res) => {
    (0, loader_1.getPlaceInfo)("00000001_0", "00000001").then((placeInfo) => {
        res.json(placeInfo);
    });
});
app.post("/api/place", (req, res) => {
    (0, loader_1.getPlaceInfo)(req.body.stationId, req.body.placeId).then((placeInfo) => {
        res.json(placeInfo);
    });
});
// station info routes
app.get("/api/station", (req, res) => {
    (0, loader_1.getStationInfo)("00000001", "0").then((stationInfo) => {
        res.json(stationInfo);
    });
});
app.post("/api/station", (req, res) => {
    (0, loader_1.getStationInfo)(req.body.stationId, req.body.category).then((stationInfo) => {
        res.json(stationInfo);
    });
});
// user info routes
app.get("/api/user", (req, res) => {
    (0, loader_1.getUserInfo)("00000001").then((userInfo) => {
        res.json(userInfo);
    });
});
app.post("/api/user", (req, res) => {
    (0, loader_1.getUserInfo)(req.body.userId).then((userInfo) => {
        res.json(userInfo);
    });
});
// login using kakao code
app.get("/api/login", (req, res) => {
    res.send("Forbidden GET /login");
});
app.post("/api/login", (req, res) => {
    const { code } = req.body;
    console.log(`code: ${code}`);
    (0, login_1.getKakaoToken)(code).then((token) => {
        if (!token) {
            return res.status(400).send({ error: "There is no token." })
                .send({ message: "Access token is a required parameter." });
        }
        console.log(`Verifying Kakao token: ${token}`);
        (0, login_1.createFirebaseToken)(token)
            .then((firebaseToken) => {
            console.log(`Returning firebase token to user: ${firebaseToken}`);
            return res.send({ access_token: firebaseToken });
        });
        return;
    });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map