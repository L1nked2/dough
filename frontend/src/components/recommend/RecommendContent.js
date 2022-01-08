import React, { useEffect } from 'react';
import './RecommendContent.css';

import SlideImages from '../common/SlideImages';

import ShareIcon from '../icon/Share';
import Chevron from '../icon/Chevron';
import { useDispatch } from 'react-redux';
import { openListPage, setListPageContents } from '../../actions/recommendPageInfo';


function RecommendContent(props) {
    const dispatch = useDispatch();
    const elem = props.elem;
    const index = props.index;
    const target = props.elem.target;
    const isSpecificType = props.isSpecificType;
    
    function openPage () {
        dispatch(openListPage());
        dispatch(setListPageContents(elem));
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
        <div className={`recommendContent ${isSpecificType?"specific":""}`} key={index}>
            {isSpecificType && 
                <div className="target">{`for ${target}`}</div>
            }
            <div className="header">
                <div className="mainTitle" onClick={openPage}>
                    {elem.mainText}
                    <div className="icon" ><Chevron width={"0.4em"} color={"rgba(0,0,0,0.9)"}/></div>
                </div>
                <div className="subTitle">{elem.subText}</div>
                <div className="icon" id="shareButton"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"} /></div>
            </div>
            <SlideImages page="recContent" contents={elem.contents} />
        </div>
    );
}
  
export default RecommendContent;
  
