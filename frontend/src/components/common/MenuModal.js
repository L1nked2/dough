import React, { useRef, useEffect, useState } from 'react';
import './MenuModal.css';
import ResetIcon from '../icon/Reset';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenuModal, applyFoodList, applyCafeList, applyDrinkList } from '../../actions/homePageInfo';

function MenuModal(props) {
    const dispatch = useDispatch();
    const stateList = useSelector(state => props.name==='음식'?state.homePageInfo.tempFoodStateList:props.name==='카페'?state.homePageInfo.tempCafeStateList:state.homePageInfo.tempDrinkStateList);
    
    const [tempStateList, setTempStateList] = useState(stateList);
    const closePage = () => {
        dispatch(closeMenuModal())
        document.body.style.overflow = 'unset';
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

    useEffect (() => {
        const modal = document.getElementById('overlayMenu');
        const button = document.getElementById('menuChangeButton');
        window.addEventListener("click", (e) => {
            if (e.target === modal && e.target !== button) {
                closePage();
            }
        });
        window.history.pushState({page: "location_modal"}, "location_modal");
        window.addEventListener("popstate", closePage);
        return () => {
            window.removeEventListener("click", closePage);
            window.removeEventListener("popstate",closePage);
        };
    },[])

    return (
        <div className="overlayMenu" id="overlayMenu">
            <div className="header">{`${props.name} 종류 선택`}</div>
            <div className="modal">
                <div className="reset">
                    <span onClick={resetStates} className="resetButton">{`${props.name} 선택 초기화`}
                        <span className="resetIcon" ><ResetIcon width={15} color={"#a4a4a4"}/></span>
                    </span>
                </div>
                <div className="menuList">
                    {tempStateList.map((elem) => {
                        return <div onClick={()=>activeChange(elem.id)} className={`menuComponent ${elem.active?"active":""}`} key={elem.id}>{elem.menu}</div>
                    })}
                </div>
                <div className="buttonSection">
                    <div className="close" onClick={closePage}>닫기</div>
                    <div className="apply" onClick={applyStates}>적용하기</div>
                </div>
            </div>
        </div>
    );
  }
  
export default MenuModal;