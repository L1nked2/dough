import React, {useState, useRef} from 'react';
import './MyResult.css';

function MyResult(props) {
    return(
        <div>
            <h2 className="resultHeader">{props.resultName}</h2>
            <div className="resultContainer">
                <div className="leftWord">
                    <div>채식파</div><div>담백한</div><div>외국 술</div><div>모던한</div><div>고급스러운</div>
                </div>
                <div className="centerLine">
                    <div className="line"/><div className="circle" style={{left: `${props.value1}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.value2}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.value3}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.value4}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.value5}%`}}/>
                </div>
                <div className="rightWord">
                    <div>육식파</div><div>자극적인</div><div>한국 술</div><div>힙한</div><div>소박한</div>
                </div>
            </div>
        </div>
    );
}

export default MyResult;