import React from 'react'
import './PhotoFilterSelector.css'

function PhotoFilterSelector(props){
  const [showPlaceNotFood, setShowPlaceNotFood] = 
    [props.showPlaceNotFood, props.setShowPlaceNotFood];
  const [recentFirst, setRecentFirst] = 
    [props.recentFirst, props.setRecentFirst];

  let placePhotoName = (showPlaceNotFood) ? "photoSelected" : "photoNotSelected";
  let foodPhotoName = (showPlaceNotFood) ? "photoNotSelected" : "photoSelected";
  let isRecentName = (recentFirst) ? "timeSelected" : "timeNotSelected";
  let isOldName = (recentFirst) ? "timeNotSelected" : "timeSelected";

  return (
    <div className="photoFilterSelector">
      <div onClick={()=>setShowPlaceNotFood(true)} className={placePhotoName}>
        공간사진
      </div>
      <div onClick={()=>setShowPlaceNotFood(false)} className={foodPhotoName}>
        음식사진
      </div>
      <div onClick={()=>setRecentFirst(true)} className={isRecentName}>
        최근 추가된 순
      </div>
      <div onClick={()=>setRecentFirst(false)} className={isOldName}>
        오래된 순
      </div>
    </div>
  );
}

export default PhotoFilterSelector;
