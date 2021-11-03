import React from 'react'
import { useState, useEffect } from 'react'

import Home from './Home' 
import Session from './Session' 
import Favorite from './Favorite' 
import Profile from './Profile' 

import Navbar from '../components/Navbar'

import '../App.css'

function Main() {
    const [pageComponent, setPageComponent] = useState([true, false, false, false]);

    const changeIsHome = () => {setPageComponent([true, false, false, false]);}
    const changeIsSession = () => {setPageComponent([false, true, false, false]);}
    const changeIsFavorite = () => {setPageComponent([false, false, true, false]);}
    const changeIsProfile = () => {setPageComponent([false, false, false, true]);}

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageComponent])

    return(
        <div className="layout" >
            {pageComponent[0] && <Home changeIsHome={changeIsHome}/>}
            {pageComponent[1] && <Session changeIsHome={changeIsHome}/>}
            {pageComponent[2] && <Favorite changeIsHome={changeIsHome}/>}
            {pageComponent[3] && <Profile changeIsHome={changeIsHome}/>}
            <Navbar pageComponent={pageComponent} changeIsHome={changeIsHome} 
                    changeIsSession={changeIsSession} changeIsFavorite={changeIsFavorite} changeIsProfile={changeIsProfile}/>
        </div>
    );
}

export default Main;
