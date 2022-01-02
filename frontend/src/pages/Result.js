import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';

import Navbar from '../components/common/Navbar';
import './Result.css';

import SlideImages from '../components/common/SlideImages';
import { refresh_result } from '../actions/userInfo';
import MyResult from '../components/main/MyResult';
import RecommendContent from '../components/recommend/RecommendContent';

import ShareIcon from '../components/icon/Share';

import { sampleShop } from '../data/samplePlaceDB';
import { sampleTestResult } from '../data/sampleUserDB';
import sampleImage from "../img/login_background.png";

import { getAuth } from 'firebase/auth';
import { firebaseInit } from "../firebaseInit";

firebaseInit();


function Result(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refresh_result(sampleTestResult));
    getAuth().onAuthStateChanged(function(user){
      if (user) {
        console.log("Result.js");
        console.log(user);
        user.getIdToken(true).then(function(idToken) {
          const getUserDB = async () => { 
            const res = await axios({
                method: 'POST',
                url: 'https://dough-survey.web.app/api/user',
                headers: {
                    "Content-Type": `application/json`
                },
                data: {userToken: idToken},
            }).then(response => {
                console.log(response);
                return response.data;
            }).catch(err => {
                console.log(err);
              });
            }
            getUserDB();
        }).catch(function(error) {
          console.log(error);
        });
      }
    })
  },[]);
  
  return (
    <div className="resultPage">
      <SlideImages page="result"/>
      <div className="shareButton">
        결과 공유하기
        <span className="shareIcon"><ShareIcon width={'1.2em'} color="#A3A3A3" /></span>
      </div>
      <MyResult />
      <RecommendContent elem={sampleRecommendInfo} isSpecificType={false} isSample={true}/>
      <div className="explain">
        <div className="content">다른 지역의 내 취향 가게도 알고 싶다면?</div>
        <div className="edge">▲</div>
      </div>
      <Navbar page="profile"/>
    </div>
  );
}

export default Result;



const sampleRecommendInfo = { 
  mainText: `늘어진 수건형\n취향저격 가게 3곳`,
  subText: '따뜻한 감성을 지닌 강남역 주변 카페',
  imgSrc: sampleImage,
  contents: [{...sampleShop, name: '치돈치돈'}, {...sampleShop, name: '바른돈가'}, {...sampleShop, name: '정돈'},]}