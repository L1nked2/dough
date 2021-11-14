import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../components/common/Header'
import MyShop from '../components/main/MyShop'
import CollapseResult from '../components/main/CollapseResult'
import ShopModal from './Shop'

import { CSSTransition } from "react-transition-group";

function Home(props) {
  const [openShopPage, setOpenShopPage] = useState(false);
  const [shopPageContents, setShopPageContents] = useState({name: "none"});
  const openPage = () => {setOpenShopPage(true)};
  const closePage = () => {setOpenShopPage(false)};

  return (
    <div className="Home-page">

      <CSSTransition in={openShopPage} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal closePage={closePage} shopPageContents={shopPageContents} />
      </CSSTransition>
      
      <Header changeIsHome={props.changeIsHome}/>
      <CollapseResult />
      <MyShop openPage={openPage} setShopPageContents={setShopPageContents}/>
    </div>
  );
}

export default Home;
