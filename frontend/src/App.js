import React, { useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import Recommend from './pages/Recommend';
import FavoriteMainPage from './pages/FavoriteMainPage/FavoriteMainPage';
import FavoriteStationPage from './pages/FavoriteStationPage/FavoriteStationPage';
import Profile from './pages/Profile';
import Login from './pages/Login' ;
import Oauth from './pages/Oauth' ;
import Shop from './pages/SeveralShop' ;

import './App.css';
import Survey from './components/survey/Survey';
import Result from './pages/Result' ;
import { useSelector, useDispatch } from 'react-redux';
import { likeChange } from './actions/homePageInfo';
import { CSSTransition } from "react-transition-group";
import ShopModal from './pages/Shop';

function App() { 
  const dispatch = useDispatch();
  const shopPageIsOpen = useSelector((state) => state.homePageInfo.shopPageIsOpen);
  const shopPageContent = useSelector((state) => state.homePageInfo.shopPageContent);
  const currCategory = useSelector((state) => state.homePageInfo.currCategory);
  useEffect (() => {
    if (!shopPageIsOpen && shopPageContent) {
      const postList = async () => { 
        const res = await axios({
            method: 'POST',
            url: 'https://dough-survey.web.app/api/favorites',
            headers: {
                "Content-Type": `application/json`
            },
            data: {stationId: "cd853a8d-3376-55fb-858c-0d2bfa16aa48", userToken: '', action: shopPageContent.place_likes?"add":"delete", placeId: shopPageContent.place_uuid},
        }).then(response => {
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        });
      }
      // 임시로 home page에 있는 리스트에만 like 변경을 하는 코드(다른 페이지에선 like 변경 제대로 작동 안함) 
      // place api에서 호출할 때 like가 바뀌도록 데이터 설정해야함
      dispatch(likeChange(currCategory, shopPageContent.place_uuid, shopPageContent.place_likes)); 
      postList();
    }
  },[shopPageIsOpen]);
  return(
    <div className="viewPage" >
      <div className="layout" id="layout">
        <CSSTransition in={shopPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
          <ShopModal />
        </CSSTransition>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/recommend" component={Recommend} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/survey" component={Survey} />
            <Route exact path="/survey/result" component={Result} />
            <Route path="/shop/:stationId/:uuid" component={Shop} />
            <Route exact path="/favorite_main" component={FavoriteMainPage} />
            <Route path="/login/callback/kakao" component={Oauth} />
            <Route exact path="/favorite_station/:stationUUID/:placeCategory" component={FavoriteStationPage}/>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
