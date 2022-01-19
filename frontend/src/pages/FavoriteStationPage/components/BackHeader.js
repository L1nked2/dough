import React from 'react'
import { Link } from 'react-router-dom'
import './BackHeader.css'

function BackHeader(props){
  const getPlaceCategoryInKorean = (placeCategoryEng) => {
    switch (placeCategoryEng){
      case "restr":
        return "식당";
      case "cafe":
        return "카페";
      case "bar":
        return "술집";
      default:
        console.error(`wrong place category ${placeCategoryEng} 
        passed to BackHeader`);
        return null;
    }
  }
  return (
    <div className="backHeader">
      <div className="backButton">
        <Link className="backHeaderLink" to="/favorite_main">
        ◁ 
        </Link>
      </div>
      <div className="stationInfo"> 
        {props.stationName}역 {getPlaceCategoryInKorean(props.placeCategory)} 
        ({props.stationNumPlaces}) 
      </div>
    </div>
  )
}

export default BackHeader;