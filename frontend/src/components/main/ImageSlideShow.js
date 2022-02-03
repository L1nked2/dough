import React, { useState } from 'react';
import SlideImages from '../common/SlideImages';
import BackButton from '../icon/Back';
import './ImageSlideShow.css';

function ImageSlideShow(props) {
    const [slideIndex, setSlideIndex] = useState(0);
    return (
    <div className="imgSlidePage">
        <div className="subHeader">
            <div onClick={props.closeFunc} className="backButton">
                <BackButton width={15} color={"#FFFFFF"}/>
            </div>
            <div className="title">
                {`${props.title} (${slideIndex+1}/${props.imgList.length})`}
            </div>
        </div>
        <div className="content" >
            <SlideImages page="slideShow" list={props.imgList} setSlideIndex={setSlideIndex} index={props.index}/>
        </div>
        <div className="subNavbar">
            <div>마지막 업데이트 : 2021.01.10</div>
        </div> 
    </div>);
  }
  
export default ImageSlideShow;