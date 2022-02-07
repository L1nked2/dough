import React, { useState, useEffect } from 'react';
import './MoreShop.css';
import LocationIcon from '../icon/Location';
import MoreIcon from '../icon/More';
import sampleImage from "../../img/login_background.png";

import { useDispatch, useSelector } from 'react-redux';
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"

function MoreShop(props) {  
  const shopList = props.content;
  const renderShopList = shopList.map((shop, index) => {
    return (
      <EachMoreShop shop={shop} rank={index + 4} key={index} />
    );
  });
  return (
    <div className="moreShop">
      <div className="moreShopHeader">{`취향 맛집 더보기`}</div>
      { renderShopList }
    </div>
  );
}

function EachMoreShop(props) {
  const dispatch = useDispatch();
  const shop = props.shop;
  const openPage = () => {
    dispatch(openShopPage());
    dispatch(setShopPageContents({...shop, rank: props.rank, tag: 'myPlaceList'}));
    document.body.style.overflow = 'hidden';
  }

  return (
    <div onClick={openPage} className="eachShop" key={props.rank}>
      <div className="image">
        <div><div id="image" style={{backgroundImage: `url(${shop.place_main_photo_list[0]})`}}/></div>
      </div>
      <div className="information">
        <div className="rankAndDistance">
          <span id="rank">{`${props.rank}위`}</span>
          <span id="icon"><LocationIcon width={"1em"} color={"#A3A3A3"}/></span>
          <span id="distance">{`역에서 200m`}</span>
        </div>
        <div className="nameAndMenu">
          <div id="name">{shop.place_name.length > 20 ? shop.place_name.slice(0, 20)+"..." : shop.place_name}</div>
          <div id="menu">{shop.place_kind.join(', ').length > 20 ? shop.place_kind.join(', ').slice(0, 20)+"..." : shop.place_kind.join(', ')}</div>
        </div>
        <div className="subimages">
          <div><div id="subimage" style={{backgroundImage: `url(${shop.place_main_photo_list[1]})`}}/></div>
          <div><div id="subimage" style={{backgroundImage: `url(${shop.place_main_photo_list[2]})`}}/></div>
          <span id="plusButton"><MoreIcon width={15}/></span>
        </div>
      </div>
    </div>
  );
}

export default MoreShop;