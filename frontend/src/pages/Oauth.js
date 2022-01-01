import React, { useEffect }from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { Cookies } from "react-cookie";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import { firebaseInit } from "../firebaseInit";
firebaseInit();

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