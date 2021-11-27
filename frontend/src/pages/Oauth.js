import React from 'react';
import { useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';


function Oauth() {
    // const dispatch = useDispatch();

    let code = new URL(window.location.href);
    let kakaoAuth = code.searchParams.get('code');
    console.log(kakaoAuth);
    // React.useEffect(async () => {
    //     await dispatch(kakaoLogin(kakaoAuth));
    // }, []);
    return (<ClipLoader/>);
}

function kakaoLogin(kakaoAuth) {
    return function (dispatch, getState, { history }) {
        axios({
          method: "GET",
          url: `http://{서버주소}/login/callback/kakao?code=${kakaoAuth}`,
        })
        .then((res) => {
            console.log(res);
            const ACCESS_TOKEN = res.data.accessToken;
            localStorage.setItem("token", ACCESS_TOKEN);
            history.replace("/main") 
        }).catch((err) => {
            console.log("소셜로그인 에러", err);
            window.alert("로그인에 실패하였습니다.");
            history.replace("/login"); // 로그인 실패하면 로그인화면으로 돌려보냄
        })
    }
}

export default Oauth;