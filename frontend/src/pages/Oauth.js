import React, { useEffect }from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import keyData from "../service-account";
import qs from "qs"

const REST_API_KEY = keyData.client_id;
const REDIRECT_URI = 'http://localhost:3000/login/callback/kakao';
const CLIENT_SECRET = ''


function Oauth() {
    const getToken = async () => {
        let kakaoAuth = new URL(window.location.href);
        const code = kakaoAuth.searchParams.get('code');
        console.log(code);

        const payload = qs.stringify({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code,
        });
        console.log(payload);
        try {
            // access token 가져오기
            const res = await axios.post(
                "https://kauth.kakao.com/oauth/token",
                payload
            );
            console.log(res);

            window.Kakao.init(REST_API_KEY);
            window.Kakao.Auth.setAccessToken(res.data.access_token);
            window.history.replace("/main");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    return (<div style={{height:"100vh", display:"flex", alignItems:"center"}}><ClipLoader/></div>);
}

function kakaoLogin(kakaoAuth) {
    return function () {
        axios.get(`http://localhost:3000/login/callback/kakao?code=${kakaoAuth}`)
        .then((res) => {
            console.log(res);
            const ACCESS_TOKEN = res.data.accessToken;
            localStorage.setItem("token", ACCESS_TOKEN);
            window.history.replace("/main") 
        }).catch((err) => {
            console.log("소셜로그인 에러", err);
            window.alert("로그인에 실패하였습니다.");
            window.history.replace("/"); // 로그인 실패하면 로그인화면으로 돌려보냄
        })
    }
}

export default Oauth;