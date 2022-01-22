import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from './Header';
import MyResult from '../main/MyResult';
import ExpandIcon2 from "../icon/Expand2";
import MapIcon from "../icon/Map";
import LocationIcon from "../icon/Location";
import { openShopPage, setShopPageContents } from "../../actions/homePageInfo"
import { openListPage, setListPageContents, openCurationPage, setCurationPageContents } from "../../actions/recommendPageInfo"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

import "./SlideImages.css";

import SwiperCore, {
    Pagination
} from 'swiper';
import { useRef } from "react";

function SlideImages(props) {
    if (props.page === 'main') {
      return (<MainPageSlide name={props.name} slideContentList={props.slideContentList}/>);
    }
    else if (props.page === 'recommend') {
      return (<RecommendPageMainSlide />);
    }
    else if (props.page === 'recContent') {
      return (<RecommendPageContentSlide contents={props.contents} />);
    }
    else if (props.page === 'curContent') {
      return (<CurationPageContentSlide contents={props.contents} />);
    }
    else if (props.page === 'recListPage') {
      return (<RecommendListPageImageSlide contents={props.contents} />);
    }
    else if (props.page === 'result') {
      return (<ResultPageImageSlide elem={props.elem} />);
    }
    else if (props.page === 'slideShow') {
      return (<SlideShowImageSlide list={props.list} setSlideIndex={props.setSlideIndex} index={props.index}/>);
    }
    return null;
  }

export default SlideImages;


function MainPageSlide (props) {
  const slideContentList = props.slideContentList;
  const dispatch = useDispatch();
  const openPage = (shop, rank) => {
    dispatch(openShopPage());
    document.body.style.overflow = 'hidden';
    dispatch(setShopPageContents({...shop, rank: rank, tag: 'myPlaceList'}));
  }
  return (
    <Swiper pagination={false} loop={false}
    slidesPerView={3} slidesPerView={'auto'} 
    centeredSlides={true} spaceBetween={15} // viewpoint에 따라 변경 예정
    className={`mySwiper main ${props.name}`}>
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide onClick={()=>{openPage(elem, index+1)}} style={{backgroundImage: `url(${elem.place_main_photo_list[0]})`}} className={`swiperSlide main`} key={index}>
            <div>
              <div>{`${index+1}위 ${elem.place_name}`}</div>
              <div><LocationIcon width={'1em'} color={'white'}/>{` 역에서 200m     ${elem.place_kind.join(', ').length > 10 ? elem.place_kind.join(', ').slice(0, 10)+"..." : elem.place_kind.join(', ')}`}</div>
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
          <SwiperSlide onClick={()=>{openPage(elem)}} style={{backgroundImage: `url(${elem.placePhotoList[0]})`}} className={`swiperSlide recContent`} key={index}>
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

function CurationPageContentSlide (props) {
  const slideContentList = props.contents;
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
          <SwiperSlide style={{backgroundImage: `url(${elem.placePhotoList[0]})`}} className={`swiperSlide recContent`} key={index}>
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
          <SwiperSlide style={{backgroundImage: `url(${elem})`}} className={`swiperSlide recListPage`} key={index}/>
        );
      })}
    </Swiper>
  );
}


function ResultPageImageSlide (props) {
  const dispatch = useDispatch();
  SwiperCore.use([Pagination]);
  const testResult = useSelector((state) => state.userInfo.testResult);
  const name = useSelector((state) => state.userInfo.name);
  
  const [isModalOpen, setIsModalOpen] = useState([false, false, false, false]);
  function modalControl(index) {
    var temp = isModalOpen;
    temp[index] = !temp[index];
    setIsModalOpen([...temp]);
  }
  if (!testResult) {return null;}
  const slideContentList = [testResult.sampleTestResult.mainImg, ...testResult.mainCuration.contents];
  
  function openPage () {
    dispatch(openCurationPage());
    dispatch(setCurationPageContents(props.elem));
  }

  return (
    <Swiper pagination={{clickable: true}} loop={true}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={false} spaceBetween={0} // viewpoint에 따라 변경 예정
            className={`mySwiper result`}>
      {slideContentList.map((elem, index) => {
        if (index === 0) {
          return (
            <SwiperSlide style={{backgroundImage: `url(${elem})`}} className={`swiperSlide result`} key={index}>
              <div>
                <Header className="result" />
                <div className="your">{name}님의 가게 취향은...</div>
                <div className="title">{testResult.sampleTestResult.titleLong}</div>
                <div className="tags">{testResult.sampleTestResult.tags}</div>
                <div className="disc">{testResult.sampleTestResult.summary}</div>
              </div>
            </SwiperSlide>
          )
        }
        else {
          return (
            <SwiperSlide style={{backgroundImage: `url(${elem.mainPhoto})`}} className={`swiperSlide result`} key={index}>
              <div>
                {isModalOpen[index] ? 
                  <div className="modal">
                    <div className="closeButton" onClick={() => {modalControl(index)}}>
                      <ExpandIcon2 width={'1em'} color="#FFFFFF" />
                    </div>
                    <div className="content">
                      <span className="station">
                        <MapIcon width={"0.8em"} color="#FFFFFF" strokeWidth={0.01}/>
                        <span id="station">{elem.station}</span>
                      </span>
                      <div className="name">{elem.name}</div>
                      <MyResult className="curation" value1={elem.parameter1} value2={elem.parameter2} value3={elem.parameter3} value4={elem.parameter4}/>
                      <div className="openCurationPage">
                        큐레이션 보러 가기
                        <div onClick={openPage}>
                          <ExpandIcon2 width={'0.8em'} color="#595959" />
                        </div>
                      </div>
                    </div>
                  </div> 
                  :
                  <div className="modalButton" onClick={() => {modalControl(index)}}>
                    <span style={{color: '#C1C1C1', fontFamily: 'SpoqaRegular'}}>예상 취향 가게 | </span>
                    <span style={{color: '#FFFFFF', fontFamily: 'SpoqaRegular', paddingLeft: '0.3em', paddingRight: '1em'}}>가게 정보 보기</span>
                    <ExpandIcon2 width={'1em'} color="#FFFFFF" />
                  </div>
                }
              </div>
            </SwiperSlide>
          );
        }
      })}
    </Swiper>
  );
}


function SlideShowImageSlide (props) {
  console.log(props);
  const slideContentList = props.list;
  return (
    <Swiper pagination={false} loop={false}
            slidesPerView={3} slidesPerView={'auto'} 
            centeredSlides={false} spaceBetween={0} initialSlide={props.index}
            className={`mySwiper slideShow`} onSlideChange={(swiper) => props.setSlideIndex(swiper.activeIndex)}>
      {slideContentList.map((elem, index) => {
        return (
          <SwiperSlide style={{backgroundImage: `url(${elem})`}} className={`swiperSlide slideShow`} key={index}/>
        );
      })}
    </Swiper>
  );
}
