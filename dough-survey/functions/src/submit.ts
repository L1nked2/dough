/* eslint-disable camelcase */
import * as firebaseAdmin from "firebase-admin";
// import axios from "axios";
import {Request} from "express";
import {getUserId} from "./loader";
import {transpose, multiply, distance} from "mathjs";
import {coeffs_a, pca_a_inv_mat, centroid_a} from "./data";

const db = firebaseAdmin.firestore();
const DIM_A = 3;

/**
 * submitSurvey
 * @param  {Request} req
 * @return {Promise<FirebaseFirestore.Timestamp>}
 */
async function submitSurvey(
    req: Request): Promise<FirebaseFirestore.Timestamp> {
  const user_token = req.body.userToken;
  const user_survey_result = req.body.surveyResult;
  const user_id = await getUserId(user_token);
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
  const res = await documentRef.set(docData, {merge: true});
  console.log(
      `submitSurvey: submitted at ${res.writeTime},
      cluster: ${user_cluster_a}`);
  return res.writeTime;
}

/**
 * matching
 * @param  {number[]} surveyResult
 * @return {Promise<number>}
 */
async function matching(surveyResult: number[]): Promise<number> {
  let cluster_a = -1;
  const norm_survey_result = await normalizing(surveyResult);
  const user_cost = await calcCost(norm_survey_result);
  let lowest = 0;
  for (let i = 1; i < user_cost.length; i++) {
    if (user_cost[i] < user_cost[lowest]) lowest = i;
  }
  cluster_a = lowest;
  return cluster_a;
}

/**
 * normalizing
 * @param  {number[]} surveyResult
 * @return {Promise<number[]>}
 */
async function normalizing(surveyResult: number[]): Promise<number[]> {
  const avg = surveyResult.reduce(
      (sum, element) => sum + element) / surveyResult.length;
  return surveyResult.map((element) => element - avg);
}

/**
 * calcCost
 * @param  {number[]} surveyResult
 * @return {Promise<number[]>}
 */
async function calcCost(surveyResult: number[]): Promise<number[]> {
  const predicted_full_survey = multiply(coeffs_a, transpose([surveyResult]));
  const user_pos_full = transpose(
      multiply(pca_a_inv_mat, predicted_full_survey)).flat();
  const user_pos = user_pos_full.slice(0, DIM_A);
  console.log(`calcCost: ${user_pos}`);
  const distance_to_centroid_arr =
    centroid_a.map((c_pos) => Number(distance(c_pos, user_pos)));
  const user_cost = await cost(distance_to_centroid_arr);
  return user_cost;
}

/**
 * cost
 * @param  {number[]} distance_to_centroid_arr
 * @return {Promise<number[]>}
 */
async function cost(distance_to_centroid_arr: number[]): Promise<number[]> {
  return distance_to_centroid_arr;
}

export {submitSurvey};
