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
    const [isAll, setIsAll] = useState(false);
    const closePage = () => {
        dispatch(closeMenuModal())
    };
    useEffect (() => {
        if (checkAllState() === 0) {setIsAll(true)}
        else {setIsAll(false)}
    }, [tempStateList])
    function checkAllState () {
        var allTrue = true;
        for (var i = 0; i < tempStateList.length; i++) {
            if (!tempStateList[i].active) {allTrue = false; break;}
        }
        if (allTrue) {return 0;}

        var allFalse = true;
        for (var i = 0; i < tempStateList.length; i++) {
            if (tempStateList[i].active) {allFalse = false; break;}
        }
        if (allFalse) {return 1;}

        return 2; // 0: all true, 1: all false, 2: normal case
    }
    function checkIsChange () {
        var noChange = true;
        for (var i = 0; i < tempStateList.length; i++) {
            if (tempStateList[i].active !== stateList[i].active) {noChange = false;}
        }
        return noChange;
    }
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
            tempStateList.map((elem)=>{ return {...elem, active: !isAll}})
        );
        setIsAll(!isAll);
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
                                                      isAll={isAll}
                                                      activeChange={activeChange}
                                                      tempStateList={tempStateList}/>}
                           closeFunc={closePage}
                           applyFunc={applyStates}
                           checkIsChange={checkIsChange}
                           applyButton="적용하기"/>
        </>
    );
  }
  
export default MenuModal;


function MenuModalContent (props) {
    // props contains {name, resetStates, activeChange, tempStateList] 
    return (<>
            <div className="reset">
                <span onClick={props.resetStates} className="resetButton">{`전체 선택`}
                    <span className="resetIcon" ><ResetIcon width={"1em"} color={props.isAll?"#3FB8D5":"#a4a4a4"}/></span>
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