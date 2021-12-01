// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import firebaseAdmin from "firebase-admin";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTuC8MUuBtZtCnP9YJh8BgRuUJMS687Jw",
  authDomain: "dough-survey.firebaseapp.com",
  projectId: "dough-survey",
  storageBucket: "dough-survey.appspot.com",
  messagingSenderId: "111678578513",
  appId: "1:111678578513:web:32f35f3eb65cfb2f19bd70",
  databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app/",
  measurementId: "G-VS98EGYRJL"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const database = getDatabase(fireBaseApp);
//const analytics = getAnalytics(fireBaseApp);

import { readFile } from 'fs/promises';
import * as path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)
var accountPath = path.join(__dirname, '..', 'service-account.json');
let serviceAccount = JSON.parse(await readFile(accountPath, "utf8"));

// Initialize FirebaseApp with service-account.json
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Initialize kakao api server uri
const requestMeUrl = 'https://kapi.kakao.com/v2/user/me?secure_resource=true';
const tokenUrl = 'https://kauth.kakao.com/oauth/token';
/**
 * requestMe - Returns user profile from Kakao API
 *
 * @param  {String} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>}      User profile response in a promise
 */
function requestMe(kakaoAccessToken) {
    console.log('Requesting user profile from Kakao API server.');
    return axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Authorization': 'Bearer ' + kakaoAccessToken,
        },
        url: requestMeUrl,
    });
};
  
  
/**
 * updateOrCreateUser - Update Firebase user with the give email, create if
 * none exists.
 *
 * @param  {String} userId        user id per app
 * @param  {String} email         user's email address
 * @param  {String} displayName   user
 * @param  {String} photoURL      profile photo url
 * @return {Prommise<UserRecord>} Firebase user record in a promise
 */
function updateOrCreateUser(userId, email, displayName, photoURL) {
    console.log('updating or creating a firebase user');
    let updateParams = {
        provider: 'KAKAO',
        displayName: displayName,
    };
    if (displayName) {
        updateParams['displayName'] = displayName;
    } else {
        updateParams['displayName'] = email;
    }
    if (photoURL) {
        updateParams['photoURL'] = photoURL;
    }
    console.log(updateParams);
    return firebaseAdmin.auth().updateUser(userId, updateParams)
    .catch((error) => {
        if (error.code === 'auth/user-not-found') {
        updateParams['uid'] = userId;
        if (email) {
            updateParams['email'] = email;
        }
        return firebaseAdmin.auth().createUser(updateParams);
        }
        throw error;
    });
};


/**
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK
 *
 * @param  {String} kakaoAccessToken access token from Kakao Login API
 * @return {Promise<String>}                  Firebase token in a promise
 */
function createFirebaseToken(kakaoAccessToken) {
    return requestMe(kakaoAccessToken).then((response) => {
        const kakaoID = `kakao:${response.data.id}`;
        const kakaoPr = response.data.properties;
        const kakaoAc = response.data.kakao_account
        if (!kakaoID) {
            return res.status(404)
            .send({message: 'There was no user with the given access token.'});
        }
        let nickname = null;
        let profileImage = null;
        let email = null;
        if (kakaoPr) {
            nickname = kakaoPr.nickname;
            profileImage = kakaoPr.profile_image;
        }
        if (kakaoAc) {
            email = kakaoAc.email;
        }
        return updateOrCreateUser(kakaoID, email, nickname, profileImage);
    }).then((userRecord) => {
        const userId = userRecord.uid;
        console.log(`creating a custom firebase token based on uid ${userId}`);
        return firebaseAdmin.auth().createCustomToken(userId, {provider: 'KAKAO'});
    });
};
  
import express from "express";
import axios from "axios";
import QueryString from "qs";
const router = express.Router();
const rootPage = 'http://localhost:3000'///

const kakao = {
    clientID: 'c6d8dd20d5ff2084f591d8b34cbe2608',
    redirectUri: rootPage + '/login/callback/kakao',
    clientSecret: '8V39m6DgdkKg50skEcqFoDPwH0RULokQ'
}

/* GET login page. */
/*
router.get('/', function(req, res) {
    if(req.query.auth) {
        res.render('login.ejs');
    }
    else {
        res.render('login_kakao.ejs');
    }
});

router.get('/callback/kakao', async(req, res) => {
    try {
    token = await axios({
        method: 'POST',
        url: tokenUrl, 
        headers: {
            "Content-Type": `application/x-www-form-urlencoded;charset=utf-8`,
        },
        data:QueryString.stringify({
            'grant_type':'authorization_code',
            'client_id':kakao.clientID,
            'redirect_uri':kakao.redirectUri, 
            'code':req.query.code,
            'client_secret':kakao.clientSecret,
            }),
        }).then(function(response) {
            createFirebaseToken(response.data.access_token).then((firebaseToken) => {
                console.log(`Returning firebase token to user: ${firebaseToken}`);
                console.log(rootPage+QueryString.stringify({'auth':firebaseToken}));
                res.redirect(rootPage+'/login?'+QueryString.stringify({'auth':firebaseToken}));
            });
        })
    } catch(error) {
        if (error.response) {
            // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        else if (error.request) {
            // 요청이 이루어 졌으나 응답을 받지 못했습니다.
            // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
            // Node.js의 http.ClientRequest 인스턴스입니다.
            console.log(error.request);
        }
        else {
            // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
            console.log('Error', error.message);
        }
        console.log(error.config);
    }

    
});
*/

// actual endpoint that creates a firebase token with Kakao access token
router.post('/', (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(400).send({error: 'There is no token.'})
    .send({message: 'Access token is a required parameter.'});
    console.log(`Verifying Kakao token: ${token}`);
    
    createFirebaseToken(token).then((firebaseToken) => {
        console.log(`Returning firebase token to user: ${firebaseToken}`);
        res.send({firebase_token: firebaseToken});
    });
});

export default router;