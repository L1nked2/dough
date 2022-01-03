import React from 'react'
import { useState, useEffect } from 'react'
import { Cookies } from 'react-cookie';

import { landing_cover } from '../data/imgPath';
import logoWhite from "../img/logo_white.svg"
import logoKakao from "../img/kakao.svg"

import '../App.css'
import './Login.css'

function Login() {
    const cookie = new Cookies();
    const currAccessToken = cookie.get("accessToken");
    if (currAccessToken) {
        setTimeout(function(){window.location.replace("/survey")}, 2000);
    }

    function clickLogin(e) {
        window.Kakao.Auth.authorize({
            redirectUri: 'https://dough-survey.web.app/login/callback/kakao',
            // redirectUri: 'http://localhost:3000/login/callback/kakao',
            scope: 'profile_nickname,profile_image,account_email,gender',
            success: function(response) {
                console.log(response)
            },
            fail: function(error) {
                console.log(error);
            }
        });
    }

    window.Kakao.init("423e288ffa4a8548ec18cd9fc2865e4e");
    
    return( 
        <div className="backgroundImage" style={{backgroundImage: `url(${landing_cover})`}}>
            <div className="login">
                <img className="logoWhite" src={logoWhite} alt="logoWhite"/>
                <p className="loginText">밥약속잡을땐</p>
                {!currAccessToken && 
                <a href="javascript:kakaoLogin();" className="kakaoLogin" onClick={clickLogin}>
                    <img className="logoKakao" src={logoKakao} alt="logoKakao"/>
                    카카오로 시작하기
                </a>}
            </div>
        </div>
    );
}

export default Login;
