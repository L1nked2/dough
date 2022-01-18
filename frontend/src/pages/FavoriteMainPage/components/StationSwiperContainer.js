import React from 'react'
import './StationSwiperContainer.css'

function StationSwiperContainer(props){
  // props.category 따라 station_obj_list 다른 것 받아온다
  // station_obj_list <-- from props (redundant axios get unnecessary)
  // station_obj = {station_name, station_pic_list}
  let currCategory = props.category;
  console.log(currCategory);

  let dummyRestrList = <div className="stationSwiperContainer">
  <StationBox stationName="강남" stationPlaceNum={10}/>
  <StationBox stationName="교대" stationPlaceNum={6}/>
  <StationBox stationName="상수" stationPlaceNum={2}/>
  <StationBox stationName="월곡" stationPlaceNum={5}/>
  <StationBox stationName="안암" stationPlaceNum={3}/>
  <StationBox stationName="을지로" stationPlaceNum={9}/> </div>;

  let dummyCafeList = <div className="stationSwiperContainer">
  <StationBox stationName="강남" stationPlaceNum={2}/>
  <StationBox stationName="교대" stationPlaceNum={4}/>
  <StationBox stationName="상수" stationPlaceNum={3}/>
  <StationBox stationName="월곡" stationPlaceNum={5}/>
  <StationBox stationName="안암" stationPlaceNum={10}/>
  <StationBox stationName="을지로" stationPlaceNum={9}/> </div>;

  let dummyBarList = null;

  const getListToShow = () => { 
    let listToShow;
    switch (currCategory) {
      case "restr":
        listToShow = dummyRestrList;
        break;
      case "cafe":
        listToShow = dummyCafeList;
        break;
      case "bar":
        listToShow = dummyBarList;
        break; 
      default:
        console.assert("should not happen");
    }
    if (listToShow === null){
      listToShow = <div> 아직 찜한 가게가 없습니다. </div>
    }
    return listToShow;
  }
  const listToShow = getListToShow();

  return listToShow;
}

function StationBox(props){

  let routeToFavoriteStationPage = () => {
    console.log("route to favorite station page with props.stationName")
    // route to FavoriteStationPage with `props.stationName` value
  }

  return (
    <div className="stationBox" onClick={routeToFavoriteStationPage}>
      {/*{props.stationPicList[0]} <br/> */}
      {props.stationName}역 사진 <br/>
      {props.stationName}({props.stationPlaceNum}) 
    </div>
  );
}

export default StationSwiperContainer;