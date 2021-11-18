import React, {useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";

import SlideImages from '../common/SlideImages';
import MoreShop from '../main/MoreShop';
import MenuModal from '../common/MenuModal';
import sampleImage from "../../img/login_background.png";

import './MyShop.css';

function MyShop(props) {
  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeRestaurant = () => {setSlideCategory([true, false, false]);}
  const changeCafe = () => {setSlideCategory([false, true, false]);}
  const changeBar = () => {setSlideCategory([false, false, true]);}

  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  return (
    <div className="myShop">
      <div className="myShopHeader">
        <span id="myShop">내 취향 가게</span>
        <span className="locationButton"><MapIcon width={17}/><span id="location">서울/강남역</span></span>
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
            ? <div onClick={() => setModalIsOpen(true)} className="menuChangeButton">{`음식 | ${printActiveMenu(stateFood)}`}<span>{`>`}</span></div>
            : <div onClick={() => setModalIsOpen(true)} className="menuChangeButton">음식 종류 바꾸기<span>{`>`}</span></div>
          }
        </div>
        <CSSTransition in={modalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="음식" list={stateFood} setList={setStateFood} setModalIsOpen={setModalIsOpen} />
        </CSSTransition>
        <SlideImages 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          sampleImage={sampleImage} 
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
          sampleImage={sampleImage} 
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
            ? <div onClick={() => setModalIsOpen(true)} className="menuChangeButton">{`술 | ${printActiveMenu(stateDrink)}`}<span>{`>`}</span></div>
            : <div onClick={() => setModalIsOpen(true)} className="menuChangeButton">술 종류 바꾸기<span>{`>`}</span></div>
          }
        </div>
        <CSSTransition in={modalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="술" list={stateDrink} setList={setStateDrink} setModalIsOpen={setModalIsOpen} />
        </CSSTransition>
        <SlideImages 
          openModal={props.openPage} 
          setShopPageContents={props.setShopPageContents}
          sampleImage={sampleImage} 
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

function MapIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 13.253 18.234">
      <g id="그룹_223" data-name="그룹 223" transform="translate(-92.75 -2.016)">
        <path id="패스_860" data-name="패스 860" d="M99.377,2.266A6.372,6.372,0,0,0,93,8.643c0,3.8,4.025,9.037,5.68,11.03a.9.9,0,0,0,1.394,0c1.654-1.992,5.68-7.229,5.68-11.03A6.372,6.372,0,0,0,99.377,2.266ZM94.822,8.643a4.555,4.555,0,1,1,9.109,0c0,2.623-2.623,6.55-4.555,9C97.482,15.21,94.822,11.239,94.822,8.643Z" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.5"/>
        <circle id="타원_112" data-name="타원 112" cx="2.277" cy="2.277" r="2.277" transform="translate(97.099 6.365)" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.5"/>
      </g>
    </svg>

  );
}
