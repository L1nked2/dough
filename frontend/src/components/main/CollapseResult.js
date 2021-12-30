import React, {useState, useRef} from 'react';
import './CollapseResult.css';
import MyResult from './MyResult'
import Chevron from '../icon/Chevron';

function CollapseResult() {
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState("");
    const [contHeight, setContHeight] = useState("0px");
    const [isRotate, setIsRotate] = useState("collapseIcon");
    
    const content = useRef(null);
    function toggleCollapse() {
        setIsOpen(!isOpen);
        setIsActive(isOpen ? "" : "active")
        setContHeight(isOpen ? "0px" : `${content.current.scrollHeight}px`);
        setIsRotate(isOpen ? "collapseIcon" : "collapseIcon rotate");
    }
    
    return(
        <div className="collapse"> 
            <button className={`panelHeader ${isActive}`} onClick={toggleCollapse}>
                <Chevron className={`${isRotate}`} width={"0.474em"} color={"rgba(0, 0, 0, 0.36)"} />
                내 취향 테스트 결과
            </button>
            <div ref={content} style={{maxHeight: `${contHeight}`}} className="collapseContent" >
                <MyResult />
            </div>
        </div>
    );
}

export default CollapseResult;