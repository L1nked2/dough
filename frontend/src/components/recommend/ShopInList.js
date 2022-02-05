import React, { useEffect, useRef, useState } from "react";
import {useDispatch, useSelector} from "react-redux";

import './ShopInList.css';
import SlideImages from "../common/SlideImages";
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"

import Chevron from '../icon/Chevron';
import WonIcon from '../icon/Won';
import LocationIcon from '../icon/Location';
import MapBoldIcon from '../icon/MapBold';
import MenuIcon from '../icon/Menu';
import HeartIcon from '../icon/HeartSub';
import HeartFilledIcon from '../icon/HeartFilled';
import ShareIcon from '../icon/Share';

function ShopInList (props) {
    const [elem, setElem] = useState(props.elem);
    const [fold, setFold] = useState(true);
    const detailed = useRef(null);
    const [detailedHeight, setDetailedHeight] = useState("0px");

    function unfold () {
        setFold(false);
    }
    useEffect (() => {
        setDetailedHeight(fold ? "0px" : `${detailed.current.scrollHeight}px`);
    }, [fold])

    
    const dispatch = useDispatch();
    const openPage = (shop) => {
        dispatch(openShopPage());
        document.body.style.overflow = 'hidden';
        dispatch(setShopPageContents({...shop, tag: 'myPlaceList'}));
    }
    return (
        <div className="shopInList">
            <div className="header">
                <div className="info" onClick={()=>{openPage(elem)}}>
                    <div className="nameAndButton">
                        <div className="name">{elem.name}</div>
                        <div className="moreButton"><Chevron width={"0.7em"} color={"rgba(0,0,0,0.9)"}/></div>
                    </div>
                    <div className="severalInfoSet" >
                        <div className="severalInfo">
                            <div className="button"><MapBoldIcon height={"1.2em"} color={"rgba(0,0,0,0.9)"}/></div>
                            <div>{elem.station}</div>
                        </div>
                        <div className="severalInfo">
                            <div className="button"><LocationIcon height={"1em"} color={"rgba(0,0,0,0.9)"}/></div>
                            <div>{elem.distance}</div>
                        </div>
                        <div className="severalInfo">
                            <div className="button"><WonIcon height={"0.8em"} color={"rgba(0,0,0,0.9)"}/></div>
                            <div>{elem.price}</div>
                        </div>
                        <div className="severalInfo">
                            <div className="button"><MenuIcon height={"1em"} color={"rgba(0,0,0,0.9)"}/></div>
                            <div>{elem.menu}</div>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <div className="button" onClick={()=>{setElem({...elem, like:!elem.like})}}>
                        { elem.like ? 
                        <HeartFilledIcon width={"2em"} color={"#f17474"}/> :
                        <HeartIcon width={"2em"} color={"rgba(0,0,0,0.9)"}/> }
                    </div>
                    <div className="button"><ShareIcon width={"2em"} color={"rgba(0,0,0,0.9)"}/></div>
                </div>
            </div>
            
            <div className="images">
                <SlideImages 
                    page="recListPage" 
                    contents={elem.placePhotoList}/>
            </div>

            <div className="description">
                <div className="simple">
                    {elem.summary}
                    {fold && <span className="more" onClick={unfold}>... 더보기</span>}
                </div>
                <div className="detailed" ref={detailed} style={{maxHeight: `${detailedHeight}`}}>
                    {elem.discription}
                    <div className="tags">{elem.tags}</div>
                </div>
            </div>
        </div>
    );
}

export default ShopInList;