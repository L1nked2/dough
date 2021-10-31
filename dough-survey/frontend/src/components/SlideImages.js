import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

import "./SlideImages.css";

import SwiperCore, {
    Scrollbar
} from 'swiper';



function SlideImages() {
    // import Swiper core and required modules
    // install Swiper modules
    SwiperCore.use([Scrollbar]);

    return (
      <Swiper scrollbar={{"hide": true}} slidesPerView={'auto'} centeredSlides={true} spaceBetween={15} className="mySwiper">
          <SwiperSlide>Image 1</SwiperSlide>
          <SwiperSlide>Image 2</SwiperSlide>
          <SwiperSlide>Image 3</SwiperSlide>
          <SwiperSlide>Image 4</SwiperSlide>
          <SwiperSlide>Image 5</SwiperSlide>
          <SwiperSlide>Image 6</SwiperSlide>
          <SwiperSlide>Image 7</SwiperSlide>
          <SwiperSlide>Image 8</SwiperSlide>
          <SwiperSlide>Image 9</SwiperSlide>
      </Swiper>
    );
  }

export default SlideImages;