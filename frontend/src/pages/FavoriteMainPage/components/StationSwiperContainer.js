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

  // sort in ASCII order
  stationBoxList.sort( (stationBoxA, stationBoxB) =>  -(stationBoxA.stationName < stationBoxB.stationName))

  // dirty trick for equal height between multiple rows
  // since flex does not support it 
  // reference : https://stackoverflow.com/questions/36004926/equal-height-rows-in-a-flex-container
  let pairsList = new Array();
  for (let i=0; i<stationBoxList.length; i+=2){
    let fstBox = stationBoxList[i];
    let sndBox = (i+1<stationBoxList.length) ? stationBoxList[i+1] : null;

    const pair = <div className="twoBoxes" key={fstBox.key}>
      {fstBox}
      {sndBox}
    </div>;

    pairsList.push(pair);
  }

  return (
    <div className="stationSwiperContainer">
    {pairsList}
    </div>
  );
}

function StationBox(props){
  const figcaption_str_len = props.stationName.length + 
    String(props.stationPlaceNum).length;

  const figcaption_position = 40 - (figcaption_str_len-4)*2.5;
  const figcatpion_position_str = String(figcaption_position) + "%";

  return (
      <div className="stationBox">
        <Link className="stationBoxLink" to={`/favorite_station/${props.stationUUID}/${props.placeCategory}`}>
          <img className="stationBoxImg" src={props.stationThumbNail}></img>
          <figcaption style={{left:figcatpion_position_str}}>{props.stationName}({props.stationPlaceNum}) </figcaption>
        </Link>
      </div>
  );
}

export default StationSwiperContainer;