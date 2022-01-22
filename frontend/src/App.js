import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/Home';
import Recommend from './pages/Recommend';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import Login from './pages/Login' ;
import Oauth from './pages/Oauth' ;

import './App.css';
import Survey from './components/survey/Survey';
import Result from './pages/Result' ;
import { useSelector } from 'react-redux';
import { CSSTransition } from "react-transition-group";
import ShopModal from './pages/Shop';

function App() {  
  const shopPageIsOpen = useSelector((state) => state.homePageInfo.shopPageIsOpen);
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
            <Route exact path="/favorite" component={Favorite} />
            <Route exact path="/profile" component={Profile} />

            <Route exact path="/survey" component={Survey} />
            <Route exact path="/survey/result" component={Result} />

            <Route path="/login/callback/kakao" component={Oauth} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
