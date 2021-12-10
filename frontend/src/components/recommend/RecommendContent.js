import React, { useEffect } from 'react';
import './RecommendContent.css';

import SlideImages from '../common/SlideImages';

import ShareIcon from '../icon/Share';
import Chevron from '../icon/Chevron';


function RecommendContent(props) {
    const elem = props.elem;
    const index = props.index;
    const target = props.elem.target;
    
    function openListPage () {
        props.openListPage();
        props.setListPageContents({name: elem.mainTitle});
    }
    
    useEffect (() => {
        var shareButton = document.getElementById("shareButton");
        shareButton.addEventListener('click', function (event) {
            if (navigator.share){
                navigator.share({
                    title: "Web Share API",
                    url: "http://localhost:3000/main"
                }).then(() => {
                    console.log('share done');
                })
                .catch(console.error)
            }
            else {
                console.log('fail');
            }
        })
    },[])

    return (
        <div className={`recommendContent ${target?"specific":""}`} key={index}>
            {target && 
                <div className="target">{`for ${target}`}</div>
            }
            <div className="header">
                <div className="mainTitle">
                    {elem.mainTitle}
                    <div className="icon" onClick={openListPage}><Chevron width={"0.4em"} color={"rgba(0,0,0,0.9)"}/></div>
                </div>
                <div className="subTitle">{elem.subTitle}</div>
                <div className="icon" id="shareButton"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"} /></div>
            </div>
            <SlideImages 
                openModal={props.openShopPage} 
                setPageContents={props.setShopPageContents}
                info={elem.recommendInfo} 
                page="recContent"/>
        </div>
    );
}
  
export default RecommendContent;
  
