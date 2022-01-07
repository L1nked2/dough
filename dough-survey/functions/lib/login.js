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
exports.kakaoLogin = void 0;
/* eslint-disable camelcase */
const app_1 = require("@firebase/app");
const firebaseAdmin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const qs = require("qs");
// Initialize FirebaseApp with service-account.json
// SET GOOGLE_APPLICATION_CREDENTIALS=
// "C:\Users\K\Desktop\dough\dough-survey\service-account.json"
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// // Initialize Firebase
firebaseAdmin.initializeApp(firebaseConfig);
(0, app_1.initializeApp)(firebaseConfig);
// const analytics = getAnalytics(app);
const db = firebaseAdmin.firestore();
// Initialize kakao api server uri
const requestMeUrl = "https://kapi.kakao.com/v2/user/me?secure_resource=true";
const kakaoTokenUrl = "https://kauth.kakao.com/oauth/token";
const REST_API_KEY = "c6d8dd20d5ff2084f591d8b34cbe2608";
const REDIRECT_URI = "https://dough-survey.web.app/login/callback/kakao";
// const REDIRECT_URI = "http://localhost:3000/login/callback/kakao";
const CLIENT_SECRET = "KjRkQKwcrPVGDx82f3craYzhDzdH4S8H";
/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {string} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>}      User profile response in a promise
 */
function requestMe(kakaoAccessToken) {
    console.log("Requesting user profile from Kakao API server.");
    return (0, axios_1.default)({
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
 * @param {string} userId
 * @param {string} gender
 * @param {string} age_range
 * @return {promise<boolean>}
 */
async function createUserDoc(userId, gender, age_range) {
    console.log(`Creating user doc, id: ${userId}`);
    try {
        const docData = {
            user_cluster_a: -1,
            user_cluster_b: -1,
            user_like_list: [],
            user_last_tags: [],
            user_gender: "",
            user_age_range: "",
        };
        docData.user_gender = gender;
        docData.user_age_range = age_range;
        const documentRef = db.doc(`user_db/${userId}`);
        documentRef.set(docData);
        return true;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param {string} userId        user id per app
 * @param {string} email         user's email address
 * @param {string} displayName   user
 * @param {string} photoURL      profile photo url
 * @param {string} gender
 * @param {string} age_range
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
function updateOrCreateUser(userId, email, displayName, photoURL, gender, age_range) {
    const updateParams = {
        provider: "KAKAO",
        displayName: displayName,
        photoURL: null,
    };
    if (displayName) {
        updateParams["displayName"] = displayName;
    }
    else {
        updateParams["displayName"] = email;
    }
    if (photoURL) {
        updateParams["photoURL"] = photoURL;
    }
    return firebaseAdmin.auth().updateUser(userId, updateParams)
        .catch((error) => {
        if (error.code === "auth/user-not-found") {
            console.log(`creating a firebase user: ${userId}`);
            updateParams["uid"] = userId;
            if (email) {
                updateParams["email"] = email;
            }
            createUserDoc(userId, gender, age_range);
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
function createFirebaseToken(kakaoAccessToken) {
    return requestMe(kakaoAccessToken).then((response) => {
        console.log(`Kakao token Verified: ${kakaoAccessToken}`);
        const kakaoMe = response.data;
        const kakaoId = `kakao:${kakaoMe.id}`;
        const kakaoAccount = kakaoMe.kakao_account;
        const kakaoGender = kakaoMe.gender;
        const kakaoAge = kakaoMe.age_range;
        if (!kakaoId) {
            return response.send({ message: "There was no user with the given access token." });
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
        return updateOrCreateUser(kakaoId, email, nickname, profileImage, gender, age_range);
    }).then((userRecord) => {
        const userId = userRecord.uid;
        console.log(`creating a custom firebase token based on uid ${userId}`);
        return firebaseAdmin.auth().createCustomToken(userId, { provider: "kakao" });
    });
}
/**
 * getKakaoToken - returns kakao token using given kakao code
 *
 * @param  {string} kakaoCode authorization code from Kakao Login API
 * @return {Promise<String>}          kakao token in a promise
 */
async function getKakaoToken(kakaoCode) {
    console.log(`Requesting token from Kakao API server, code: ${kakaoCode}`);
    const payload = qs.stringify({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: kakaoCode,
        client_secret: CLIENT_SECRET,
    });
    const res = await (0, axios_1.default)({
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
async function kakaoLogin(req) {
    const code = req.body.code;
    const kakaoToken = await getKakaoToken(code);
    const firebaseToken = await createFirebaseToken(kakaoToken);
    console.log(`Returning firebase token to user: ${firebaseToken}`);
    return firebaseToken;
}
exports.kakaoLogin = kakaoLogin;
//# sourceMappingURL=login.js.map