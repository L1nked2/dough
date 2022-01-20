import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './FavoriteStationPage.css'

import BackHeader from './components/BackHeader'
import PhotoFilterSelector from './components/PhotoFilterSelector'
import PhotoSwiperContainer from './components/PhotoSwiperContainer'

function FavoriteStationPage(props){  
  const [showPlaceNotFood, setShowPlaceNotFood] = useState(true);
  const [recentFirst, setRecentFirst] = useState(true);

  const userFavorites = useSelector((state) => state.userFavorites.userFavorites);

  const stationName = props.match.params.stationName;
  const placeCategory = props.match.params.placeCategory;
  if (!stationName || !placeCategory){
    console.error("/stationName/placeCategory was not passed to /favorite_station")
    return (
      <div>
        "잘못된 주소입니다."
      </div>
    );
  }

  // stationName으로 부터 아래 정보들을 받아온다
  const stationNumPlaces = 10
  const stationPhotos = ["link1", "link2", "link3", "link4"]

  return (
    <div className="favoriteStationPage">
      <BackHeader 
        stationName={stationName} placeCategory={placeCategory}
        stationNumPlaces={stationNumPlaces}  
      />
      <PhotoFilterSelector
        showPlaceNotFood={showPlaceNotFood}
        setShowPlaceNotFood={setShowPlaceNotFood}
        recentFirst={recentFirst}
        setRecentFirst={setRecentFirst}
      />
      <PhotoSwiperContainer
        showPlaceNotFood={showPlaceNotFood}
        recentFirst={recentFirst}
      />
    </div>
  );
}

export default FavoriteStationPage;