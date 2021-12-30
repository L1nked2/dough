import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from './Header';
import ExpandIcon2 from "../icon/Expand2";
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
    else if (props.page === 'result') {
      return (<ResultPageImageSlide />);
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
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.imgSrc[0]})`}} className={`swiperSlide main`} key={index}>
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
  if (slideContentList.length === 0){
    return (
      <Swiper pagination={{clickable: true}} loop={true}
              slidesPerView={3} slidesPerView={'auto'} 
              centeredSlides={true} spaceBetween={0} 
              className={`mySwiper recommend`}>
        <SwiperSlide className={`swiperSlide recommend`}>
          <div>
            로딩중
          </div>
        </SwiperSlide>
      </Swiper>
    )
  }
  return (
    <Swiper pagination={{clickable: true}} loop={true}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={true} spaceBetween={0} 
            className={`mySwiper recommend`}>
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.imgSrc})`}} className={`swiperSlide recommend`} key={index}>
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
  if (slideContentList.length === 0){
    return (
      <Swiper pagination={false} loop={false}
              slidesPerView={3} slidesPerView={'auto'} 
              centeredSlides={true} spaceBetween={0} 
              className={`mySwiper recommend`}>
        <SwiperSlide className={`swiperSlide recommend`}>
          <div>
            로딩중
          </div>
        </SwiperSlide>
      </Swiper>
    )
  }
  return (
    <Swiper pagination={false} loop={false}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={true} spaceBetween={15} // viewpoint에 따라 변경 예정
            className={`mySwiper recContent`}>
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.imgSrc[0]})`}} className={`swiperSlide recContent`} key={index}>
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
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide style={{backgroundImage: `url(${elem.imgSrc})`}} className={`swiperSlide recListPage`} key={index}/>
        );
      })}
    </Swiper>
  );
}


function ResultPageImageSlide (props) {
  SwiperCore.use([Pagination]);
  const testResult = useSelector((state) => state.userInfo.testResult);
  const name = useSelector((state) => state.userInfo.name);
  const slideContentList = [testResult.mainImg, testResult.subImg1, testResult.subImg2, testResult.subImg3];

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Swiper pagination={{clickable: true}} loop={true}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={false} spaceBetween={0} // viewpoint에 따라 변경 예정
            className={`mySwiper result`}>
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide style={{backgroundImage: `url(${elem})`}} className={`swiperSlide result`} key={index}>
            {index === 0 ? 
            <div>
              <Header className="result" />
              <div className="your">{name}님의 가게 취향은...</div>
              <div className="title">{testResult.titleLong}</div>
              <div className="tags">{testResult.tags}</div>
              <div className="disc">{testResult.summary}</div>
            </div>
            : 
            <div>
              {isModalOpen ? 
                <div className="modal">
                  <div className="closeButton" onClick={() => {setIsModalOpen(false)}}>
                    <ExpandIcon2 width={'1em'} color="#FFFFFF" />
                  </div>
                </div> 
                :
                <div className="modalButton" onClick={() => {setIsModalOpen(true)}}>
                  <span style={{color: '#C1C1C1', fontFamily: 'SpoqaRegular'}}>예상 취향 가게 | </span>
                  <span style={{color: '#FFFFFF', fontFamily: 'SpoqaRegular', paddingLeft: '0.3em', paddingRight: '1em'}}>가게 정보 보기</span>
                  <ExpandIcon2 width={'1em'} color="#FFFFFF" />
                </div>
              }
            </div>}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

