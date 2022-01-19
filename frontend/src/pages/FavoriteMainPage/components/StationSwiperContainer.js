import React from 'react'
import { Link } from 'react-router-dom';
import './StationSwiperContainer.css'

function StationSwiperContainer(props){
  const userFavorites = props.userFavorites;  
  if (!userFavorites) return null; // it may take time to fetch from server
  const currCategory = props.category;
  const currStations = userFavorites[currCategory]; // {uuid: station_info} 
  
  let stationBoxList = [];
  for (let stationUUID in currStations){
    stationBoxList.push(
      <StationBox placeCategory={currCategory}
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
        <Link className="stationBoxLink" to={`/favorite_station/${props.stationName}/${props.placeCategory}`}>
        <img className="stationBoxImg" src={props.stationThumbNail}></img>
        <span>{props.stationName}({props.stationPlaceNum}) </span>
        </Link>
      </div>
  );
}

export default StationSwiperContainer;