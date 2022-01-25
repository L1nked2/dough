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
exports.updateFavorites = exports.submitSurvey = void 0;
/* eslint-disable camelcase */
const firebaseAdmin = __importStar(require("firebase-admin"));
const dataLoader_1 = require("./dataLoader");
const mathjs_1 = require("mathjs");
const data_1 = require("./data");
const db = firebaseAdmin.firestore();
const DIM_A = 3;
/**
 * submitSurvey
 * @param  {Request} req
 * @return {Promise<number>}
 */
async function submitSurvey(req) {
    const user_token = req.body.userToken;
    const user_survey_result = req.body.surveyResult;
    const user_id = await (0, dataLoader_1.getUserId)(user_token);
    const documentRef = db.doc(`user_db/${user_id}`);
    const user_cluster_a = await matching(user_survey_result);
    const docData = {
        user_cluster_a: user_cluster_a,
        user_survey_result: user_survey_result,
        user_survey_done: true,
        user_survey_last_timestamp: "",
    };
    const date = new Date();
    docData.user_survey_last_timestamp = date.toString();
    const res = await documentRef.set(docData, { merge: true });
    console.log(`submitSurvey: submitted at ${res.writeTime},
      cluster: ${user_cluster_a}`);
    return user_cluster_a;
}
exports.submitSurvey = submitSurvey;
/**
 * matching
 * @param  {number[]} surveyResult
 * @return {Promise<number>}
 */
async function matching(surveyResult) {
    let cluster_a = -1;
    const norm_survey_result = await normalizing(surveyResult);
    const user_cost = await calcCost(norm_survey_result);
    let lowest = 0;
    for (let i = 1; i < user_cost.length; i++) {
        if (user_cost[i] < user_cost[lowest])
            lowest = i;
    }
    cluster_a = lowest;
    return cluster_a;
}
/**
 * normalizing
 * @param  {number[]} surveyResult
 * @return {Promise<number[]>}
 */
async function normalizing(surveyResult) {
    const avg = surveyResult.reduce((sum, element) => sum + element) / surveyResult.length;
    return surveyResult.map((element) => element - avg);
}
/**
 * calcCost
 * @param  {number[]} surveyResult
 * @return {Promise<number[]>}
 */
async function calcCost(surveyResult) {
    const predicted_full_survey = (0, mathjs_1.multiply)(data_1.coeffs_a, (0, mathjs_1.transpose)([surveyResult]));
    const user_pos_full = (0, mathjs_1.transpose)((0, mathjs_1.multiply)(data_1.pca_a_inv_mat, predicted_full_survey)).flat();
    const user_pos = user_pos_full.slice(0, DIM_A);
    console.log(`calcCost: ${user_pos}`);
    const distance_to_centroid_arr = data_1.centroid_a.map((c_pos) => Number((0, mathjs_1.distance)(c_pos, user_pos)));
    const user_cost = await cost(distance_to_centroid_arr);
    return user_cost;
}
/**
 * cost
 * @param  {number[]} distance_to_centroid_arr
 * @return {Promise<number[]>}
 */
async function cost(distance_to_centroid_arr) {
    return distance_to_centroid_arr.map((element) => Number((0, mathjs_1.pow)(element, 2)));
}
/**
 * updateFavorites
 * @param  {Request} req axios request
 * @return {Promise<string>}
 */
async function updateFavorites(req) {
    const user_token = req.body.userToken;
    const action = req.body.action;
    const stationId = req.body.stationId;
    const placeId = req.body.placeId;
    const userId = await (0, dataLoader_1.getUserId)(user_token);
    const placeDocRef = db.doc(`place_db/${placeId}`);
    const stationDocRef = db.doc(`station_db/${stationId}`);
    const userDocRef = db.doc(`user_db/${userId}`);
    let res;
    if (action === "delete") {
        try {
            res = await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                let userData = userDoc.data();
                const placeDoc = await transaction.get(placeDocRef);
                const placeData = placeDoc.data();
                if (userDoc.exists) {
                    // check place exists and delete
                    const targetCategory = await convertCategory(placeData.place_category);
                    const result = await deleteFavoritesItem(userData, targetCategory, stationId, placeId);
                    userData = result;
                    transaction.set(userDocRef, userData, { merge: false });
                }
                else {
                    throw new Error("userDoc not exists");
                }
                return `successfully deleted: ${placeData.place_name}`;
            });
        }
        catch (e) {
            console.log("updateFavorites failed: ", e);
            return "failed";
        }
    }
    else if (action === "add") {
        try {
            res = await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                let userData = userDoc.data();
                const stationDoc = await transaction.get(stationDocRef);
                const stationData = stationDoc.data();
                const placeDoc = await transaction.get(placeDocRef);
                const placeData = placeDoc.data();
                if (userDoc.exists) {
                    // add place to user favorites on targetStationId
                    const targetCategory = await convertCategory(placeData.place_category);
                    const result = await addFavoritesItem(userData, targetCategory, stationId, stationData, placeId, placeData);
                    userData = result;
                    transaction.set(userDocRef, userData, { merge: true });
                }
                else {
                    throw new Error("userDoc not exists");
                }
                return placeData.place_name;
            });
        }
        catch (e) {
            console.log("updateFavorites failed: ", e);
            return "failed";
        }
    }
    else {
        throw new Error(`not implemented action:${action}`);
    }
    return res;
}
exports.updateFavorites = updateFavorites;
/**
 * findIndex
 * @param  {any[]} placeList placeList under stationObject
 * @param  {string} targetPlaceId target uuid of the place
 * @return {Promise<number>} number of index if exists, else -1
 */
async function findIndex(placeList, targetPlaceId) {
    let index = -1;
    for (let i = 0; i < placeList.length; i++) {
        if (placeList[i].place_uuid === targetPlaceId) {
            index = i;
            break;
        }
    }
    return index;
}
/**
 * isStationExists
 * @param  {any} categoryObject categoryObject under user_favorites
 * @param  {string} targetStationId target uuid of the station
 * @return {Promise<boolean>} true if exists, else false
 */
async function isStationExists(categoryObject, targetStationId) {
    return Object.prototype.hasOwnProperty.call(categoryObject, targetStationId);
}
/**
 * setStationThumbnails
 * @param  {any} stationObject  stationObject under category object
 * @return {Promise<boolean>} true if successful, else false
 */
async function setStationThumbnails(stationObject) {
    const placeList = stationObject.place_list;
    if (placeList.length > 0) {
        stationObject.station_thumbnail_inside =
            placeList[0].place_thumbnail_inside;
        stationObject.station_thumbnail_food =
            placeList[0].place_thumbnail_food;
    }
    else {
        throw new Error(`setStationThumbnail failed: ${stationObject.station_name}`);
    }
    return true;
}
/**
 * convertCategory
 * @param  {string} categoryString  targetCategoryString from place document
 * @return {Promise<string>} targetCategory
 */
async function convertCategory(categoryString) {
    let category = "";
    if (categoryString === "음식점") {
        category = "rest";
    }
    else if (categoryString === "카페") {
        category = "cafe";
    }
    else if (categoryString === "술집") {
        category = "bar";
    }
    else if (categoryString === "") {
        category = "all";
    }
    else {
        throw new Error(`convertCategory failed: ${categoryString}`);
    }
    return category;
}
/**
 * deleteFavoritesItem
 * @param  {FirebaseFirestore.DocumentData} userObject user object derived from user document
 * @param  {string} targetCategory category of target place
 * @param  {string} targetStationId uuid of target station
 * @param  {string} targetPlaceId uuid of target place
 * @return {Promise<FirebaseFirestore.DocumentData>} modified(item removed) userFavoriteObject
 */
async function deleteFavoritesItem(userObject, targetCategory, targetStationId, targetPlaceId) {
    const categoryObject = userObject.user_favorites[targetCategory];
    // check if station exists
    if (await isStationExists(categoryObject, targetStationId)) {
        const placeList = categoryObject[targetStationId].place_list;
        const index = await findIndex(placeList, targetPlaceId);
        // check if place exists in place_list of target station
        if (index != -1) {
            // remove place from place_list of targetStation
            placeList.splice(index, 1);
            if (placeList.length == 0) {
                // if station is empty, remove station
                Reflect.deleteProperty(categoryObject, targetStationId);
            }
            else {
                // if station is not empty, update thumbnails
                setStationThumbnails(categoryObject[targetStationId]);
            }
        }
        else {
            throw new Error(`${targetPlaceId} does not exist in place_list of ${targetStationId}`);
        }
    }
    else {
        throw new Error(`${targetStationId} does not exist in ${targetCategory}`);
    }
    return userObject;
}
/**
 * addFavoritesItem
 * @param  {FirebaseFirestore.DocumentData} userObject
 * @param  {string} targetCategory
 * @param  {string} targetStationId
 * @param  {FirebaseFirestore.DocumentData} stationDataObject
 * @param  {string} targetPlaceId
 * @param  {FirebaseFirestore.DocumentData} placeDataObject
 * @return {Promise<FirebaseFirestore.DocumentData>}
 */
async function addFavoritesItem(userObject, targetCategory, targetStationId, stationDataObject, targetPlaceId, placeDataObject) {
    const categoryObject = userObject.user_favorites[targetCategory];
    const stationName = stationDataObject.station_name;
    console.log(`addFavoritesItem: ${JSON.stringify(userObject.user_favorites)}`);
    // check if station exists. if not, add station to category
    if (!await isStationExists(categoryObject, targetStationId)) {
        console.log(`station not exists: ${stationDataObject.station_name}`);
        categoryObject[targetStationId] = {};
        categoryObject[targetStationId].station_name = stationName;
        categoryObject[targetStationId].place_list = [];
    }
    console.log(`addFavoritesItem: station added, ${JSON.stringify(categoryObject)}`);
    const placeList = categoryObject[targetStationId].place_list;
    const index = await findIndex(placeList, targetPlaceId);
    const placeListItem = {
        place_uuid: placeDataObject.place_uuid,
        place_name: placeDataObject.place_name,
        place_thumbnail_inside: placeDataObject.place_main_photo_list[0],
        place_thumbnail_food: placeDataObject.place_main_photo_list[1],
    };
    // check if place exists in place_list of target station
    if (index == -1) {
        // add place from place_list of targetStation
        categoryObject[targetStationId].place_list.push(placeListItem);
    }
    else {
        throw new Error(`${targetPlaceId} already exist in place_list of ${targetStationId}`);
    }
    // update the thumbnail of the station
    setStationThumbnails(categoryObject[targetStationId]);
    return userObject;
}
//# sourceMappingURL=userPreference.js.map