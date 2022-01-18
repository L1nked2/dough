import React from 'react'
import './FavoriteMainPage.css'

import Header from '../../components/common/Header'
import SubHeader from './components/SubHeader'
import CategorySelector from './components/CategorySelector'
import StationSwiperContainer from './components/StationSwiperContainer'
import Navbar from '../../components/common/Navbar'

function FavoriteMainPage(props){
  return (
    <div className="favoriteMainPage">
      <Header changeIsHome={props.changeIsHome}/>
      <SubHeader/>
      <CategorySelector/>
      <StationSwiperContainer/>
      <Navbar page="favorite"/>
    </div>
  );
}

export default FavoriteMainPage;