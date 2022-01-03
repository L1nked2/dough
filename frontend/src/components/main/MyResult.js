import React, {useState, useRef} from 'react';
import { useSelector } from 'react-redux';
import './MyResult.css';

function MyResult(props) {
    const testResult = useSelector((state) => state.userInfo.testResult.sampleTestResult);
    if (!testResult) {
        return (<div>none</div>);
    }
    return(
        <>
            {props.className !== 'curation' ? <>
                <div className="resultIcon"><img src={testResult.iconImg} alt="testResult" /></div>
                <div className="resultHeader">{testResult.titleShort}</div>
                <div className="resultDisc">{testResult.description}</div></>
            : null
            }
            <div className={`resultContainer ${props.className}`}>
                <div className="leftWord">
                    <div>차가운</div><div>어두운</div><div>모던한</div><div>고급스러운</div>
                </div>
                <div className="centerLine">
                    <div className="line"/><div className="circle" style={{left: `${props.className==='curation'?props.value1:testResult.value1}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.className==='curation'?props.value2:testResult.value2}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.className==='curation'?props.value3:testResult.value3}%`}}/>
                    <div className="line"/><div className="circle" style={{left: `${props.className==='curation'?props.value4:testResult.value4}%`}}/>
                </div>
                <div className="rightWord">
                    <div>따뜻한</div><div>밝은</div><div>힙한</div><div>소박한</div>
                </div>
            </div>
        </>
    );
}

export default MyResult;