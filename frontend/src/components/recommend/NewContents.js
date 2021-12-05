import React, { useState, useRef } from 'react';
import { CSSTransition } from "react-transition-group";
import './NewContents.css';

import SlideImages from '../common/SlideImages';
import ExplainModal from './ExplainModal';
import RecommendContent from './RecommendContent';

import QuestionMarkIcon from '../icon/QuestionMark';
import ShareIcon from '../icon/Share';
import Chevron from '../icon/Chevron';

import sampleImage from "../../img/login_background.png";

function NewContents(props) {

    const target = "정원 찻집 유형";
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
            target: target,
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        },
        {
            target: target,
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        }
    ];

    return (
        <div>
            {contents.map((elem, index) => {
                return (
                    <RecommendContent elem={elem} key={index}/>
                );
            })}
        </div>
    );
}
  
export default NewContents;
  
