import React, {useState, useRef} from 'react';
import { useSelector } from 'react-redux';
import './MyResult.css';

function MyResult() {
    const testResult = useSelector((state) => state.userInfo.testResult);
    if (!testResult) {
        return (<div>none</div>);
    }
    return(
        <div>
            <div className="resultHeader">{testResult.titleShort}</div>
            <div className="resultContainer">
                <div className="leftWord">
                    <div>차가운</div><div>어두운</div><div>모던한</div><div>고급스러운</div>
                </div>
                <div className="centerLine">
                    <div className="line"/><div className="circle" style={{left: `${testResult.value1}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${testResult.value2}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${testResult.value3}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${testResult.value4}%`}}/>
                </div>
                <div className="rightWord">
                    <div>따뜻한</div><div>밝은</div><div>힙한</div><div>소박한</div>
                </div>
            </div>
        </div>
    );
}

export default MyResult;