import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../components/common/Header'
import MyShop from '../components/main/MyShop'
import CollapseResult from '../components/main/CollapseResult'
import ShopModal from './Shop'
import LocationModal from './Location'

import { CSSTransition } from "react-transition-group";

function Home(props) {
  const [openShopPage, setOpenShopPage] = useState(false);
  const [shopPageContents, setShopPageContents] = useState({name: "none"});
  const openPage = () => {setOpenShopPage(true)};
  const closePage = () => {setOpenShopPage(false)};
  
  /* Current location information */
  const [currLocation, setCurrLocation] = useState({name: "위치 선택", line: "none", range: "none"});
  const [locationModalIsOpen, setLocationModalIsOpen] = useState(false);
  const openLocationPage = () => {setLocationModalIsOpen(true)};
  const closeLocationPage = () => {setLocationModalIsOpen(false)};


  return (
    <div className="Home-page">

      <CSSTransition in={openShopPage} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal closePage={closePage} shopPageContents={shopPageContents} />
      </CSSTransition>
      <CSSTransition in={locationModalIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <LocationModal currLocation={currLocation} setCurrLocation={setCurrLocation} closePage={closeLocationPage} />
      </CSSTransition>
      
      <Header changeIsHome={props.changeState.changeToHome}/>
      <CollapseResult />
      <MyShop openPage={openPage} openLocationPage={openLocationPage} currLocation={currLocation} setShopPageContents={setShopPageContents}/>
    </div>
  );
}

export default Home;
