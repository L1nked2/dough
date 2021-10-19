// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseAdmin } from "firebase-admin";
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
const requestMeUrl = 'https://kapi.kakao.com/v2/user/me?secure_resource=true';
//const analytics = getAnalytics(fireBaseApp);



import express from "express";
const router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login.ejs');
  });

export default router;