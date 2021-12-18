import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Home from './pages/Home';
import Recommend from './pages/Recommend';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import Login from './pages/Login' ;
import Oauth from './pages/Oauth' ;

import './App.css';

function App() {  
  return(
    <div className="viewPage" >
      <div className="layout" id="layout">
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/recommend" component={Recommend} />
            <Route exact path="/favorite" component={Favorite} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/login/callback/kakao" component={Oauth} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
