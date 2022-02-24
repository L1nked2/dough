import * as firebase from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from 'firebase/auth';
import { initializeUserInfo } from './actions/userInfo';
import { Cookies } from "react-cookie";

const firebaseConfig = {
    apiKey: "AIzaSyBTuC8MUuBtZtCnP9YJh8BgRuUJMS687Jw",
    authDomain: "dough-survey.web.app",
    databaseURL: "https://dough-survey-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dough-survey",
    storageBucket: "dough-survey.appspot.com",
    messagingSenderId: "111678578513",
    appId: "1:111678578513:web:32f35f3eb65cfb2f19bd70",
    measurementId: "G-VS98EGYRJL"
  };

export function firebaseInit() {
    const app = firebase.initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
};

export function getFirebaseAuth(func = null, noUserFunc = null) {
  getAuth().onAuthStateChanged(function(user){
    if (user) {
      user.getIdToken(true).then(func).catch(function(error) {
        console.log(error);
      });
      return true;
    }
    else { 
      noUserFunc();
      return false; 
    }
  })
}

export function logout() { 
  const auth = getAuth();
  const cookie = new Cookies();
  signOut(auth).then(()=>{
    console.log("logout successful");
    cookie.remove('accessToken');
    initializeUserInfo();
  }).catch((err)=>{
    console.log(err);
  })
}

export function authIsLogin() {
  getAuth().onAuthStateChanged(function(user){
    if (user) { return true; }
    else { return false; }
  })
}