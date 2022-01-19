import React from 'react'
import './FavoriteStationPage.css'

// import BackHeader from './components/BackHeader'
// import PhotoFilterSelector from './components/PhotoFilterSelector'
// import PhotoSwiperContainer from './components/PhotoSwiperContainer'

function FavoriteStationPage(props){  

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
      {stationName}역 {placeCategory} 입니다.
      {/* <BackHeader stationName={stationName} stationNumPlaces={stationNumPlaces}/>
      <PhotoFilterSelector/>
      <PhotoSwiperContainer/> */}
    </div>
  );
}

export default FavoriteStationPage;