import React from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Home from './pages/Home' 
import Session from './pages/Session' 
import Favorite from './pages/Favorite' 
import Profile from './pages/Profile' 

import Navbar from './components/Navbar'
import './App.css'


function App() {
  // return (
  //   <div className="viewPage" >
  //     <div className="layout" >
  //       <Header />
  //       <Router>
  //         <Switch>
  //           <Route exact path="/" component={Home} />
  //           <Route path="/session" component={Session} />
  //           <Route path="/profile" component={Profile} />
  //         </Switch>
  //       </Router>
  //       <Navbar />
  //     </div>
  //   </div>
  // );

  const [pageComponent, setPageComponent] = useState([true, false, false, false]);

  const changeIsHome = () => {setPageComponent([true, false, false, false]);}
  const changeIsSession = () => {setPageComponent([false, true, false, false]);}
  const changeIsFavorite = () => {setPageComponent([false, false, true, false]);}
  const changeIsProfile = () => {setPageComponent([false, false, false, true]);}

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageComponent])

  return(
    <div className="viewPage" >
      <div className="layout" >
        {pageComponent[0] && <Home changeIsHome={changeIsHome}/>}
        {pageComponent[1] && <Session changeIsHome={changeIsHome}/>}
        {pageComponent[2] && <Favorite changeIsHome={changeIsHome}/>}
        {pageComponent[3] && <Profile changeIsHome={changeIsHome}/>}
        <Navbar pageComponent={pageComponent} changeIsHome={changeIsHome} 
                changeIsSession={changeIsSession} changeIsFavorite={changeIsFavorite} changeIsProfile={changeIsProfile}/>
      </div>
    </div>
  );
}

export default App;
