import React, { useEffect }from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import keyData from "../service-account";
import { Cookies } from "react-cookie";
import qs from "qs"

const REST_API_KEY = 'c6d8dd20d5ff2084f591d8b34cbe2608';
const KAKAO_JS_KEY = '423e288ffa4a8548ec18cd9fc2865e4e';
const REDIRECT_URI = 'https://dough-survey.web.app/login/callback/kakao';
// const REDIRECT_URI = 'http://localhost:3000/login/callback/kakao';
const CLIENT_SECRET = 'KjRkQKwcrPVGDx82f3craYzhDzdH4S8H';


function Oauth() {
    const cookie = new Cookies();
    const getToken = async () => {
        let kakaoAuth = new URL(window.location.href);
        const code = kakaoAuth.searchParams.get('code');

        const token = await axios ({
            method: 'POST',
            url: 'https://dough-survey.web.app/api/login',
            headers: {
                "Content-Type": `application/x-www-form-urlencoded;charset=utf-8`
            },
            data: code,
        }).then(function(res) {
            console.log(res);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
            cookie.set (
                'accessToken',
                res.data.access_token,
                {
                    path: '/', 
                    maxAge: res.data.expires_in,
                    // httpOnly: true
                }
            )
            // window.location.replace("/home");
        }).catch (function(err) {
            console.log(err);
            window.alert("로그인에 실패하였습니다.");
        });
    };

    useEffect(() => {
        getToken();
    }, []);

    return (<div style={{height:"100vh", display:"flex", alignItems:"center"}}><ClipLoader/></div>);
}

export default Oauth;