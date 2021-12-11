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

        const payload = qs.stringify({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code,
            client_secret: CLIENT_SECRET,
        });
        
        const token = await axios({
            method: 'POST',
            url: "https://kauth.kakao.com/oauth/token",
            headers: {
                "Content-Type": `application/x-www-form-urlencoded;charset=utf-8`
            },
            data: payload,
        }).then(function(response) {
            console.log(response);

            if (!window.Kakao.isInitialized()) {
                window.Kakao.init(KAKAO_JS_KEY);
            }
            window.Kakao.Auth.setAccessToken(response.data.access_token);
            window.Kakao.API.request({
                url: "/v2/user/me",
                success: function ({kakao_account}) {
                    console.log(kakao_account.gender);
                },
                fail: function (err) {
                    console.log(err);
                    window.alert("사용자 정보를 불러오는 데 실패하였습니다.");
                }
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            cookie.set (
                'accessToken',
                response.data.access_token,
                {
                    path: '/', 
                    maxAge: response.data.expires_in,
                    // httpOnly: true
                }
            )

            window.location.replace("/home");
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