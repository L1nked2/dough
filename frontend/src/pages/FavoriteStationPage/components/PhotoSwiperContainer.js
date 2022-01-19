import React from 'react'
import './PhotoSwiperContainer.css'

import { Link } from 'react-router-dom'
 
function PhotoSwiperContainer(props){
  const showPlaceNotFood = props.showPlaceNotFood;
  const recentFirst = props.recentFirst;
// recentFirst or not에 따라 photoboxes의 정렬 reverse or not
// ThumbnialPhotoBox에 image link와 place uuid or name도 props로 보내줘야 함
  return (
    <div className='photoSwiperContainer'>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
      <ThumbnailPhotoBox showPlaceNotFood={showPlaceNotFood}/>
    </div>
  );
}

function ThumbnailPhotoBox(props){
  return (
    <div className="thumbnailPhotoBox">
      <Link to="/home">
      <img className='thumbnailPhoto' src="https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"/>
      {/* image link from props.placeThumbNail(props.showPlaceNotFood?Place:Food)Photo
      that does the following on click
      (1) dispatch `openShopPage` and `setShopPageContents` with payload=prosp.placeName or UUid
      (2) goto `/home`  */}
      </Link>
    </div>
  )
}

export default PhotoSwiperContainer;