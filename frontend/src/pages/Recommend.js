import React, { useEffect, useState } from 'react'
import './Recommend.css';
import { CSSTransition } from "react-transition-group";

import Header from '../components/common/Header';
import ShopModal from './Shop';
import RecommendListModal from './RecommendList';
import SlideImages from '../components/common/SlideImages';
import MyTypeContents from '../components/recommend/MyTypeContents';
import NewContents from '../components/recommend/NewContents';
import OtherTypeContents from '../components/recommend/OtherTypeContent';
import Navbar from '../components/common/Navbar';

import sampleImage from "../img/login_background.png";
import { sampleShop } from '../data/samplePlaceDB';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenShopPage, setShopPageContents } from '../actions/homePageInfo';
import { setOpenListPage, initializeRecommendList } from '../actions/recommendPageInfo';

function Recommend(props) {
  const recommendInfo = sampleRecommendInfo;
  const dispatch = useDispatch();
  const shopPageIsOpen = useSelector((state) => state.homePageInfo.shopPageIsOpen);
  const listPageIsOpen = useSelector((state) => state.recommendPageInfo.listPageIsOpen);

  dispatch(initializeRecommendList( recommendInfo, recommendInfo, recommendInfo, recommendInfo ));
  // useEffect(() => {
  // }, [])

  const [slideCategory, setSlideCategory] = useState('myType');
  
  return (
    <div className="recommendPage">
      <Header className="recommend"/>
      <CSSTransition in={listPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <RecommendListModal  />
      </CSSTransition>
      <SlideImages page="recommend"/>


      <nav className="recommendCategory">
        <div className={slideCategory==='myType' ? "active" : ""} onClick={()=>{setSlideCategory('myType')}}>MY TYPE</div>
        <div className={slideCategory==='new' ? "active" : ""} onClick={()=>{setSlideCategory('new')}}>NEW</div>
        <div className={slideCategory==='otherType' ? "active" : ""} onClick={()=>{setSlideCategory('otherType')}}>OTHER TYPE</div>
      </nav>

      <CSSTransition in={shopPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal />
      </CSSTransition>
      {slideCategory==='myType' && <MyTypeContents />}
      {slideCategory==='new' && <NewContents />}
      {slideCategory==='otherType' && <OtherTypeContents />}
      <Navbar page={"recommend"}/>
    </div>
  );
}

export default Recommend;

const sampleRecommendInfo = [
  { mainText: `강남역 일대\n분위기 맛집 3곳`, subText: '따뜻한 감성을 지닌 강남역 주변 카페', target: '주택가 레스토랑', imgSrc: sampleImage, 
    contents: [sampleShop, {...sampleShop, name: '치돈치돈'}, {...sampleShop, rank: 3, name: '바른돈가'}, {...sampleShop, rank: 4, name: '정돈'},]},
  { mainText: '강남역 일대\n분위기 맛집 3곳', subText: '따뜻한 감성을 지닌 강남역 주변 카페', target: '주택가 레스토랑', imgSrc: sampleImage, 
  contents: [sampleShop, {...sampleShop, name: '치돈치돈'}, {...sampleShop, rank: 3, name: '바른돈가'}, {...sampleShop, rank: 4, name: '정돈'},]},
  { mainText: '강남역 일대\n분위기 맛집 3곳', subText: '따뜻한 감성을 지닌 강남역 주변 카페', target: '주택가 레스토랑', imgSrc: sampleImage, 
  contents: [sampleShop, {...sampleShop, name: '치돈치돈'}, {...sampleShop, rank: 3, name: '바른돈가'}, {...sampleShop, rank: 4, name: '정돈'},]},
  { mainText: '강남역 일대\n분위기 맛집 3곳', subText: '따뜻한 감성을 지닌 강남역 주변 카페', target: '주택가 레스토랑', imgSrc: sampleImage, 
  contents: [sampleShop, {...sampleShop, name: '치돈치돈'}, {...sampleShop, rank: 3, name: '바른돈가'}, {...sampleShop, rank: 4, name: '정돈'},]},
]