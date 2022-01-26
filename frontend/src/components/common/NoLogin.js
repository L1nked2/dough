import React from 'react';
import { useState, useEffect } from 'react';
import './NoLogin.css';

function NoLogin() {
    return (
        <div className="noLogin">
            <div>로그인 정보가 없어 다른 정보를</div>
            <div>불러올 수 없습니다</div>
            <span onClick={()=>{window.location.replace("/")}}>로그인 하러 가기</span>
        </div>
    );
}

export default NoLogin;