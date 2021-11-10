import React, {useState, useRef} from 'react';
import './CollapseResult.css';
import MyResult from './MyResult'


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
                <Chevron className={`${isRotate}`} width={9} fill={"rgba(0, 0, 0, 0.36)"} />
                내 취향 테스트 결과
            </button>
            <div ref={content} style={{maxHeight: `${contHeight}`}} className="collapseContent" >
                <MyResult resultName="골목길 이자카야" value1="80" value2="60" value3="20" value4="5" value5="90"/>
            </div>
        </div>
    );
}

export default CollapseResult;

function Chevron(props) {
    return(
        <svg
            className={props.className}
            height={props.height}
            width={props.width}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 5.978 9.746"
        >
            <path id="패스_6629" data-name="패스 6629" d="M0,4.533,4.167,0,8.333,4.533" transform="translate(5.239 0.706) rotate(90)" 
            fill='none' stroke="rgba(0,0,0,0.36)" stroke-linecap="round" stroke-width="1"/>
        </svg>
    );
}