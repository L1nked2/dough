import React from 'react'
import './PhotoSwiperContainer.css'

import { Link } from 'react-router-dom'

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
    console.log("will fetch shop content from server with place uuid");
    // dispatch(openShopPage());
    // const shopContent = {};
    // dispatch(setShopPageContents(shopContent));
  };

  return (
    <div className="thumbnailPhotoBox" onClick={openCurrentPlacePageAtHome}>
      <Link to="/home">
      <img className='thumbnailPhoto' src={props.thumbnailPhoto}/>
      </Link>
    </div>
  )
}

export default PhotoSwiperContainer;