import React from 'react'
import { Link } from 'react-router-dom';
import './StationSwiperContainer.css'

function StationSwiperContainer(props){
  const userFavorites = props.userFavorites;  
  if (!userFavorites) return null; // it may take time to fetch from server
  const currCategory = props.category;
  const currStations = userFavorites[currCategory]; // {uuid: station_info} 

  if (Object.keys(currStations).length === 0){
    return (
      <div className="emptyStationContainer">
        아직 찜한 가게가 없습니다.
      </div>
    );
  }

  let stationBoxList = [];
  for (let stationUUID in currStations){
    stationBoxList.push(
      <StationBox key={stationUUID} 
        placeCategory={currCategory}
        stationUUID={stationUUID}
        stationName={currStations[stationUUID].station_name}
        stationPlaceNum={currStations[stationUUID].place_list.length}
        stationThumbNail={currStations[stationUUID].station_thumbnail_inside}
      />);
  }

  return (
    <div className="stationSwiperContainer">
    {stationBoxList}
    </div>
  );
}

function StationBox(props){

  return (
      <div className="stationBox">
        <Link className="stationBoxLink" to={`/favorite_station/${props.stationUUID}/${props.placeCategory}`}>
        <img className="stationBoxImg" src={props.stationThumbNail}></img>
        <span>{props.stationName}({props.stationPlaceNum}) </span>
        </Link>
      </div>
  );
}

export default StationSwiperContainer;