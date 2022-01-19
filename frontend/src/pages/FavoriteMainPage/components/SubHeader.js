import React from 'react'
import './SubHeader.css'
import HeartFilledIcon from '../../../components/icon/HeartFilled';

function SubHeader(props){
  return (
    <div className="subHeader">
      <HeartFilledIcon color="pink" width="24px" height="24px"/>
      <div className="likedPlace">찜한 가게</div>
    </div>
  );
}

export default SubHeader;