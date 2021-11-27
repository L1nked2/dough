import React, { useState } from 'react';
import './Shop.css';

function ShopModal(props) {
    const [like, setLike] = useState(false);

    return (
        <div className="shopPage">
            <div className="subHeader">
                <div onClick={props.closePage} className="backButton"><BackButton width={15}/></div>
            </div>
            <div className="name">{props.shopPageContents.name}</div>
            <div className="simpleInfo">
                <span><WonIcon width={10}/>1~2만원</span>
                <span><LocationIcon width={10}/>역에서 200m</span>
            </div>
            {props.shopPageContents.name}
            <div className="subNavbar">
                <div className="buttons">
                    <div className="likeButton" onClick={()=>{setLike(!like)}}>
                        {like?<HeartFilledIcon width={25}/>:<HeartIcon width={25}/>}
                        좋아요
                    </div>
                    <div className="shareButton"><ShareIcon width={22}/>공유</div>
                </div>
            </div>
        </div>
    );
}

export default ShopModal;

function BackButton(props){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 9.928 15.093">
            <path id="패스_885" data-name="패스 885" d="M0,7,6.135,0l6.135,7" transform="translate(1.517 13.682) rotate(-90)" fill="none" stroke="rgba(0,0,0,0.9)" stroke-linecap="round" stroke-width="2"/>
        </svg>
    );
}
function WonIcon(props){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 10 8">
            <path id="패스_853" data-name="패스 853" d="M231.5,7.5h-.337l.818-2.863a.5.5,0,0,0-.962-.275l-.9,3.137H228.6L227.47,4.332a.5.5,0,0,0-.941,0L225.4,7.5h-1.521l-.9-3.137a.5.5,0,0,0-.962.275l.818,2.863H222.5a.5.5,0,0,0,0,1h.622l.9,3.137a.5.5,0,0,0,.952.031L226.1,8.5h1.8l1.132,3.168A.5.5,0,0,0,229.5,12h.016a.5.5,0,0,0,.465-.363l.9-3.137h.622a.5.5,0,0,0,0-1ZM227,5.986l.54,1.514h-1.081Zm-2.447,3.878L224.163,8.5h.877Zm4.895,0L228.959,8.5h.877Z" transform="translate(-222 -4)" fill="rgba(0,0,0,0.65)"/>
        </svg>
    );
}

function LocationIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 11.2 11.2">
            <path id="패스_892" data-name="패스 892" d="M183.5,2A5.5,5.5,0,1,0,189,7.5,5.5,5.5,0,0,0,183.5,2Zm.55,9.862V11.3a.55.55,0,0,0-1.1,0v.557a4.4,4.4,0,0,1-3.812-3.812h.558a.55.55,0,1,0,0-1.1h-.558a4.4,4.4,0,0,1,3.812-3.812V3.7a.55.55,0,0,0,1.1,0V3.138a4.405,4.405,0,0,1,3.812,3.812H187.3a.55.55,0,1,0,0,1.1h.557A4.405,4.405,0,0,1,184.05,11.862Z" transform="translate(-177.9 -1.9)" fill="rgba(0,0,0,0.36)" stroke="#fff" stroke-width="0.2"/>
        </svg>
    );
}
function HeartIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20.008 17.998">
            <path id="패스_866" data-name="패스 866" d="M7.5,5a4,4,0,0,1,3,1.39l.76.89a1,1,0,0,0,1.52,0l.76-.89A4,4,0,0,1,16.5,5,3.49,3.49,0,0,1,20,8.35c.1,2.94-3.06,5.82-7.86,10.17h0l-.1.09-.13-.11C7.07,14.18,3.9,11.3,4,8.35A3.49,3.49,0,0,1,7.5,5m0-2A5.49,5.49,0,0,0,2,8.27c-.14,3.88,3.29,7,8.55,11.76l.78.71a1,1,0,0,0,1.34,0l.78-.7C18.7,15.27,22.13,12.16,22,8.28A5.5,5.5,0,0,0,16.5,3,6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3Z" transform="translate(-1.996 -3)" fill="#a3a3a3"/>
        </svg>
    );
}
function HeartFilledIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20.008 17.998">
            <path id="패스_866" data-name="패스 866" d="M7.5,3A5.49,5.49,0,0,0,2,8.27c-.14,3.88,3.29,7,8.55,11.76l.78.71a1,1,0,0,0,1.34,0l.78-.7C18.7,15.27,22.13,12.16,22,8.28A5.5,5.5,0,0,0,16.5,3,6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3Z" transform="translate(-1.996 -3)" fill="#f17474"/>
        </svg>
    );
}
function ShareIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 17.5 19.5">
            <g id="그룹_254" data-name="그룹 254" transform="translate(-184 -748)">
                <g id="타원_263" data-name="타원 263" transform="translate(195.5 749)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <g id="패스_6638" data-name="패스 6638" transform="translate(195.5 761.5)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <g id="타원_265" data-name="타원 265" transform="translate(185 755.5)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <line id="선_146" data-name="선 146" x1="5.5" y2="3" transform="translate(190.5 753.5)" fill="none" stroke="#a3a3a3" stroke-width="1.5"/>
                <line id="선_147" data-name="선 147" x2="5" y2="3" transform="translate(190.446 759)" fill="none" stroke="#a3a3a3" stroke-width="1.5"/>
            </g>
        </svg>
    );
}
