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
exports.summitSurvey = void 0;
/* eslint-disable camelcase */
const firebaseAdmin = __importStar(require("firebase-admin"));
const loader_1 = require("./loader");
const db = firebaseAdmin.firestore();
/**
 * summitSurvey
 *
 * @param  {Request} req
 * @return {Promise<FirebaseFirestore.Timestamp>}
 */
async function summitSurvey(req) {
    const user_token = req.body.userToken;
    const user_survey_result = req.body.surveyResult;
    const user_id = await (0, loader_1.getUserId)(user_token);
    const documentRef = db.doc(`user_db/${user_id}`);
    const docData = {
        user_survey_result: user_survey_result,
        user_survey_done: true,
        user_survey_last_timestamp: "",
    };
    const date = new Date();
    docData.user_survey_last_timestamp = date.toString();
    const res = await documentRef.set(docData, { merge: true });
    console.log(`summitSurvey: summitted at ${res.writeTime}`);
    return res.writeTime;
}
exports.summitSurvey = summitSurvey;
//# sourceMappingURL=summit.js.map