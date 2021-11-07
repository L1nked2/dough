import React, {useState, useEffect } from 'react';
import SlideImages from '../components/SlideImages'
import './MyShop.css';

function MyShop(props) {
  const [slideCategory, setSlideCategory] = useState([true, false, false]);
  const changeRestaurant = () => {setSlideCategory([true, false, false]);}
  const changeCafe = () => {setSlideCategory([false, true, false]);}
  const changeBar = () => {setSlideCategory([false, false, true]);}

  return (
    <div className="myShop">
      <div className="myShopHeader">
        <span id="myShop">내 취향 가게</span>
        <span className="locationButton"><MapIcon width={18}/><span id="location">서울/강남역</span></span>
      </div>
      <nav className="shopCategory">
        <div className={slideCategory[0] ? "active" : ""} onClick={changeRestaurant}>음식점</div>
        <div className={slideCategory[1] ? "active" : ""} onClick={changeCafe}>카페</div>
        <div className={slideCategory[2] ? "active" : ""} onClick={changeBar}>술집</div>
      </nav>
      {slideCategory[0] && <SlideImages name="restaurant"/>}
      {slideCategory[1] && <SlideImages name="cafe"/>}
      {slideCategory[2] && <SlideImages name="bar"/>}
    </div>
  );
}

export default MyShop;

function MapIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 13.253 18.234">
      <g id="그룹_223" data-name="그룹 223" transform="translate(-92.75 -2.016)">
        <path id="패스_860" data-name="패스 860" d="M99.377,2.266A6.372,6.372,0,0,0,93,8.643c0,3.8,4.025,9.037,5.68,11.03a.9.9,0,0,0,1.394,0c1.654-1.992,5.68-7.229,5.68-11.03A6.372,6.372,0,0,0,99.377,2.266ZM94.822,8.643a4.555,4.555,0,1,1,9.109,0c0,2.623-2.623,6.55-4.555,9C97.482,15.21,94.822,11.239,94.822,8.643Z" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.5"/>
        <circle id="타원_112" data-name="타원 112" cx="2.277" cy="2.277" r="2.277" transform="translate(97.099 6.365)" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.5"/>
      </g>
    </svg>

  );
}
