import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"
import { openListPage, setListPageContents } from "../../actions/recommendPageInfo"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

import "./SlideImages.css";

import SwiperCore, {
    Pagination
} from 'swiper';



function SlideImages(props) {
    if (props.page === 'main') {
      return (<MainPageSlide name={props.name} />);
    }
    else if (props.page === 'recommend') {
      return (<RecommendPageMainSlide />);
    }
    else if (props.page === 'recContent') {
      return (<RecommendPageContentSlide contents={props.contents} />);
    }
    else if (props.page === 'recListPage') {
      return (<RecommendListPageImageSlide contents={props.contents} />);
    }
    return null;
  }

export default SlideImages;


function MainPageSlide (props) {
  const dispatch = useDispatch();
  const slideContentList = useSelector(state => state.myPlaceList).slice(0,3);
  const openPage = (shop) => {
    dispatch(openShopPage());
    document.body.style.overflow = 'hidden';
    dispatch(setShopPageContents({...shop, tag: 'myPlaceList'}));
  }

  return (
    <Swiper pagination={false} loop={false}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={true} spaceBetween={15} // viewpoint에 따라 변경 예정
            className={`mySwiper main ${props.name}`}>
      {slideContentList.map(elem => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.firstImgSrc})`}} className={`swiperSlide main`}>
            <div>
              <div style={{fontSize:"1.8em", marginBottom:40}}>{`${elem.rank}위`}</div>
              <div style={{fontSize:"2.6em", marginBottom:20}}>{elem.name}</div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

function RecommendPageMainSlide () {
  SwiperCore.use([Pagination]);
  const dispatch = useDispatch();
  const slideContentList = useSelector(state => state.recommendPageInfo.headerList);
  const openPage = (list) => {
    dispatch(openListPage());
    document.body.style.overflow = 'hidden';
    dispatch(setListPageContents(list));
  }
  return (
    <Swiper pagination={{clickable: true}} loop={true}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={true} spaceBetween={0} 
            className={`mySwiper recommend`}>
      {slideContentList.map(elem => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.imgSrc})`}} className={`swiperSlide recommend`}>
            <div>
              <div style={{fontSize:"1.1em", marginBottom:"0.2em", fontFamily: "SpoqaRegular"}}>
                {elem.subText}
              </div>
              <div style={{fontSize:"2.6em", whiteSpace: "pre-wrap", lineHeight: "1.35em"}}>
                {elem.mainText}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

function RecommendPageContentSlide (props) {
  const dispatch = useDispatch();
  const slideContentList = props.contents;
  const openPage = (shop) => {
    dispatch(openShopPage());
    document.body.style.overflow = 'hidden';
    dispatch(setShopPageContents({...shop, tag: 'myPlaceList'}));
  }
  return (
    <Swiper pagination={false} loop={false}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={true} spaceBetween={15} // viewpoint에 따라 변경 예정
            className={`mySwiper recContent`}>
      {slideContentList.map(elem => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.firstImgSrc})`}} className={`swiperSlide recContent`}>
            <div>
              <div style={{fontSize:"1.8em", marginBottom:"0.5em"}}>
                {elem.name}
              </div>
              <div style={{fontSize:"1.1em", fontFamily: "SpoqaRegular"}}>
                {elem.subTitle}
              </div>
            </div> 
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}


function RecommendListPageImageSlide (props) {
  const slideContentList = props.contents;
  return (
    <Swiper pagination={false} loop={false}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={false} spaceBetween={15} // viewpoint에 따라 변경 예정
            className={`mySwiper recListPage`}>
      {slideContentList.map(elem => {
        return (
          <SwiperSlide style={{backgroundImage: `url(${elem.imgSrc})`}} className={`swiperSlide recListPage`} />
        );
      })}
    </Swiper>
  );
}