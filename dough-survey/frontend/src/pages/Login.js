import React from 'react'
import { useState, useEffect } from 'react'

import logoWhite from "../img/logo_white.svg"
import logoKakao from "../img/kakao.svg"

import '../App.css'
import './Login.css'

function Login() {
    function clickLogin(e) {
        window.location.href = "/main"
    }
    
    return(
        <div className="layout" style={{backgroundColor:"black"}} >
            <div className="backgroundImage">
                <div className="login">
                    <img className="logoWhite" src={logoWhite} alt="logoWhite"/>
                    <p className="loginText">밥약속잡을땐</p>
                    <button className="kakaoLogin" onClick={clickLogin}>
                        <img className="logoKakao" src={logoKakao} alt="logoKakao"/>
                        카카오로 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
