import React, { useRef, useEffect, useState } from 'react';
import './MenuModal.css';
import ModalTemplate from '../common/ModalTemplate';
import ResetIcon from '../icon/Reset';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenuModal, applyFoodList, applyCafeList, applyDrinkList } from '../../actions/homePageInfo';

function MenuModal(props) {
    const dispatch = useDispatch();
    const stateList = useSelector(state => props.name==='음식'?state.homePageInfo.tempFoodStateList:props.name==='카페'?state.homePageInfo.tempCafeStateList:state.homePageInfo.tempDrinkStateList);
    
    const [tempStateList, setTempStateList] = useState(stateList);
    const closePage = () => {
        dispatch(closeMenuModal())
    };
    function activeChange (index) {
        setTempStateList(
            tempStateList.map((elem)=>
                elem.id === index
                ? { ...elem, active: !elem.active}
                : elem
            )
        );
    };
    function resetStates () {
        setTempStateList(
            tempStateList.map((elem)=>{ return {...elem, active: false}})
        );
    };
    function applyStates () {
        if (props.name === '음식') {
            dispatch(applyFoodList(tempStateList));
        }
        else if (props.name === '카페') {
            dispatch(applyCafeList(tempStateList));
        }
        else {
            dispatch(applyDrinkList(tempStateList));
        }
        closePage();
    };

    return (
        <>
            <ModalTemplate header={`${props.name} 종류 선택`}
                           content={<MenuModalContent name={props.name}
                                                      resetStates={resetStates}
                                                      activeChange={activeChange}
                                                      tempStateList={tempStateList}/>}
                           closeFunc={closePage}
                           applyFunc={applyStates}
                           applyButton="적용하기"/>
        </>
    );
  }
  
export default MenuModal;


function MenuModalContent (props) {
    // props contains {name, resetStates, activeChange, tempStateList] 
    return (<>
            <div className="reset">
                <span onClick={props.resetStates} className="resetButton">{`${props.name} 선택 초기화`}
                    <span className="resetIcon" ><ResetIcon width={15} color={"#a4a4a4"}/></span>
                </span>
            </div>
            <div className="menuList">
                {props.tempStateList.map((elem) => {
                    return <div onClick={()=>props.activeChange(elem.id)} className={`menuComponent ${elem.active?"active":""}`} key={elem.id}>{elem.menu}</div>
                })}
            </div>
        </>
    );
}