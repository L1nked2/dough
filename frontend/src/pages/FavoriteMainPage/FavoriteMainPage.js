import React, {useState} from 'react'
import './FavoriteMainPage.css'

import Header from '../../components/common/Header'
import SubHeader from './components/SubHeader'
import CategorySelector from './components/CategorySelector'
import StationSwiperContainer from './components/StationSwiperContainer'
import Navbar from '../../components/common/Navbar'

function FavoriteMainPage(props){
  const [category, setCategory] = useState("restr") // ["restr", "cafe", "bar"] 

  return (
    <div className="favoriteMainPage">
      <Header changeIsHome={props.changeIsHome}/>
      <SubHeader/>
      <CategorySelector 
        category={category} 
        setCategory ={(newCategory)=>{setCategory(newCategory)}} 
      />
      <StationSwiperContainer category={category}/>
      <Navbar page="favorite"/>
    </div>
  );
}

export default FavoriteMainPage;