import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './FavoriteStationPage.css'

import BackHeader from './components/BackHeader'
import PhotoFilterSelector from './components/PhotoFilterSelector'
import PhotoSwiperContainer from './components/PhotoSwiperContainer'

function FavoriteStationPage(props){  
  // state
  const [showPlaceNotFood, setShowPlaceNotFood] = useState(true);
  const [recentFirst, setRecentFirst] = useState(true);

  // get global state
  const userFavorites = useSelector((state) => state.userFavorites.userFavorites);

  // get value passed from link
  const stationUUID = props.match.params.stationUUID;
  const placeCategory = props.match.params.placeCategory;
  if (!stationUUID || !placeCategory){
    console.error("/stationName/placeCategory was not passed to /favorite_station")
    return (
      <div>
        "잘못된 주소입니다."
      </div>
    );
  }

  // extract info about current station & category
  const currStationInfo = userFavorites[placeCategory][stationUUID];
  const stationName = currStationInfo.station_name;
  const placeList = currStationInfo.place_list;

  return (
    <div className="favoriteStationPage">
      <BackHeader 
        stationName={stationName} placeCategory={placeCategory}
        stationNumPlaces={placeList.length}  
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
        placeList={placeList}
        stationUuid={stationUUID}
      />
    </div>
  );
}

export default FavoriteStationPage;