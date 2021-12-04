import React, {useState, useEffect } from 'react';
import './MoreShop.css';
import LocationIcon from '../icon/Location';
import MoreIcon from '../icon/More';
import sampleImage from "../../img/login_background.png";

function MoreShop(props) {  
  const shopList = [ 
    { rank: 4, name: '임실치돈', distance: 10, menu: '돈가스' },
    { rank: 5, name: '바른돈가', distance: 10, menu: '분식'},
    { rank: 6, name: '정돈', distance: 10, menu: '마라탕,양꼬치' }
  ]; /* example lists */

  const renderShopList = shopList.map(shop => {
    return (
      <EachMoreShop openModal={props.openModal} setShopPageContents={props.setShopPageContents} key={shop.rank} shop={shop} />
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
  const openShopPage = () => {
    props.openModal();
    props.setShopPageContents({name: props.shop.name});
  }

  return (
    <div onClick={openShopPage} className="eachShop">
      <div className="image">
        <div id="image" style={{backgroundImage: `url(${sampleImage})`}}/>
      </div>
      <div className="information">
        <div className="rankAndDistance">
          <span id="rank">{`${props.shop.rank}위`}</span>
          <LocationIcon id="icon" width={"1em"} color={"rgba(0,0,0,0.65)"}/>
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