import React from 'react'
import { useState, useEffect } from 'react'

import logoWhite from "../img/logo_white.svg"
import logoKakao from "../img/kakao.svg"

import '../App.css'
import './Login.css'

function Login() {
    function clickLogin(e) {
        console.log('hello');
        window.Kakao.Auth.login({
            redirectUri: 'http://localhost:3000/login/callback/kakao',///
            scope: 'gender', //동의항목 페이지에 있는 개인정보 보호 테이블의 활성화된 ID값을 넣습니다.
            success: function(response) {
                console.log(response) // 로그인 성공하면 받아오는 데이터
                window.Kakao.API.request({ // 사용자 정보 가져오기 
                    url: '/v2/user/me',
                    success: (res) => {
                        const kakao_account = res.kakao_account;
                        console.log(kakao_account)
                    }
                });
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
