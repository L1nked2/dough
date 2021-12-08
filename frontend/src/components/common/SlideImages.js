import React from "react";
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
  // import Swiper core and required modules
  // install Swiper modules
    if (props.page === 'recommend'){
      SwiperCore.use([Pagination]);
    }
    const openShopPage = (shop) => {
      if (props.page === 'main' || props.page === 'recContent') {
        props.openModal();
        props.setShopPageContents({name: shop.name});
      }
      else {
        return null
      }
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
    }

    return (
      <Swiper pagination={props.page === 'recommend' ? {clickable: true} : false} loop={props.page === 'recommend'}
              slidesPerView={3} slidesPerView={'auto'} centeredSlides={true} spaceBetween={15} // viewpoint에 따라 변경 예정
              className={`mySwiper ${props.page} ${props.name}`}>
          {props.info.map(elem => {
            return (
              <SwiperSlide onClick={()=>{openShopPage(elem)}} style={{backgroundImage: `url(${elem.imgSrc})`}} className={`swiperSlide ${props.page}`}>
                { choiceSlideElem(props.page, elem) }
              </SwiperSlide>
            );
          })}
      </Swiper>
    );
  }

export default SlideImages;

function MainPageSlide ({elem}) {
  return (
    <div>
      <div style={{fontSize:"1.8em", marginBottom:40}}>{`${elem.rank}위`}</div>
      <div style={{fontSize:"2.6em", marginBottom:20}}>{elem.name}</div>
    </div>
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