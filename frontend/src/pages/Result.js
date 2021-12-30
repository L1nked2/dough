import React, { useEffect } from 'react'

import Navbar from '../components/common/Navbar';
import './Result.css';

import SlideImages from '../components/common/SlideImages';
import { refresh_result } from '../actions/userInfo';

import img1 from '../img/result1.png';
import img2 from '../img/result2.png';
import { useDispatch } from 'react-redux';
import ShareIcon from '../components/icon/Share';

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
      <Navbar />
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
}