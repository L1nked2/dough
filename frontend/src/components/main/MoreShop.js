import React, {useState, useEffect } from 'react';
import './MoreShop.css';
import LocationIcon from '../icon/Location';
import MoreIcon from '../icon/More';
import sampleImage from "../../img/login_background.png";

import { useDispatch, useSelector } from 'react-redux';
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"

function MoreShop(props) {  
  const shopList = useSelector(state => state.myPlaceList).slice(3);

  const renderShopList = shopList.map(shop => {
    return (
      <EachMoreShop shop={shop} key={shop.rank} />
    );
  });
  return (
    <div className="moreShop">
      <div className="moreShopHeader">{`취향 맛집 더보기 (${props.name})`}</div>
      {!shopList.length ? <div className="nullList"></div> : renderShopList }
    </div>
  );
}

function EachMoreShop(props) {
  const dispatch = useDispatch();
  const shop = props.shop;
  const openPage = () => {
    dispatch(openShopPage());
    dispatch(setShopPageContents({...shop, tag: 'myPlaceList'}));
  }

  return (
    <div onClick={openPage} className="eachShop" key={props.key}>
      <div className="image">
        <div id="image" style={{backgroundImage: `url(${sampleImage})`}}/>
      </div>
      <div className="information">
        <div className="rankAndDistance">
          <span id="rank">{`${props.shop.rank}위`}</span>
          <span id="icon"><LocationIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/></span>
          <span id="distance">{`${props.shop.distance}분 거리`}</span>
        </div>
        <div className="nameAndMenu">
          <span id="name">{props.shop.name}</span>
          <span id="menu">{props.shop.menu}</span>
        </div>
        <div className="subimages">
          <div id="subimage" style={{backgroundImage: `url(${sampleImage})`}}/>
          <div id="subimage" style={{backgroundImage: `url(${sampleImage})`}}/>
          <div id="plusButton"><MoreIcon width={15}/></div>
        </div>
      </div>
    </div>
  );
}

export default MoreShop;