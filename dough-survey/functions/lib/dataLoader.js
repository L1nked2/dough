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
exports.getInfoBase = exports.getUserId = exports.getInfo = void 0;
/* eslint-disable camelcase */
const firebaseAdmin = __importStar(require("firebase-admin"));
const userPreference_1 = require("./userPreference");
const data_1 = require("./data");
const db = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();
const ELEMENT_PER_PAGE = 30;
const CLUSTER_NUM = 8;
/**
 * getUserId
 *
 * @param  {string} userToken
 * @return {Promise<string>}
 */
async function getUserId(userToken) {
    try {
        if (userToken === undefined) {
            return "";
        }
        else if (userToken === "") {
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
exports.getUserId = getUserId;
/**
 * getInfo
 *
 * @param  {string} infotype info type, user | place | station | post
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
 * @param  {string} infotype info type, user | place | station | post
 * @param  {string} id uuid of target document
 * @return {Promise<any>} object contaning data of document
 */
async function getInfoBase(infotype, id) {
    try {
        if (infotype === "user" || infotype === "place" ||
            infotype === "station" || infotype === "post") {
            const docRef = db.collection(`${infotype}_db`).doc(id);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                console.log(`getInfoBase: ${infotype}, ${id}`);
                return docSnap.data();
            }
            else {
                console.log(`No such document: ${infotype}, ${id}`);
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
exports.getInfoBase = getInfoBase;
/**
 * getUserInfo
 *
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getUserInfo(req) {
    try {
        const userId = await getUserId(req.body.userToken);
        const userProfile = await auth.getUser(userId);
        const userInfo = await getInfoBase("user", userId);
        userInfo.user_name = userProfile.displayName;
        userInfo.user_photo_url = userProfile.photoURL;
        console.log(`getUserInfo: ${userId}`);
        return { userInfo: userInfo };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * getStationInfo
 * recommendation need to be added
 * distance need to be added
 * @param  {Request} req
 * @return {Promise<any>}
 */
async function getStationInfo(req) {
    try {
        const stationId = req.body.stationId;
        const userId = await getUserId(req.body.userToken);
        let category = req.body.category;
        const tags = req.body.tags;
        const page = req.body.page;
        const doBlockShuffle = true;
        if (category === "음식점") {
            category = "rest";
        }
        else if (category === "카페") {
            category = "cafe";
        }
        else if (category === "술집") {
            category = "bar";
        }
        else {
            throw new Error("Invalid category");
        }
        console.log(`getStationInfo: ${stationId}`);
        const userInfo = await getInfoBase("user", userId);
        const clusterA = userInfo.user_cluster_a;
        const stationTotalInfo = await getInfoBase("station", `${stationId}_${category}_0`);
        for (let i = 1; i < 6; i++) {
            const stationPageInfo = await getInfoBase("station", `${stationId}_${category}_${i}`);
            stationTotalInfo.place_list.concat(stationPageInfo.place_list);
        }
        stationTotalInfo.place_list = await filterByTag(stationTotalInfo.place_list, tags);
        stationTotalInfo.place_list = await sortByPriority(stationTotalInfo.place_list, clusterA, doBlockShuffle);
        stationTotalInfo.place_list = stationTotalInfo.place_list.slice(page * ELEMENT_PER_PAGE, (page + 1) * ELEMENT_PER_PAGE);
        return { stationInfo: stationTotalInfo };
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
        const userToken = req.body.userToken;
        const userId = await getUserId(userToken);
        const stationId = req.body.stationId;
        const placeId = req.body.placeId;
        const stationData = await getInfoBase("station", `${stationId}_rest_0`);
        const placeInfo = await getInfoBase("place", placeId);
        const stationCoor = { lon: stationData.station_coor_x,
            lat: stationData.station_coor_y };
        const placeCoor = { lon: placeInfo.place_coor_x,
            lat: placeInfo.place_coor_y };
        const distance = haversineDistance(stationCoor, placeCoor);
        console.log(`getPlaceInfo: ${placeId}`);
        if (userId !== "") {
            (0, userPreference_1.updateRecent)(userId, placeId, stationId);
        }
        return { placeInfo: placeInfo, distance: distance };
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
        const postInfo = await getInfoBase("post", postId);
        console.log(`getPostInfo: ${postId}`);
        return { postInfo: postInfo };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * filterByTag
 *
 * @param  {any[]} placeList
 * @param  {string} tags
 * @return {Promise<any>}
 */
async function filterByTag(placeList, tags) {
    try {
        let result;
        if (tags.length === 0) {
            result = placeList;
        }
        else {
            result = placeList.filter((element) => tags.some((eachTag) => element.place_kind.includes(eachTag)));
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * sortByPriority
 *
 * @param  {any[]} placeList
 * @param  {number} clusterA
 * @param  {boolean} shuffleBlock
 * @return {Promise<any>}
 */
async function sortByPriority(placeList, clusterA, shuffleBlock = true) {
    try {
        const clusterBlock = [];
        const currentPriority = data_1.priority_cluster_a[clusterA];
        // build block using priority array
        for (let i = 0; i < CLUSTER_NUM; i++) {
            clusterBlock[i] = placeList.filter((element) => (element.place_cluster_a === currentPriority[i]));
        }
        // concat places that cluster_a is not initialized
        clusterBlock[CLUSTER_NUM] = placeList.filter((element) => (element.place_cluster_a === null));
        if (shuffleBlock === true) {
            for (let i = 0; i < clusterBlock.length; i++) {
                for (let j = clusterBlock[i].length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [clusterBlock[i][j], clusterBlock[i][k]] =
                        [clusterBlock[i][k], clusterBlock[i][j]];
                }
            }
        }
        const result = clusterBlock.flat();
        return result;
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
//# sourceMappingURL=dataLoader.js.map