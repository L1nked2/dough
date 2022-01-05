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
        <div id="image" style={{backgroundImage: `url(${shop.place_main_photo_list[0]})`}}/>
      </div>
      <div className="information">
        <div className="rankAndDistance">
          <span id="rank">{`${props.rank}위`}</span>
          <span id="icon"><LocationIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/></span>
          <span id="distance">{`역에서 200m`}</span>
        </div>
        <div className="nameAndMenu">
          <span id="name">{shop.place_name}</span>
          <span id="menu">{shop.place_kind[0]}</span>
        </div>
        <div className="subimages">
          <div id="subimage" style={{backgroundImage: `url(${shop.place_main_photo_list[1]})`}}/>
          <div id="subimage" style={{backgroundImage: `url(${shop.place_main_photo_list[2]})`}}/>
          <div id="plusButton"><MoreIcon width={15}/></div>
        </div>
      </div>
    </div>
  );
}

export default MoreShop;