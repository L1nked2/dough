import React, { useEffect, useState } from 'react'
import './Recommend.css';
import { CSSTransition } from "react-transition-group";

import Header from '../components/common/Header';
import ShopModal from './Shop';
import SlideImages from '../components/common/SlideImages';
import MyTypeContents from '../components/recommend/MyTypeContents';
import NewContents from '../components/recommend/NewContents';
import OtherTypeContents from '../components/recommend/OtherTypeContent';

import sampleImage from "../img/login_background.png";

function Recommend(props) {
  const [headerFill, setHeaderFill] = useState(false);

  const recommendInfo = [
    { mainText: `강남역 일대\n분위기 맛집 3곳`, subText: 'for 정원 찻집 유형', imgSrc: sampleImage},
    { mainText: '강남역 일대\n분위기 맛집 3곳', subText: 'for 정원 찻집 유형', imgSrc: sampleImage},
    { mainText: '강남역 일대\n분위기 맛집 3곳', subText: 'for 정원 찻집 유형', imgSrc: sampleImage},
    { mainText: '강남역 일대\n분위기 맛집 3곳', subText: 'for 정원 찻집 유형', imgSrc: sampleImage},
  ]

  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeMyType = () => {setSlideCategory([true, false, false]);}
  const changeNew = () => {setSlideCategory([false, true, false]);}
  const changeOtherType = () => {setSlideCategory([false, false, true]);}

  useEffect (() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  }, [])

  function handleScroll () {
    if (window.scrollY >= window.innerHeight * 0.65 - 60){setHeaderFill(true);}
    else {setHeaderFill(false);}
    return;
  }
  
  const [openShopPage, setOpenShopPage] = useState(false);

  const [shopPageContents, setShopPageContents] = useState({name: "none", like: false});
  const openPage = () => {
    setOpenShopPage(true);
    document.body.style.overflow = 'hidden';
  };
  const closePage = () => {
    setOpenShopPage(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="recommendPage">
      <Header className={headerFill?"":"recommend"} changeIsHome={props.changeState.changeToHome}/>
      <SlideImages 
          info={recommendInfo} 
          page="recommend"/>
      <nav className="recommendCategory">
        <div className={slideCategory[0] ? "active" : ""} onClick={changeMyType}>MY TYPE</div>
        <div className={slideCategory[1] ? "active" : ""} onClick={changeNew}>NEW</div>
        <div className={slideCategory[2] ? "active" : ""} onClick={changeOtherType}>OTHER TYPE</div>
      </nav>

      <CSSTransition in={openShopPage} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal closePage={closePage} setShopPageContents={setShopPageContents} shopPageContents={shopPageContents} />
      </CSSTransition>
      {slideCategory[0] && <MyTypeContents openPage={openPage} setShopPageContents={setShopPageContents}/>}
      {slideCategory[1] && <NewContents openPage={openPage} setShopPageContents={setShopPageContents}/>}
      {slideCategory[2] && <OtherTypeContents openPage={openPage} setShopPageContents={setShopPageContents}/>}
    </div>
  );
}

export default Recommend;
