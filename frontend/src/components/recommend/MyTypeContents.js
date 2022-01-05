import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from "react-transition-group";
import './MyTypeContents.css';

import ExplainModal from './ExplainModal';
import RecommendContent from './RecommendContent';

import QuestionMarkIcon from '../icon/QuestionMark';

import { useSelector } from 'react-redux';

function MyTypeContents(props) {
    const contents = useSelector(state => state.recommendPageInfo.myTypeList);
    const [myType, setMyType] = useState("");

    useEffect(() => {
        if (contents.length > 0) {
            setMyType(contents.target)
        }
    },[contents])
    
    

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
                    <RecommendContent elem={elem} key={index} isSpecificType={false}/>
                );
            })}
        </div>
    );
}
  
export default MyTypeContents;
  
