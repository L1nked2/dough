import React, { useEffect }from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { Cookies } from "react-cookie";
import { getAuth, signInWithCustomToken } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function Oauth() {
    const cookie = new Cookies();
    const getToken = async () => {
        let kakaoAuth = new URL(window.location.href);
        const code = kakaoAuth.searchParams.get('code');

        const token = await axios ({
            method: 'POST',
            url: 'https://dough-survey.web.app/api/login',
            headers: {
                "Content-Type": `application/json`
            },
            data: {code: code},
        }).then(function(res) {
            console.log(res);
            const auth = getAuth();
            signInWithCustomToken(auth, res.data.access_token)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
                cookie.set (
                    'accessToken',
                    res.data.access_token,
                    {
                        path: '/', 
                        maxAge: res.data.expires_in,
                        // httpOnly: true
                    }
                );
                window.location.replace("/survey");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })

        }).catch (function(err) {
            console.log(err);
        });
    };

    useEffect(() => {
        getToken();
    }, []);

    return (<div style={{height:"100vh", display:"flex", alignItems:"center"}}><ClipLoader/></div>);
}

export default Oauth;