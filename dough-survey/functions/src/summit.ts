/* eslint-disable camelcase */
import * as firebaseAdmin from "firebase-admin";
// import axios from "axios";
import {Request} from "express";
import {getUserId} from "./loader";

const db = firebaseAdmin.firestore();

/**
 * summitSurvey
 * need to add the matching process
 * @param  {Request} req
 * @return {Promise<FirebaseFirestore.Timestamp>}
 */
async function summitSurvey(
    req: Request): Promise<FirebaseFirestore.Timestamp> {
  const user_token = req.body.userToken;
  const user_survey_result = req.body.surveyResult;
  const user_id = await getUserId(user_token);
  const documentRef = db.doc(`user_db/${user_id}`);
  const docData = {
    user_survey_result: user_survey_result,
    user_survey_done: true,
    user_survey_last_timestamp: "",
  };
  const date = new Date();
  docData.user_survey_last_timestamp = date.toString();
  const res = await documentRef.set(docData, {merge: true});
  console.log(`summitSurvey: summitted at ${res.writeTime}`);
  return res.writeTime;
}


export {summitSurvey};
