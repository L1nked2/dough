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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const express = require("express");
const login_1 = require("./login");
const loader_1 = require("./loader");
const cors_1 = __importDefault(require("cors"));
const app = express();
app.use((0, cors_1.default)());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// login using kakao code
app.get("/api/login", (req, res) => {
    res.send("Forbidden GET /login");
});
app.post("/api/login", (req, res) => {
    (0, login_1.kakaoLogin)(req).then((token) => {
        res.send({ access_token: token });
    });
});
// getInfo routes, provide test data
app.get("/api/:infoType", (req, res) => {
    const type = req.params.infoType;
    if (type === "place") {
        req.body.stationId = "2a2fb6a8-e995-515c-a24b-849030c8d8ea";
        req.body.placeId = "002b7a00-95a7-52a1-8e81-6338fea1d6c2";
    }
    else if (type === "station") {
        req.body.stationId = "2a2fb6a8-e995-515c-a24b-849030c8d8ea";
        req.body.userToken = "";
        req.body.category = "";
        req.body.tags = [""];
    }
    else if (type === "user") {
        req.body.userToken = "";
    }
    else if (type === "post") {
        req.body.postId = "00000001";
    }
    (0, loader_1.getInfo)(type, req).then((info) => {
        res.json(info);
    });
});
app.post("/api/:infoType", (req, res) => {
    const type = req.params.infoType;
    (0, loader_1.getInfo)(type, req).then((info) => {
        res.json(info);
    });
});
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map