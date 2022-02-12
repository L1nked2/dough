import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { CSSTransition } from "react-transition-group";

import Navbar from '../components/common/Navbar';
import './Result.css';

import SlideImages from '../components/common/SlideImages';
import { refreshResult } from '../actions/userInfo';
import MyResult from '../components/main/MyResult';
import CurationContent from '../components/survey/CurationContent';
import CurationListModal from './CurationList';

import ShareIcon from '../components/icon/Share';

import { sampleShop } from '../data/samplePlaceDB';
import { sampleTestResult } from '../data/sampleUserDB';
import sampleImage from "../img/login_background.png";
import { mainCuration, sampleCuration } from '../data/sampleCuration';

import { getAuth } from 'firebase/auth';
import { firebaseInit } from "../firebaseInit";
import { useState } from 'react';

firebaseInit();


function Result(props) {
  const dispatch = useDispatch();
  dispatch(refreshResult({sampleTestResult: sampleTestResult, mainCuration: mainCuration, sampleCuration: sampleCuration}));
  useEffect(() => {
    // result axios or query string으로 URL 연결
  },[]);
  
  const curationPageIsOpen = useSelector((state) => state.recommendPageInfo.curationPageIsOpen);

  return (
    <div className="resultPage">
      <CSSTransition in={curationPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <CurationListModal  />
      </CSSTransition>
      <SlideImages page="result" elem={{mainText: mainCuration.title, subText: mainCuration.subTitle, contents: mainCuration.contents}}/>
      <div className="shareButton">
        결과 공유하기
        <span className="shareIcon"><ShareIcon width={'1.2em'} color="#A3A3A3" /></span>
      </div>
      <MyResult />
      <CurationContent elem={{mainText: sampleCuration.title, subText: sampleCuration.subTitle, contents: sampleCuration.contents}} isSpecificType={false} isSample={true}/>
      <div className="explain">
        <div className="content">다른 지역의 내 취향 가게도 알고 싶다면?</div>
        <div className="edge">▲</div>
      </div>
      <Navbar page="profile"/>
    </div>
  );
}

export default Result;

