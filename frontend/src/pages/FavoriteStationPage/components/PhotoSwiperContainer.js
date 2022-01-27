import React from 'react'
import './PhotoSwiperContainer.css'

import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { openShopPage, setShopPageContents } from '../../../actions/homePageInfo'

function PhotoSwiperContainer(props){
  const showPlaceNotFood = props.showPlaceNotFood;
  const recentFirst = props.recentFirst;
  const placeList = props.placeList;

  const thumbnailPhotoList = placeList.map((placeInfo) => 
    <ThumbnailPhotoBox key={placeInfo.place_uuid}
      thumbnailPhoto={showPlaceNotFood? 
        placeInfo.place_thumbnail_inside : placeInfo.place_thumbnail_food}
      placeUuid={placeInfo.place_uuid}
    />
  );

  // current assumption : older one at head of the array
  const sortedThumbnailPhotoList = recentFirst? 
    thumbnailPhotoList.slice().reverse() : thumbnailPhotoList;

  return (
    <div className='photoSwiperContainer'>
      {sortedThumbnailPhotoList}
    </div>
  );
}

function ThumbnailPhotoBox(props){
  const dispatch = useDispatch();
  const openCurrentPlacePageAtHome = () => {
    const date = new Date();
    console.log(date.getSeconds());
    axios({
      method: 'get',
      url: 'https://dough-survey.web.app/api/info/place',
      headers: {
          "Content-type" : "application/json"
      },
      data : {
          placeId : props.placeUuid, //"002b7a00-95a7-52a1-8e81-6338fea1d6c2",
          stationId : "",
      }
    }).then( (response) => {
      const date = new Date();
      console.log(date.getSeconds() + "after");

      dispatch(setShopPageContents(response.data.placeInfo));
      dispatch(openShopPage());
    });
  };

  return (
    <div className="thumbnailPhotoBox" onClick={openCurrentPlacePageAtHome}>  
      <img className='thumbnailPhoto' src={props.thumbnailPhoto}/>
    </div>
  )
}

export default PhotoSwiperContainer;