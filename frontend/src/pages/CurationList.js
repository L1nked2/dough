import React, { useState, useEffect, useRef } from 'react';
import './RecommendList.css';
import ShopInList from '../components/recommend/ShopInList';

import BackButton from '../components/icon/Back';
import ShareIcon from '../components/icon/Share';
import { useDispatch, useSelector } from 'react-redux';
import { closeCurationPage } from '../actions/recommendPageInfo'

function CurationListModal(props) {
    const dispatch = useDispatch();
    const curationPageContent = useSelector(state => state.recommendPageInfo.curationPageContent);
    const target = useSelector(state => state.userInfo.testResult.sampleTestResult.titleShort);
    const shopPageIsOpen = useSelector(state => state.homePageInfo.shopPageIsOpen);
    
    const closePage = () => {
        document.body.style.overflow = 'unset';
        dispatch(closeCurationPage());
    }
    const goBack = () => {
        window.history.back();
    }
    useEffect (() => {
        window.history.pushState({page: "list_modal"}, "list_modal");
        window.addEventListener("popstate",closePage);
        return () => {
            window.removeEventListener("popstate",closePage);
        }
    }, []);
    
    return (
        <div className="listPage" id="listPage">
            <div className="subHeader">
                <div onClick={() => {goBack()}} className="backButton"><BackButton width={15} color={"rgba(0,0,0,0.9)"}/></div>
                <div className="shareButton"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"}/></div>
            </div>
            <div className="title">{curationPageContent.mainText}</div>
            <div className="subtitle">{curationPageContent.subText}</div>
            <div className="content">
                <div className="target">{`for ${target}`}</div>
                {curationPageContent.contents.map((elem, index) => {
                    return (
                        <ShopInList elem={elem} key={index}/>
                    );
                })}
            </div>
        </div>
    );
}

export default CurationListModal;