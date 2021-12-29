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
exports.getInfo = void 0;
const app_1 = require("@firebase/app");
const firestore_1 = require("@firebase/firestore");
const firestore_2 = require("@firebase/firestore");
const firebaseAdmin = __importStar(require("firebase-admin"));
// import haversine from "haversine";
const firebaseConfig = {
    apiKey: "AIzaSyBTuC8MUuBtZtCnP9YJh8BgRuUJMS687Jw",
    authDomain: "dough-survey.web.app",
    databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dough-survey",
    storageBucket: "dough-survey.appspot.com",
    messagingSenderId: "111678578513",
    appId: "1:111678578513:web:32f35f3eb65cfb2f19bd70",
    measurementId: "G-VS98EGYRJL",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
// const analytics = getAnalytics(app);
const db = (0, firestore_1.getFirestore)();
/**
 * getUserId
 *
 * @param  {string} userToken
 * @return {Promise<String>}
 */
async function getUserId(userToken) {
    try {
        if (userToken === "") {
            return "default";
        }
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(userToken);
        const uid = decodedToken.uid;
        return uid.toString();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * getInfo
 *
 * @param  {string} infotype
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getInfo(infotype, req) {
    try {
        if (infotype === "user") {
            return getUserInfo(req);
        }
        else if (infotype === "place") {
            return getPlaceInfo(req);
        }
        else if (infotype === "station") {
            return getStationInfo(req);
        }
        else if (infotype === "post") {
            return getPostInfo(req);
        }
        else {
            console.log("Not implemented types");
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getInfo = getInfo;
/**
 * getInfoBase
 *
 * @param  {string} infotype
 * @param  {string} Id
 * @return {Promise<any>}
 */
async function getInfoBase(infotype, Id) {
    try {
        if (infotype === "user" || infotype === "place" ||
            infotype === "station" || infotype === "post") {
            const docRef = (0, firestore_2.doc)(db, `${infotype}_db`, Id);
            const docSnap = await (0, firestore_2.getDoc)(docRef);
            if (docSnap.exists()) {
                console.log(`returning ${infotype} data: ${Id}`);
                return docSnap.data();
            }
            else {
                console.log(`No such document: ${Id}`);
            }
        }
        else {
            console.log("Not implemented types");
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * getUserInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getUserInfo(req) {
    try {
        const userId = await getUserId(req.body.userToken);
        return getInfoBase("user", userId);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * getStationInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getStationInfo(req) {
    try {
        const stationId = req.body.stationId;
        const userId = await getUserId(req.body.userToken);
        let category = req.body.category;
        const tags = req.body.tags;
        if (category === "음식점") {
            category = "0";
        }
        else if (category === "카페") {
            category = "1";
        }
        else if (category === "술집") {
            category = "2";
        }
        if (userId === "default") {
            return getInfoBase("station", `${stationId}_${category}`);
        }
        else {
            const userInfo = await getInfoBase("user", userId);
            return getInfoBase("station", `${stationId}_${category}`);
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * getPlaceInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getPlaceInfo(req) {
    try {
        const stationId = await req.body.stationId;
        const placeId = await req.body.placeId;
        const stationData = await getInfoBase("station", stationId);
        const placeData = await getInfoBase("place", placeId);
        const stationCoor = { lon: stationData.station_coor_x,
            lat: stationData.station_coor_y };
        const placeCoor = { lon: placeData.place_coor_x,
            lat: placeData.place_coor_y };
        const distance = haversineDistance(stationCoor, placeCoor);
        console.log(`getPlaceInfo: ${JSON.stringify(stationData)},
      ${JSON.stringify(placeData)}`);
        console.log(`distance: ${distance}`);
        return { placeData: placeData, distance: distance };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * getPostInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getPostInfo(req) {
    try {
        const postId = await req.body.postId;
        return getInfoBase("post", postId);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * haversineDistance
 *
 * @param  {coordinate} coords1
 * @param  {coordinate} coords2
 * @return {Promise<any>}
 */
function haversineDistance(coords1, coords2) {
    /**
      * deg to rad
      * @param  {number} x
      * @return {number}
      */
    function toRad(x) {
        return x * Math.PI / 180;
    }
    const R = 6371; // km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}
//# sourceMappingURL=loader.js.map