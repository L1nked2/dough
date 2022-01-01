import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';

import './Home.css';
import Header from '../components/common/Header'
import MyShop from '../components/main/MyShop'
import CollapseResult from '../components/main/CollapseResult'
import ShopModal from './Shop'
import SlideImages from '../components/common/SlideImages';
import LocationModal from './Location'
import Navbar from '../components/common/Navbar';
import { initialMenuState } from '../actions/homePageInfo';
import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from 'react-redux';
import { initializeList } from '../actions/myPlaceList';

import { sampleShop } from '../data/samplePlaceDB';

function Home() {
  const shopPageIsOpen = useSelector((state) => state.homePageInfo.shopPageIsOpen);
  const locationPageIsOpen = useSelector((state) => state.homePageInfo.locationPageIsOpen);
  const fullFoodList = useSelector((state) => state.homePageInfo.fullFoodList); 
  const fullDrinkList = useSelector((state) => state.homePageInfo.fullDrinkList); 
  const initializedMenuList = useSelector((state) => state.homePageInfo.initializedList); 
  const dispatch = useDispatch();

  const cookie = new Cookies();
  useEffect(() => {
    const currAccessToken = cookie.get("accessToken");
    dispatch(initializeList(sampleList));
    if (!initializedMenuList) {
      dispatch(initialMenuState(fullFoodList, fullDrinkList))
    }
    return null;
  },[]);
  
  return (
    <div className="Home-page">
      <CSSTransition in={shopPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal />
      </CSSTransition>
      <CSSTransition in={locationPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <LocationModal />
      </CSSTransition>
      
      <Header />
      <CollapseResult />
      {/* <button onClick={onCapture}>share!</button> */}
      <MyShop />
      <Navbar page={"home"}/>
    </div>
  );
}

export default Home;


const sampleList = [
  {...sampleShop, rank: 1},
  {...sampleShop, rank: 2, name: '치돈치돈'},
  {...sampleShop, rank: 3, name: '바른돈가'},
  {...sampleShop, rank: 4, name: '정돈'},
  {...sampleShop, rank: 5},
  {...sampleShop, rank: 6}
]