import React, { useRef, useEffect, useState } from 'react';
import './MenuModal.css';
import ResetIcon from '../icon/Reset';

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
                        <span className="resetIcon" ><ResetIcon width={15} color={"#a4a4a4"}/></span>
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