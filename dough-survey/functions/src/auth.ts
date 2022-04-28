/* eslint-disable camelcase */
import * as firebaseAdmin from "firebase-admin";
import axios from "axios";
import qs = require("qs");
import {Request} from "express";
import {getUserId} from "./dataLoader";
// Initialize FirebaseApp with service-account.json
// SET GOOGLE_APPLICATION_CREDENTIALS=
// "C:\Users\K\Desktop\dough\dough-survey\service-account.json"

const auth = firebaseAdmin.auth();
const db = firebaseAdmin.firestore();

// Initialize kakao api server uri
const requestMeUrl = "https://kapi.kakao.com/v2/user/me?secure_resource=true";
const kakaoTokenUrl = "https://kauth.kakao.com/oauth/token";
const REST_API_KEY = "c6d8dd20d5ff2084f591d8b34cbe2608";
// const REDIRECT_URI = "https://babyak.kr/login/callback/kakao";
const REDIRECT_URI = "https://dough-survey.web.app/login/callback/kakao";
// const REDIRECT_URI = "http://localhost:3000/login/callback/kakao";
const CLIENT_SECRET = "KjRkQKwcrPVGDx82f3craYzhDzdH4S8H";

/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {string} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>}      User profile response in a promise
 */
function requestMe(kakaoAccessToken: string) {
  console.log("Requesting user profile from Kakao API server.");
  return axios({
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      "Authorization": "Bearer " + kakaoAccessToken,
    },
    url: requestMeUrl,
  });
}

/**
 * createUserDoc
 *
 * @param {string} user_id
 * @param {string} gender
 * @param {string} age_range
 * @return {promise<boolean>}
 */
async function createUserDoc(
    user_id: string, gender: string, age_range: string): Promise<boolean> {
  console.log(`Creating user doc, id: ${user_id}`);
  try {
    const docData = {
      user_cluster_a: -1,
      user_cluster_b: -1,
      user_like_list: [],
      user_last_tags: [],
      user_gender: "",
      user_age_range: "",
      user_survey_result: [],
      user_survey_done: false,
      user_survey_last_timestamp: "",
      user_favorites: {
        rest: {},
        cafe: {},
        bar: {},
      },
      user_sign_in_timestamp: "",
    };
    docData.user_gender = gender;
    docData.user_age_range = age_range;
    const date = new Date();
    docData.user_sign_in_timestamp = date.toString();
    const documentRef = db.doc(`user_db/${user_id}`);
    documentRef.set(docData);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param {string} user_id       user id per app
 * @param {string} email         user's email address
 * @param {string} displayName   user
 * @param {string} photoURL      profile photo url
 * @param {string} gender
 * @param {string} age_range
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
function updateOrCreateUser(
    user_id: string, email: string, displayName: string, photoURL: string,
    gender: string, age_range: string) {
  const updateParams: any = {
    provider: "KAKAO",
    displayName: displayName,
    photoURL: null,
  };
  if (displayName) {
    updateParams["displayName"] = displayName;
  } else {
    updateParams["displayName"] = email;
  }

  if (photoURL) {
    updateParams["photoURL"] = photoURL;
  }
  return firebaseAdmin.auth().updateUser(user_id, updateParams)
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          console.log(`creating a firebase user: ${user_id}`);
          updateParams["uid"] = user_id;
          if (email) {
            updateParams["email"] = email;
          }
          createUserDoc(user_id, gender, age_range);
          return firebaseAdmin.auth().createUser(updateParams);
        }
        throw error;
      });
}

/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {string} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<String>}                  Firebase token in a promise
 */
function createFirebaseToken(kakaoAccessToken: string) {
  return requestMe(kakaoAccessToken).then((response: any) => {
    console.log(`Kakao token Verified: ${kakaoAccessToken}`);
    const kakaoMe = response.data;
    const kakaoId = `kakao:${kakaoMe.id}`;
    console.log(`Kakao Me: ${JSON.stringify(kakaoMe)}`);
    const kakaoAccount = kakaoMe.kakao_account;
    const kakaoGender = kakaoMe.gender;
    const kakaoAge = kakaoMe.age_range;
    if (!kakaoId) {
      return response.send(
          {message: "There was no user with the given access token."});
    }
    let nickname = null;
    let profileImage = null;
    let email = null;
    let age_range = "0";
    let gender = "none";
    if (kakaoAccount) {
      nickname = kakaoAccount.profile.nickname;
      profileImage = kakaoAccount.profile.profile_image_url;
      email = kakaoAccount.email;
    }
    if (kakaoGender) {
      gender = kakaoGender;
    }
    if (kakaoAge) {
      age_range = kakaoAge;
    }
    return updateOrCreateUser(
        kakaoId, email, nickname, profileImage, gender, age_range);
  }).then((userRecord) => {
    const userId = userRecord.uid;
    console.log(`creating a custom firebase token based on uid ${userId}`);
    return firebaseAdmin.auth().createCustomToken(userId, {provider: "kakao"});
  });
}

/**
 * getKakaoToken - returns kakao token using given kakao code
 *
 * @param  {string} kakaoCode authorization code from Kakao Login API
 * @return {Promise<String>}          kakao token in a promise
 */
async function getKakaoToken(kakaoCode: string) {
  console.log(`Requesting token from Kakao API server, code: ${kakaoCode}`);
  const payload = qs.stringify({
    grant_type: "authorization_code",
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    code: kakaoCode,
    client_secret: CLIENT_SECRET,
  });
  const res: any = await axios({
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    url: kakaoTokenUrl,
    data: payload,
  });
  const token = res.data.access_token;
  return token;
}

/**
 * kakaologin
 *
 * @param  {Request} req
 * @return {Promise<String>}
 */
async function kakaoLogin(req: Request) {
  const code = req.body.code;
  const kakaoToken = await getKakaoToken(code);
  const firebaseToken = await createFirebaseToken(kakaoToken);
  console.log(`Returning firebase token to user: ${firebaseToken}`);
  return firebaseToken;
}

/**
 * deleteUser
 * @param  {Request} req axios request
 * @return {Promise<string>} uuid of deleted user, failed if user is not found
 */
async function deleteUser(req: Request): Promise<string> {
  const userId = await getUserId(req.body.userToken);
  const userDocRef = db.doc(`user_db/${userId}`);
  try {
    // clean up user document
    await userDocRef.delete();
    // delete user account from firebase/auth
    await auth.deleteUser(userId);
  } catch (e) {
    console.log(`Error deleting user: ${e}`);
    return "failed";
  }
  return userId;
}

export {kakaoLogin, deleteUser};
