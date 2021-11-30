import React, { useState, useEffect } from 'react';
import './Location.css';
import stationDictionary from '../data/station';

function LocationModal(props) {
    const [currLoc, setCurrLoc] = useState(props.currLocation.name);
    const [mainNav, setMainNav] = useState("지하철 노선");
    const [stationRangeNav, setStationRangeNav] = useState(props.currLocation.range === "none" ? "1호선~4호선" : props.currLocation.range);
    const stationRange = {"1호선~4호선": ["1호선", "2호선", "3호선", "4호선"],
                          "5호선~9호선": ["5호선", "6호선", "7호선", "8호선", "9호선"],
                          "기타": ["None"]};
    const [stationLineNav, setStationLineNav] = useState(props.currLocation.line === "none" ? stationRange[stationRangeNav][0] : props.currLocation.line);

    function changeRange (key) {
        if (key !== stationRangeNav){
            setStationRangeNav(key);
            setStationLineNav(stationRange[key][0]);
        }
    }
    function changeStation (station) {
        if (station === currLoc) {
            setCurrLoc("위치 선택");
        }
        else {
            setCurrLoc(station);
        }
    }

    function changeCurrLocation () {
        props.setCurrLocation({name: currLoc, line: stationLineNav, range: stationRangeNav});
        if (currLoc !== props.currLocation.name) {
            props.closePage();
        }
    }

    const goBack = () => {
        window.history.back();
        props.closePage();
    }
    useEffect (() => {
        window.history.pushState({page: "location_modal"}, "location_modal");
        window.addEventListener("popstate",props.closePage);
        return () => {
            window.removeEventListener("popstate",props.closePage);
        }
    }, []);

    return (
        <div className="locationPage">
            <div className="subHeader">
                위치 선택
                <div onClick={goBack} className="backButton"><CloseButton width={15}/></div>
            </div>
            <div className="name">{"서울/ "}
                <span className={`currLoc ${currLoc === "위치 선택" ? "" : " active"}`}>{currLoc}</span>
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
                        return <div className={stationLineNav === key ? "active" : ""} onClick={()=>{setStationLineNav(key)}}>{key}</div>
                    })}
                </nav>
                <div className="station" >
                    {Object.entries(stationDictionary[stationLineNav]).map((list) => {
                        if (list[1].length !== 0) {
                            return <div className="spellStation">
                                {list[1].map((station)=>{
                                    return <div onClick={()=>{changeStation(station)}} 
                                                className={`eachStation ${currLoc === station ? "active" : ""}`}>{station}</div>
                                })}
                                <span className="spell">{list[0]}</span>
                            </div>
                        }
                    })}
                </div>
            </> }

            <div onClick={()=>changeCurrLocation()} className={`selection ${currLoc !== props.currLocation.name ? "active" : ""}`}>
                선택 완료
            </div>
        </div>
    );
}

export default LocationModal;


function CloseButton(props){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 12.729 12.728">
            <path id="선_34" data-name="선 34" d="M15,.75H0A.75.75,0,0,1-.75,0,.75.75,0,0,1,0-.75H15a.75.75,0,0,1,.75.75A.75.75,0,0,1,15,.75Z" transform="translate(1.061 1.061) rotate(45)" fill="rgba(0,0,0,0.9)"/>
            <path id="선_36" data-name="선 36" d="M0,15.75A.75.75,0,0,1-.75,15V0A.75.75,0,0,1,0-.75.75.75,0,0,1,.75,0V15A.75.75,0,0,1,0,15.75Z" transform="translate(11.668 1.061) rotate(45)" fill="rgba(0,0,0,0.9)"/>
        </svg>
    );
}

