import React from 'react'
import { Route, Switch, BrowserRouter as Router , Redirect, useHistory } from 'react-router-dom'
// import { Redirect } from 'react-router';
import { useState, useEffect } from 'react'

import Main from './pages/Main'
import Login from './pages/Login' 
import Oauth from './pages/Oauth' 

import './App.css'

function App() {  
  let history = useHistory();
  return(
    <div className="viewPage" >
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/main" component={Main} />
          <Route path="/login/callback/kakao" component={Oauth} />
          <Redirect from="/login/auth" to="/main" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
