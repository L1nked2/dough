import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

import "./SlideImages.css";

import SwiperCore, {
    Scrollbar
} from 'swiper';



function SlideImages(props) {
    // import Swiper core and required modules
    // install Swiper modules
    SwiperCore.use([Scrollbar]);

    return (
      <Swiper scrollbar={{"hide": true}} slidesPerView={'auto'} centeredSlides={true} spaceBetween={15} className="mySwiper">
          <SwiperSlide><div><div style={{fontSize:20, marginBottom:20}}>1순위</div><div style={{fontSize:30, marginBottom:20}}>치돈치돈</div></div></SwiperSlide>
          <SwiperSlide><div>{props.name} 2</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 3</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 4</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 5</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 6</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 7</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 8</div></SwiperSlide>
          <SwiperSlide><div>{props.name} 9</div></SwiperSlide>
      </Swiper>
    );
  }

export default SlideImages;