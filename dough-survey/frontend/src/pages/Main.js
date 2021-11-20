import React from 'react'
import { useState, useEffect } from 'react'

import Home from './Home' 
import Session from './Session' 
import Favorite from './Favorite' 
import Profile from './Profile' 

import Navbar from '../components/common/Navbar'

import '../App.css'

function Main() {
    const [pageComponent, setPageComponent] = useState([true, false, false, false]);

    const changeIsHome = () => {setPageComponent([true, false, false, false]);}
    const changeIsSession = () => {setPageComponent([false, true, false, false]);}
    const changeIsFavorite = () => {setPageComponent([false, false, true, false]);}
    const changeIsProfile = () => {setPageComponent([false, false, false, true]);}

    const changeState =  {changeToHome: changeIsHome,
                          changeToSession: changeIsSession,
                          changeToFavorite: changeIsFavorite,
                          changeToProfile: changeIsProfile};
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageComponent])
    
    return(
        <div className="layout" >
            {pageComponent[0] && <Home changeState={changeState}/>}
            {pageComponent[1] && <Session changeState={changeState}/>}
            {pageComponent[2] && <Favorite changeState={changeState}/>}
            {pageComponent[3] && <Profile changeState={changeState}/>}
            <Navbar pageComponent={pageComponent} changeState={changeState} />
        </div>
    );
}

export default Main;
