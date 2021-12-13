import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"
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
    const dispatch = useDispatch();
    const slideContentList = useSelector(state => state.myPlaceList).slice(0,3);

    if (props.page === 'recommend'){
      SwiperCore.use([Pagination]);
    }
    const openPage = (shop) => {
      dispatch(openShopPage());
      document.body.style.overflow = 'hidden';
      if (props.page === 'main' || props.page === 'recContent') {
        dispatch(setShopPageContents({...shop, tag: 'myPlaceList'}));
      }
      else {
        return null
      }
    }
    if (props.page === 'main') {
      return (<MainPageSlide name={props.name} />);
    }
    function choiceSlideElem (page, elem) {
      if (page === 'main') {
        return (<MainPageSlide elem={elem} />);
      }
      else if (page === 'recommend') {
        return (<RecommendPageMainSlide elem={elem} />);
      }
      else if (page === 'recContent') {
        return (<RecommendPageContentSlide elem={elem} />);
      }
      else if (page === 'recListPage') {
        return (null);
      }
    }

    return (
      <Swiper pagination={props.page === 'recommend' ? {clickable: true} : false} loop={props.page === 'recommend'}
              slidesPerView={3} slidesPerView={'auto'} 
              centeredSlides={props.page !== 'recListPage'} spaceBetween={15} // viewpoint에 따라 변경 예정
              className={`mySwiper ${props.page} ${props.name}`}>
          {slideContentList.map(elem => {
            return (
              <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.firstImgSrc})`}} className={`swiperSlide ${props.page}`}>
                { choiceSlideElem(props.page, elem) }
              </SwiperSlide>
            );
          })}
      </Swiper>
    );
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

function RecommendPageMainSlide ({elem}) {
  return (
    <div>
      <div style={{fontSize:"1.1em", marginBottom:"0.2em", fontFamily: "SpoqaRegular"}}>
        {elem.subText}
      </div>
      <div style={{fontSize:"2.6em", whiteSpace: "pre-wrap", lineHeight: "1.35em"}}>
        {elem.mainText}
      </div>
    </div> 
  );
}

function RecommendPageContentSlide ({elem}) {
  return (
    <div>
      <div style={{fontSize:"1.8em", marginBottom:"0.5em"}}>
        {elem.name}
      </div>
      <div style={{fontSize:"1.1em", fontFamily: "SpoqaRegular"}}>
        {elem.subText}
      </div>
    </div> 
  );
}