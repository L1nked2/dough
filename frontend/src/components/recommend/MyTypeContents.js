import React, { useState, useRef } from 'react';
import { CSSTransition } from "react-transition-group";
import './MyTypeContents.css';

import ExplainModal from './ExplainModal';
import RecommendContent from './RecommendContent';

import QuestionMarkIcon from '../icon/QuestionMark';

import sampleImage from "../../img/login_background.png";

function MyTypeContents(props) {

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
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const question = useRef(null);
    const myTypeComp = useRef(null);
    const [modalX, setModalX] = useState(0);
    const [modalY, setModalY] = useState(0);
    function openModal () {
        setModalX(question.current.offsetLeft - (window.innerWidth/2 - myTypeComp.current.offsetWidth/2));
        setModalY(question.current.offsetTop - window.scrollY);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    return (
        <div>
            <div className="myType" ref={myTypeComp} >
                <span className="light">내 취향 유형</span><span className="light">|</span>
                <span className="dark">{myType}</span>
                <div className="click" id="myTypeExplain" onClick={openModal} ref={question}>
                    <QuestionMarkIcon width={"1em"} color={"rgba(0,0,0,0.65"}/>
                </div>
            </div>
            <CSSTransition in={isModalOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
                <ExplainModal setIsModalOpen={setIsModalOpen} modalX={modalX} modalY={modalY}/>
            </CSSTransition>
            {contents.map((elem, index) => {
                return (
                    <RecommendContent elem={elem} key={index} openShopPage={props.openShopPage} setShopPageContents={props.setShopPageContents}
                                                              openListPage={props.openListPage} setListPageContents={props.setListPageContents}/>
                );
            })}
        </div>
    );
}
  
export default MyTypeContents;
  
