import React, { useState, useEffect, useRef } from 'react';
import './RecommendList.css';
import ShopInList from '../components/recommend/ShopInList';

import BackButton from '../components/icon/Back';
import ShareIcon from '../components/icon/Share';
import { useDispatch, useSelector } from 'react-redux';
import { closeListPage } from '../actions/recommendPageInfo'

function RecommendListModal(props) {
    const dispatch = useDispatch();
    const listPageContent = useSelector(state => state.recommendPageInfo.listPageContent);
    
    const closePage = () => {
        document.body.style.overflow = 'unset';
        dispatch(closeListPage());
    }
    const goBack = () => {
        window.history.back();
        closePage();
    }
    useEffect (() => {
        window.history.pushState({page: "shop_modal"}, "shop_modal");
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
            <div className="title">{listPageContent.mainText}</div>
            <div className="subtitle">{listPageContent.subText}</div>
            <div className="content">
                <div className="target">{`for ${listPageContent.target}`}</div>
                {listPageContent.contents.map((elem) => {
                    return (
                        <ShopInList elem={elem} />
                    );
                })}
            </div>
        </div>
    );
}

export default RecommendListModal;