import React, {useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";

import SlideImages from '../common/SlideImages';
import MoreShop from '../main/MoreShop';
import MenuModal from '../common/MenuModal';

import MapIcon from '../icon/Map';
import sampleImage from "../../img/login_background.png";

import './MyShop.css';

function MyShop(props) {
  /* Nav bar button controller */
  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeRestaurant = () => {setSlideCategory([true, false, false]);}
  const changeCafe = () => {setSlideCategory([false, true, false]);}
  const changeBar = () => {setSlideCategory([false, false, true]);}

  /* Menu choice modal controller */
  const [menuModalIsOpen, setMenuModalIsOpen] = useState(false);
  const openMenuModal = () => {
    setMenuModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeMenuModal = () => {
    setMenuModalIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const foodList = ['분식', '곱창', '닭발', '국밥', '백반', '돼지고기', '돈카츠', '닭갈비', '소고기', 
                    '일본가정식', '일본카레', '오믈렛', '회', '스시', '샐러드', '샌드위치', '브런치',
                    '수제버거', '파스타', '피자', '스테이크', '베트남', '멕시코', '인도', '태국', '양꼬치', 
                    '중국집', '마라탕,마라샹궈,훠궈', '딤섬'];
  const drinkList = ['칵테일바', '하이볼', '와인', '수제맥주', '소주,맥주', '양주', '막걸리', '사케'];
  const stateFoodTemp = []
  const stateDrinkTemp = []

  for (const [index, menu] of foodList.entries()){
    stateFoodTemp.push({id: index, menu: menu, active:false})
  }
  for (const [index, menu] of drinkList.entries()){
    stateDrinkTemp.push({id: index, menu: menu, active:false})
  }
  const [stateFood, setStateFood] = useState(stateFoodTemp);
  const [stateDrink, setStateDrink] = useState(stateDrinkTemp);

  function checkAnyActive (list) {
    let anyActive = false;
    for (var i=0; i < list.length; i++) {
      if (list[i].active){
        anyActive = true;
      }
    }
    return anyActive;
  }
  function printActiveMenu (states) {
    const stateTemp = [];
    for (var i=0; i < states.length; i++) {
      if (states[i].active){
        stateTemp.push(states[i].menu)
      }
    }
    if (stateTemp.length === 1) {
      return `${stateTemp[0]}`
    }
    else {
      return `${stateTemp[0]} 외 +${stateTemp.length - 1}`
    }
  }

  /* Slide image information */
  const restaurantInfo = [
    { rank: 1, name: '치돈치돈', imgSrc: sampleImage},
    { rank: 2, name: '치돈치돈', imgSrc: sampleImage},
    { rank: 3, name: '치돈치돈', imgSrc: sampleImage},
  ]
  const cafeInfo = [
    { rank: 1, name: 'cafe1', imgSrc: sampleImage},
    { rank: 2, name: 'cafe2', imgSrc: sampleImage},
    { rank: 3, name: 'cafe3', imgSrc: sampleImage},
  ]
  const barInfo = [
    { rank: 1, name: 'bar1', imgSrc: sampleImage},
    { rank: 2, name: 'bar2', imgSrc: sampleImage},
    { rank: 3, name: 'bar3', imgSrc: sampleImage},
  ]

  return (
    <div className="myShop">
      <div className="myShopHeader">
        <span id="myShop">내 취향 가게</span>
        <span onClick={props.openLocationPage} className="locationButton">
          <MapIcon width={"1.253em"} color={"rgba(0,0,0,0.36)"}/>
          <span id="location">{`${props.currLocation.name === "위치 선택" ? "" : "서울/"}${props.currLocation.name}`}</span>
        </span>
      </div>
      <nav className="shopCategory">
        <div className={slideCategory[0] ? "active" : ""} onClick={changeRestaurant}>음식점</div>
        <div className={slideCategory[1] ? "active" : ""} onClick={changeCafe}>카페</div>
        <div className={slideCategory[2] ? "active" : ""} onClick={changeBar}>술집</div>
      </nav>
    
      {/* restaurant */}
      {slideCategory[0] && <>
        <div className="menuChange">
          { checkAnyActive(stateFood)
            ? <div onClick={openMenuModal} className="menuChangeButton" id="menuChangeButton">{`음식 | ${printActiveMenu(stateFood)}`}<span>{`>`}</span></div>
            : <div onClick={openMenuModal} className="menuChangeButton" id="menuChangeButton">음식 종류 바꾸기<span>{`>`}</span></div>
          }
        </div>
        <CSSTransition in={menuModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="음식" list={stateFood} setList={setStateFood} closeMenuModal={closeMenuModal} />
        </CSSTransition>
        <SlideImages 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          info={restaurantInfo} 
          page="main"
          name="restaurant"/>
        <MoreShop 
          openModal={props.openPage}
          setShopPageContents={props.setShopPageContents} 
          name="음식점"/>
      </>}

      {/* cafe */}
      {slideCategory[1] && <>
        <SlideImages 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          info={cafeInfo} 
          page="main"
          name="cafe"/>
        <MoreShop 
          openModal={props.openPage}
          setShopPageContents={props.setShopPageContents} 
          name="카페"/>
      </>}

      {/* bar */}
      {slideCategory[2] && <>
        <div className="menuChange">
          { checkAnyActive(stateDrink)
            ? <div onClick={openMenuModal} className="menuChangeButton" id="menuChangeButton">{`술 | ${printActiveMenu(stateDrink)}`}<span>{`>`}</span></div>
            : <div onClick={openMenuModal} className="menuChangeButton" id="menuChangeButton">술 종류 바꾸기<span>{`>`}</span></div>
          }
        </div>
        <CSSTransition in={menuModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="술" list={stateDrink} setList={setStateDrink} closeMenuModal={closeMenuModal} />
        </CSSTransition>
        <SlideImages 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          info={barInfo} 
          page="main"
          name="bar"/>
        <MoreShop 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          name="술집"/>
      </>}


    </div>
  );
}

export default MyShop;