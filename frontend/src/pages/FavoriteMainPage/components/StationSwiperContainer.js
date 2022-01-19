import React from 'react'
import { Link } from 'react-router-dom';
import './StationSwiperContainer.css'

function StationSwiperContainer(props){
  // props.category 따라 station_obj_list 다른 것 받아온다
  // station_obj_list <-- from props (redundant axios get unnecessary)
  // station_obj = {station_name, station_pic_list}
  let currCategory = props.category;
  console.log(currCategory);

  let dummyRestrList = <div className="stationSwiperContainer">
  <StationBox placeCategory={currCategory} stationName="강남" stationPlaceNum={10}/>
  <StationBox placeCategory={currCategory} stationName="교대" stationPlaceNum={6}/>
  <StationBox placeCategory={currCategory} stationName="상수" stationPlaceNum={2}/>
  <StationBox placeCategory={currCategory} stationName="월곡" stationPlaceNum={5}/>
  <StationBox placeCategory={currCategory} stationName="안암" stationPlaceNum={3}/>
  <StationBox placeCategory={currCategory} stationName="을지로" stationPlaceNum={9}/> </div>;

  let dummyCafeList = <div className="stationSwiperContainer">
  <StationBox placeCategory={currCategory} stationName="강남" stationPlaceNum={2}/>
  <StationBox placeCategory={currCategory} stationName="교대" stationPlaceNum={4}/>
  <StationBox placeCategory={currCategory} stationName="상수" stationPlaceNum={3}/>
  <StationBox placeCategory={currCategory} stationName="월곡" stationPlaceNum={5}/>
  <StationBox placeCategory={currCategory} stationName="안암" stationPlaceNum={10}/>
  <StationBox placeCategory={currCategory} stationName="을지로" stationPlaceNum={9}/> </div>;

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

  return (
      <div className="stationBox">
        <Link className="stationBoxLink" to={`/favorite_station/${props.stationName}/${props.placeCategory}`}>
        {/*{props.stationThumbnail} <br/> */}
        <img className="stationBoxImg" src="https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"></img>
        <span>{props.stationName}({props.stationPlaceNum}) </span>
        </Link>
      </div>
  );
}

export default StationSwiperContainer;