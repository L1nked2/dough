import React, {useState, useEffect } from 'react';
import './MoreShop.css';

import sampleImage from "../../img/login_background.png";

function MoreShop(props) {  
  const shopList = [ 
    { rank: 4, name: '임실치돈', distance: 10 },
    { rank: 5, name: '바른돈가', distance: 10 },
    { rank: 6, name: '정돈', distance: 10 }
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
          <Location id="icon" width={16}/>
          <span id="distance">{`${props.shop.distance}분 거리`}</span>
        </div>
        <div className="name">{props.shop.name}</div>
        <div className="subimages">
          <div id="subimage" style={{backgroundImage: `url(${sampleImage})`}}/>
          <div id="subimage" style={{backgroundImage: `url(${sampleImage})`}}/>
          <div id="plusButton"><Plus width={25}/></div>
        </div>
      </div>
    </div>
  );
}


function Location(props) {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 11.2 11.2">
      <path id="패스_892" data-name="패스 892" d="M183.5,2A5.5,5.5,0,1,0,189,7.5,5.5,5.5,0,0,0,183.5,2Zm.55,9.862V11.3a.55.55,0,0,0-1.1,0v.557a4.4,4.4,0,0,1-3.812-3.812h.558a.55.55,0,1,0,0-1.1h-.558a4.4,4.4,0,0,1,3.812-3.812V3.7a.55.55,0,0,0,1.1,0V3.138a4.405,4.405,0,0,1,3.812,3.812H187.3a.55.55,0,1,0,0,1.1h.557A4.405,4.405,0,0,1,184.05,11.862Z" transform="translate(-177.9 -1.9)" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.2"/>
    </svg>
  );
}

function Plus(props) {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 22 22">
      <circle id="타원_267" data-name="타원 267" cx="11" cy="11" r="11" fill="rgba(0,0,0,0.18)" opacity="0.26"/>
      <g id="그룹_261" data-name="그룹 261" transform="translate(-2682.444 -3158.556)">
        <path id="패스_896" data-name="패스 896" d="M193.573,51.229h-4.261V46.967a1.041,1.041,0,0,0-1.041-1.041h0a1.041,1.041,0,0,0-1.041,1.041v4.261h-4.261a1.041,1.041,0,0,0-1.041,1.041h0a1.041,1.041,0,0,0,1.041,1.041h4.261v4.261a1.041,1.041,0,0,0,1.041,1.041h0a1.041,1.041,0,0,0,1.041-1.041V53.311h4.261a1.041,1.041,0,0,0,1.041-1.041h0A1.041,1.041,0,0,0,193.573,51.229Z" transform="translate(2505.174 3117.285)" fill="#a4a4a4"/>
      </g>
    </svg>
  );
}  

export default MoreShop;