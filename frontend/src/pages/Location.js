import React, { useState, useEffect } from 'react';
import './Location.css';
import stationDictionary from '../data/station';
import { changeLocation, closeLocationPage } from '../actions/homePageInfo'
import CloseButton from '../components/icon/Close';
import { useDispatch, useSelector } from 'react-redux';

function LocationModal(props) {
    const currLocation = useSelector((state) => state.homePageInfo.currLocation);
    const dispatch = useDispatch();

    const [tempCurrLoc, setTempCurrLoc] = useState(currLocation.name);
    const [mainNav, setMainNav] = useState("지하철 노선");
    const [stationRangeNav, setStationRangeNav] = useState(currLocation.range === "none" ? "1호선~4호선" : currLocation.range);
    const stationRange = {"1호선~4호선": ["1호선", "2호선", "3호선", "4호선"],
                          "5호선~9호선": ["5호선", "6호선", "7호선", "8호선", "9호선"],
                          "기타": ["None"]};
    const [stationLineNav, setStationLineNav] = useState(currLocation.line === "none" ? stationRange[stationRangeNav][0] : currLocation.line);

    function changeRange (key) {
        if (key !== stationRangeNav){
            setStationRangeNav(key);
            setStationLineNav(stationRange[key][0]);
        }
    }
    function changeStation (station) {
        if (station === tempCurrLoc) {
            setTempCurrLoc("위치 선택");
        }
        else {
            setTempCurrLoc(station);
        }
    }

    function changeCurrLocation () {
        dispatch(changeLocation(tempCurrLoc, stationLineNav, stationRangeNav));
        if (tempCurrLoc !== currLocation.name) {
            goBack();
        }
    }
    
    const closePage = () => {
        dispatch(closeLocationPage())
        document.body.style.overflow = 'unset';
    };
    const goBack = () => {
        window.history.back();
        closePage();
    }
    useEffect (() => {
        window.history.pushState({page: "location_modal"}, "location_modal");
        window.addEventListener("popstate",closePage);
        return () => {
            window.removeEventListener("popstate",closePage);
        }
    }, []);

    return (
        <div className="locationPage">
            <div className="subHeader">
                위치 선택
                <div onClick={goBack} className="backButton"><CloseButton width={15} color={"rgba(0,0,0,0.9)"}/></div>
            </div>
            <div className="name">{"서울/ "}
                <span className={`currLoc ${tempCurrLoc === "위치 선택" ? "" : " active"}`}>{tempCurrLoc}</span>
            </div>
            <nav className="mainNav">
                <div className={mainNav === "지하철 노선" ? "active" : ""} onClick={()=>{setMainNav("지하철 노선")}}>지하철 노선</div>
                <div className={mainNav === "인기 지역" ? "popular active" : "popular"} onClick={()=>{setMainNav("인기 지역")}}>인기 지역</div>
            </nav>
            { mainNav === "지하철 노선" && <>
                <nav className="stationRange">
                    <div className={stationRangeNav === "1호선~4호선" ? "active" : ""} onClick={()=>changeRange("1호선~4호선")}>1호선~4호선</div>
                    <div className={stationRangeNav === "5호선~9호선" ? "active" : ""} onClick={()=>changeRange("5호선~9호선")}>5호선~9호선</div>
                    <div className={stationRangeNav === "기타" ? "active" : ""} onClick={()=>changeRange("기타")}>기타</div>
                </nav>
                <nav className="stationLine">
                    {stationRange[stationRangeNav].map((key)=>{
                        return <div className={stationLineNav === key ? "active" : ""} onClick={()=>{setStationLineNav(key)}} key={key}>{key}</div>
                    })}
                </nav>
                <div className="station" >
                    {Object.entries(stationDictionary[stationLineNav]).map((list) => {
                        if (list[1].length !== 0) {
                            return <div className="spellStation">
                                {list[1].map((station)=>{
                                    return <div onClick={()=>{changeStation(station)}} 
                                                className={`eachStation ${tempCurrLoc === station ? "active" : ""}`}>{station}</div>
                                })}
                                <span className="spell">{list[0]}</span>
                            </div>
                        }
                    })}
                </div>
            </> }

            <div onClick={()=>changeCurrLocation()} className={`selection ${tempCurrLoc !== currLocation.name ? "active" : ""}`}>
                선택 완료
            </div>
        </div>
    );
}

export default LocationModal;


