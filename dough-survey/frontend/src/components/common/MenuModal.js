import React, { useRef, useEffect, useState } from 'react';
import './MenuModal.css';

function MenuModal(props) {      
    const [stateList, setStateList] = useState(props.list);

    function activeChange (index) {
        setStateList(
            stateList.map((elem)=>
                elem.id === index
                ? { ...elem, active: !elem.active}
                : elem
            )
        );
    };
    function resetStates () {
        setStateList(
            stateList.map((elem)=>{ return {...elem, active: false}})
        );
    };
    function applyStates () {
        props.setList(stateList);
        props.closeMenuModal();
    };

    return (
        <div className="overlay" >
            <div className="header">{`${props.name} 종류 선택`}</div>
            <div className="modal">
                <div className="reset">
                    <span onClick={resetStates} className="resetButton">{`${props.name} 선택 초기화`}
                        <span className="resetIcon" ><ResetIcon width={15}/></span>
                    </span>
                </div>
                <div className="menuList">
                    {stateList.map((elem) => {
                        return <div onClick={()=>activeChange(elem.id)} className={`menuComponent ${elem.active?"active":""}`}>{elem.menu}</div>
                    })}
                </div>
                <div className="buttonSection">
                    <div className="close" onClick={() => props.closeMenuModal()}>닫기</div>
                    <div className="apply" onClick={applyStates}>적용하기</div>
                </div>
            </div>
        </div>
    );
  }
  
export default MenuModal;
  
function ResetIcon (props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 13.835 13.667">
        <path id="패스_7295" data-name="패스 7295" d="M2.247,3a6.19,6.19,0,0,1,4.42-1.841,6.126,6.126,0,0,1,6.168,6.083,6.126,6.126,0,0,1-6.168,6.083A6.126,6.126,0,0,1,.5,7.242" transform="translate(0.25 -0.409)" fill="none" stroke="#a4a4a4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"/>
        </svg>
    );
}
