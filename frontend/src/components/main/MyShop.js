import React, {useState, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";
import axios from 'axios';

import { getAuth } from 'firebase/auth';
import { firebaseInit } from "../../firebaseInit";

import SlideImages from '../common/SlideImages';
import MoreShop from '../main/MoreShop';
import MenuModal from '../common/MenuModal';

import MapIcon from '../icon/Map';

import './MyShop.css';
import { useDispatch, useSelector } from 'react-redux';
import { openLocationPage, openMenuModal, changeContent, changeCurrentCategory } from '../../actions/homePageInfo';

firebaseInit();

function MyShop(props) {
  const dispatch = useDispatch();
  /* Nav bar button controller */
  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeRestaurant = () => {
    dispatch(changeCurrentCategory('food')); setSlideCategory([true, false, false]);}
  const changeCafe = () => {
    dispatch(changeCurrentCategory('cafe')); setSlideCategory([false, true, false]);}
  const changeBar = () => {
    dispatch(changeCurrentCategory('drink')); setSlideCategory([false, false, true]);}
    
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
  /* Menu choice modal controller */
  const menuModalIsOpen = useSelector((state) => state.homePageInfo.menuModalIsOpen);
  const openPage = (openFunc) => {
    dispatch(openFunc())
    document.body.style.overflow = 'hidden';
  };

  const currLocation = useSelector((state) => state.homePageInfo.currLocation);

  const stateFood = useSelector((state) => state.homePageInfo.tempFoodStateList);
  const stateCafe = useSelector((state) => state.homePageInfo.tempCafeStateList);
  const stateDrink = useSelector((state) => state.homePageInfo.tempDrinkStateList);

  const foodPlaceList = useSelector(state => state.homePageInfo.foodPlaceList);
  const cafePlaceList = useSelector(state => state.homePageInfo.cafePlaceList);
  const drinkPlaceList = useSelector(state => state.homePageInfo.drinkPlaceList);
  const testResult = useSelector((state) => state.userInfo.testResult.sampleTestResult);


  useEffect(() => {
    // getAuth().onAuthStateChanged(function(user){
    //   if (user) {
    //     console.log("MyShop.js");
    //     user.getIdToken(true).then(function(idToken) {
          const getPlaceList = async () => { 
            const res = await axios({
                method: 'POST',
                url: 'https://dough-survey.web.app/api/station',
                headers: {
                    "Content-Type": `application/json`
                },
                data: {stationId: "2a2fb6a8-e995-515c-a24b-849030c8d8ea", userToken: '', category: "음식점", tags: []},
            }).then(response => {
                console.log(response);
                dispatch(changeContent('food', indexing(response.data.stationInfo.place_list,[11, 14, 18, 22, 23, 34, 36, 40, 45, 57, 58, 68, 70])));
                dispatch(changeContent('cafe', indexing(response.data.stationInfo.place_list,[3, 16, 17, 21, 28, 29, 35, 39, 56, 59, 67, 69])));
                dispatch(changeContent('drink', indexing(response.data.stationInfo.place_list,[8, 12, 14, 20, 33, 38, 41, 42, 46, 48, 50, 61])));
                return response.data;
              }).catch(err => {
                console.log(err);
              });
              
            }
          if(foodPlaceList.length === 0 || cafePlaceList.length === 0 || drinkPlaceList.length === 0){
            getPlaceList();
          }
    //     }).catch(function(error) {
    //       console.log(error);
    //     });
    //   }
    // })
  },[]);

  // 취향 테스트 결과 없는 경우
  // if (!testResult) {
  //   return(
  //     <div className="myShop">
  //       <div className="myShopHeader">
  //         <span id="myShop">내 취향 가게</span>
  //       </div>
  //       <nav className="shopCategory">
  //         <div className={slideCategory[0] ? "active" : ""} onClick={changeRestaurant}>음식점</div>
  //         <div className={slideCategory[1] ? "active" : ""} onClick={changeCafe}>카페</div>
  //         <div className={slideCategory[2] ? "active" : ""} onClick={changeBar}>술집</div>
  //       </nav>
  //       <div className="noResult">
  //         <div>아직 약속장소 취향 테스트를</div>
  //         <div>하지 않았습니다.</div>
  //         <div>내 취향에 맞는 가게가 궁금하다면,</div>
  //         <div>아래 버튼을 눌러주세요 :)</div>
  //         <span>취향테스트 시작하기</span>
  //       </div>
  //     </div>
  //   );
  // }
  
  return (
    <div className="myShop">
      <div className="myShopHeader">
        <span id="myShop">내 취향 가게</span>
        <span onClick={()=>{openPage(openLocationPage)}} className="locationButton">
          <MapIcon width={"1.253em"} color={"rgba(0,0,0,0.36)"} strokeWidth={0.01}/>
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
        {foodPlaceList.length === 0 ? <div style={{height: '30vh', backgroundColor: '#F8F8F8'}}></div> : <>
          <SlideImages page="main" name="food" slideContentList={foodPlaceList.slice(0,3)}/>
          {foodPlaceList.length > 3 && <MoreShop name="food" content={foodPlaceList.slice(3)}/>}
          </>
        }
      </>}

      {/* cafe */}
      {slideCategory[1] && <>
        <div className="menuChange">
          { checkAnyActive(stateCafe)
            ? <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                {`카페 | ${printActiveMenu(stateCafe)}`}<span>{`>`}</span>
              </div>
            : <div onClick={()=>{openPage(openMenuModal)}} className="menuChangeButton" id="menuChangeButton">
                카페 종류 바꾸기<span>{`>`}</span>
              </div>
          }
        </div>
        <CSSTransition in={menuModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
          <MenuModal name="카페"/>
        </CSSTransition>
        {cafePlaceList.length === 0 ? <div style={{height: '30vh', backgroundColor: '#F8F8F8'}}></div> : <>
          <SlideImages page="main" name="cafe" slideContentList={cafePlaceList.slice(0,3)}/>
          {cafePlaceList.length > 3 && <MoreShop name="cafe" content={cafePlaceList.slice(3)}/>}
          </>
        }
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
        {drinkPlaceList.length === 0 ? <div style={{height: '30vh', backgroundColor: '#F8F8F8'}}></div> : <>
          <SlideImages page="main" name="drink" slideContentList={drinkPlaceList.slice(0,3)}/>
          {drinkPlaceList.length > 3 && <MoreShop name="drink" content={drinkPlaceList.slice(3)}/>}
          </>
        }
      </>}
    </div>
  );
}

export default MyShop;

function indexing (list, index) {
  var newList = [];
  for (var i = 0; i < index.length; i++) {
    newList.push(list[index[i]]);
  }
  return newList;
}