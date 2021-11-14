import React, { useState } from 'react';
import './Shop.css';

function ShopModal(props) {
    return (
        <div className="shopPage">
            <div className="subHeader">
                <div onClick={props.closePage} className="backButton"><BackButton width={15}/></div>
            </div>
            {props.shopPageContents.name}
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            {props.shopPageContents.name}
            <div className="subNavbar"></div>
        </div>
    );
}

function BackButton(props){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 9.928 15.093">
            <path id="패스_885" data-name="패스 885" d="M0,7,6.135,0l6.135,7" transform="translate(1.517 13.682) rotate(-90)" fill="none" stroke="rgba(0,0,0,0.9)" stroke-linecap="round" stroke-width="2"/>
        </svg>
    );
}

export default ShopModal;