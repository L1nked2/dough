import React, { useState } from 'react';
import './Contents.css';

import SlideImages from '../common/SlideImages';

import QuestionMarkIcon from '../icon/QuestionMark';
import ShareIcon from '../icon/Share';
import Chevron from '../icon/Chevron';

import sampleImage from "../../img/login_background.png";

function RecommendContents(props) {

    const myType = "주택가 레스토랑";
    const mainTitle = "따뜻한 감성의\n강남역 주변 카페 4곳";
    const subTitle = "따뜻한 감성을 지닌 강남역 주변 카페";

    const recommendInfo = [
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
    ]

    const contents = [
        {
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        },
        {
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        }
    ]
    return (
        <div>
            <div className="myType" >
                <span className="light">내 취향 유형</span><span className="light">|</span>
                <span className="dark">{myType}</span>
                <div  className="click"><QuestionMarkIcon width={"1em"} color={"rgba(0,0,0,0.65"}/></div>
            </div>
            {contents.map((elem, index) => {
                return (
                    <div className="recommendContent" key={index}>
                        <div className="header">
                            <div className="mainTitle">
                                {elem.mainTitle}
                                <div className="icon"><Chevron width={"0.4em"} color={"rgba(0,0,0,0.9)"}/></div>
                            </div>
                            <div className="subTitle">{elem.subTitle}</div>
                            <div className="icon"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"} /></div>
                        </div>
                        <SlideImages 
                            info={elem.recommendInfo} 
                            page="recContent"/>
                    </div>
                );
            })}
        </div>
    );
}
  
export default RecommendContents;
  
