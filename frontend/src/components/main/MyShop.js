import React, {useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";

import SlideImages from '../common/SlideImages';
import MoreShop from '../main/MoreShop';
import MenuModal from '../common/MenuModal';

import MapIcon from '../icon/Map';
import sampleImage from "../../img/login_background.png";

import './MyShop.css';
import { useDispatch, useSelector } from 'react-redux';
import { openLocationPage, openMenuModal } from '../../actions/homePageInfo';

function MyShop(props) {
  const dispatch = useDispatch();
  /* Nav bar button controller */
  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeRestaurant = () => {setSlideCategory([true, false, false]);}
  const changeCafe = () => {setSlideCategory([false, true, false]);}
  const changeBar = () => {setSlideCategory([false, false, true]);}

  /* Menu choice modal controller */
  const menuModalIsOpen = useSelector((state) => state.homePageInfo.menuModalIsOpen);
  const openPage = (openFunc) => {
    dispatch(openFunc())
    document.body.style.overflow = 'hidden';
  };

  const currLocation = useSelector((state) => state.homePageInfo.currLocation);

  const stateFood = useSelector((state) => state.homePageInfo.tempFoodStateList);
  const stateDrink = useSelector((state) => state.homePageInfo.tempDrinkStateList);

  
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
        <span onClick={()=>{openPage(openLocationPage)}} className="locationButton">
          <MapIcon width={"1.253em"} color={"rgba(0,0,0,0.36)"}/>
          <span id="location">{`${currLocation.name === "위치 선택" ? "" : "서울/"}${currLocation.name}`}</span>
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
            ? <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                {`음식 | ${printActiveMenu(stateFood)}`}<span>{`>`}</span>
              </div>
            : <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                음식 종류 바꾸기<span>{`>`}</span>
              </div>
          }
        </div>
        <CSSTransition in={menuModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="음식"/>
        </CSSTransition>
        <SlideImages page="main" name="restaurant"/>
        <MoreShop name="음식점"/>
      </>}

      {/* cafe */}
      {slideCategory[1] && <>
        <SlideImages page="main" name="cafe"/>
        <MoreShop name="카페"/>
      </>}

      {/* bar */}
      {slideCategory[2] && <>
        <div className="menuChange">
          { checkAnyActive(stateDrink)
            ? <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                {`술 | ${printActiveMenu(stateDrink)}`}<span>{`>`}</span>
              </div>
            : <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                술 종류 바꾸기<span>{`>`}</span>
              </div>
          }
        </div>
        <CSSTransition in={menuModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="술" />
        </CSSTransition>
        <SlideImages page="main"name="bar"/>
        <MoreShop name="술집"/>
      </>}
    </div>
  );
}

export default MyShop;