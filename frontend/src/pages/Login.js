import React from 'react'
import { useState, useEffect } from 'react'
import { Cookies } from 'react-cookie';

import logoWhite from "../img/logo_white.svg"
import logoKakao from "../img/kakao.svg"

import '../App.css'
import './Login.css'

function Login() {
    const cookie = new Cookies();
    const currAccessToken = cookie.get("accessToken");
    if (currAccessToken) {
        window.location.replace("/main");
    }

    function clickLogin(e) {
        window.Kakao.Auth.login({
            redirectUri: 'https://dough-survey.web.app/login/callback/kakao',
            scope: 'gender',
            success: function(response) {
                console.log(response)
            },
            fail: function(error) {
                console.log(error);
            }
        });
    }

    window.Kakao.init("c6d8dd20d5ff2084f591d8b34cbe2608");
    
    return( 
        <div className="layout"> 
            <div className="backgroundImage">
                <div className="login">
                    <img className="logoWhite" src={logoWhite} alt="logoWhite"/>
                    <p className="loginText">밥약속잡을땐</p>
                    <a href="javascript:kakaoLogin();" className="kakaoLogin" onClick={clickLogin}>
                        <img className="logoKakao" src={logoKakao} alt="logoKakao"/>
                        카카오로 시작하기
                    </a>
                </div>
            </div>
            
        </div>
    );
}

export default Login;
