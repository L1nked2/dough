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
exports.submitSurvey = void 0;
/* eslint-disable camelcase */
const firebaseAdmin = __importStar(require("firebase-admin"));
const loader_1 = require("./loader");
const mathjs_1 = require("mathjs");
const data_1 = require("./data");
const db = firebaseAdmin.firestore();
const DIM_A = 3;
/**
 * submitSurvey
 * @param  {Request} req
 * @return {Promise<FirebaseFirestore.Timestamp>}
 */
async function submitSurvey(req) {
    const user_token = req.body.userToken;
    const user_survey_result = req.body.surveyResult;
    const user_id = await (0, loader_1.getUserId)(user_token);
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
    return res.writeTime;
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
    return distance_to_centroid_arr;
}
//# sourceMappingURL=submit.js.map