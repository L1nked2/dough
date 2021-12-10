import React from 'react';
import './RecommendContent.css';

import SlideImages from '../common/SlideImages';

import ShareIcon from '../icon/Share';
import Chevron from '../icon/Chevron';


function RecommendContent(props) {
    const elem = props.elem;
    const index = props.index;
    const target = props.elem.target;

    function openListPage () {
        props.openListPage();
        props.setListPageContents({name: elem.mainTitle});
    }

    return (
        <div className={`recommendContent ${target?"specific":""}`} key={index}>
            {target && 
                <div className="target">{`for ${target}`}</div>
            }
            <div className="header">
                <div className="mainTitle">
                    {elem.mainTitle}
                    <div className="icon" onClick={openListPage}><Chevron width={"0.4em"} color={"rgba(0,0,0,0.9)"}/></div>
                </div>
                <div className="subTitle">{elem.subTitle}</div>
                <div className="icon"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"} /></div>
            </div>
            <SlideImages 
                openModal={props.openShopPage} 
                setPageContents={props.setShopPageContents}
                info={elem.recommendInfo} 
                page="recContent"/>
        </div>
    );
}
  
export default RecommendContent;
  
