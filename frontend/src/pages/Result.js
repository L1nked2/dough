import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';

import Navbar from '../components/common/Navbar';
import './Result.css';

import SlideImages from '../components/common/SlideImages';
import { refresh_result } from '../actions/userInfo';
import MyResult from '../components/main/MyResult';
import RecommendContent from '../components/recommend/RecommendContent';

import img1 from '../img/result1.png';
import img2 from '../img/result2.png';
import img3 from '../img/result3.png';
import ShareIcon from '../components/icon/Share';

import { sampleShop } from '../data/samplePlaceDB';
import sampleImage from "../img/login_background.png";

function Result(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refresh_result(sampleTestResult));
  }, []);
  
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

const sampleTestResult = {
  titleLong: '햇볕에 늘어진 수건',
  titleShort: '늘어진 수건형',
  value1: 80,
  value2: 30,
  value3: 60,
  value4: 40,
  summary: '특기 : 볕 좋은 곳에서 멍때리기\n채광 좋은 카페 창가에서 늘어지기',
  description: '이 유형의 사람들은 따뜻한 색감의 조명과 내츄럴한 인테리어를 좋아해요. 전체적으로 밝은 색이나 파스텔톤을 사용한 가게, 채광이 좋고 아늑한 공간을 선호하는 편이랍니다.',
  tags: '#채광 #밝은 조명 #아늑한 인테리어',
  mainImg: img1,
  subImg1: img2,
  subImg2: img2,
  subImg3: img2,
  iconImg: img3
}


const sampleRecommendInfo = { 
  mainText: `늘어진 수건형\n취향저격 가게 3곳`,
  subText: '따뜻한 감성을 지닌 강남역 주변 카페',
  imgSrc: sampleImage,
  contents: [{...sampleShop, name: '치돈치돈'}, {...sampleShop, name: '바른돈가'}, {...sampleShop, name: '정돈'},]}