import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Shop.css';
import { closeShopPage, tempLikeChange, setShopPageContents, likeChange, openSlideshowPage } from '../actions/homePageInfo';
import { openListPage } from '../actions/recommendPageInfo';
import { appendCurrentShop } from '../actions/userInfo';
import CallModal from '../components/main/CallModal';
import { CSSTransition } from 'react-transition-group';

import { info_icon } from '../data/imgPath';
import BackButton from '../components/icon/Back';
import WonIcon from '../components/icon/Won';
import LocationIcon from '../components/icon/Location';
import MapBoldIcon from '../components/icon/MapBold';
import ClockIcon from '../components/icon/Clock';
import CallIcon from '../components/icon/Call';
import MenuIcon from '../components/icon/Menu';
import NaverIcon from '../components/icon/Naver';
import ExpandIcon from '../components/icon/Expand';
import HeartIcon from '../components/icon/HeartSub';
import HeartFilledIcon from '../components/icon/HeartFilled';
import ShareIcon from '../components/icon/Share';
import naverBlogIcon from "../img/naverblog.svg";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

import SwiperCore, {
    Navigation
} from 'swiper';
import ImageSlideShow from '../components/main/ImageSlideShow';

function ShopModal() {
    SwiperCore.use([Navigation]);
    
    const shopPageContent = useSelector(state => state.homePageInfo.shopPageContent);
    const dispatch = useDispatch();

    function clickLike (rank) {
        if (shopPageContent.tag === 'myPlaceList') {
            dispatch(likeChange(rank));
            dispatch(tempLikeChange());
        }
    }

    const reviewContent = useRef(null);
    const eachReview = useRef(null);
    const [reviewHeight, setReviewHeight] = useState(0);
    const [closeExpandButton, setCloseExpandButton] = useState(false);
    // function expandReviewHeight () {
    //     if (reviewContent.current.scrollHeight >= (reviewHeight + eachReview.current.scrollHeight*1.0125*3)) {
    //         setReviewHeight(reviewHeight + eachReview.current.scrollHeight*1.0125*3);
    //     }
    //     else {
    //         setReviewHeight(reviewContent.current.scrollHeight);
    //         setCloseExpandButton(true);
    //     }
    // }
    
    const menuContent = useRef(null);
    const eachMenu = useRef(null);
    const [menuHeight, setMenuHeight] = useState(0)
    const [menuFold, setMenuFold] = useState(true);
    function changeMenuHeight () {
        if (menuFold) {
            setMenuHeight(menuContent.current.scrollHeight);
            setMenuFold(false);
        }
        else {
            setMenuHeight(eachMenu.current.scrollHeight * 3);
            setMenuFold(true);
        }
    }
    const closePage = () => {
        dispatch(closeShopPage())
        document.body.style.overflow = 'unset';
    };
    const goBack = () => {
        window.history.back();
        closePage();
    }
    useEffect (() => {
        setTimeout(() => {dispatch(appendCurrentShop(shopPageContent))}, 200);
        
        // setReviewHeight(eachReview.current.scrollHeight * 1.1875 * 2.4);
        setMenuHeight(eachMenu.current.scrollHeight * 3);
        window.history.pushState({page: "shop_modal"}, "shop_modal");
        window.addEventListener("popstate",closePage);
        return () => {
            window.removeEventListener("popstate",closePage);
        }
    }, []);

    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    function openCallModal () {
        setIsCallModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const [galleryType, setGalleryType] = useState("store");
    const [gallery, setGallery] = useState(shopPageContent.place_provided_photo_list);
    useEffect(() => {
        // axios 
        if (galleryType === "store"){setGallery(shopPageContent.place_provided_photo_list);}
        else if (galleryType === "inside"){setGallery(shopPageContent.place_inside_photo_list);}
        else if (galleryType === "food"){setGallery(shopPageContent.place_food_photo_list);}
    }, [galleryType]);

    const isPhotoOpen = useSelector(state => state.homePageInfo.slideShowPageIsOpen);
    const [photoSlide, setPhotoSlide] = useState(null);
    const [photoSlideTitle, setPhotoSlideTitle] = useState("제목없음");
    const [photoSlideIndex, setPhotoSlideIndex] = useState(0);
    function slideOpen (content, title, index) {
        setPhotoSlide(content);
        if (title==='store'){setPhotoSlideTitle("가게");}
        else if (title==='inside'){setPhotoSlideTitle("내부");}
        else if (title==='food'){setPhotoSlideTitle("음식");}
        else {setPhotoSlideTitle(title);}
        setPhotoSlideIndex(index);
        dispatch(openSlideshowPage())
    }

    return (<>
        <CSSTransition in={isPhotoOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
            <ImageSlideShow imgList={photoSlide} title={photoSlideTitle} index={photoSlideIndex} />
        </CSSTransition>
        <div className="shopPage" id="shopPage">
            <CSSTransition in={isCallModalOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
                <CallModal setIsCallModalOpen={setIsCallModalOpen} callNum={shopPageContent.place_telephone}/>
            </CSSTransition>
            <Swiper navigation={{nextEl:'.fourPictures', prevEl:'.slideBackButton'}} loop={false}
                slidesPerView={3} slidesPerView={'auto'} slideActiveClass={"myswiper-slide-active"}
                centeredSlides={true} spaceBetween={10} className='shopSwiper'>
                <SwiperSlide className={`mainContent`}>
                    <div className="subHeader">
                        <div onClick={() => {goBack()}} className="backButton">
                            <BackButton width={15} color={"rgba(0,0,0,0.9)"}/>
                        </div>
                    </div>
                    <div className="name">{shopPageContent.place_name}</div>
                    <div className="simpleInfo">
                        <span className="price">
                            {shopPageContent.place_menu_info.length === 0 ? null : 
                            <span className="temp"><WonIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/>{shopPageContent.place_menu_info[0].price}</span>
                            }
                        </span>
                        <span className="location"><LocationIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/>{`역에서 200m`}</span>
                    </div>
                    <div className="fourPictures" >
                        <div className="twoPictures">
                            <div><img src={shopPageContent.place_main_photo_list[0]} alt="first" /></div>
                            <div><img src={shopPageContent.place_main_photo_list[1]} alt="second" /></div>
                        </div>
                        <div className="twoPictures">
                            <div><img src={shopPageContent.place_main_photo_list[2]} alt="third" /></div>
                            <div><img src={shopPageContent.place_main_photo_list[3]} alt="fourth" /></div>
                        </div>
                        <span>{`${shopPageContent.place_provided_photo_list.length + shopPageContent.place_inside_photo_list.length + shopPageContent.place_food_photo_list.length}+`}</span>
                    </div>
                    <div className="information">
                        <div className="eachInformation">
                            <div className="icon"><MapBoldIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"} /></div>
                            <div className="contents">
                                <div style={{color: "rgba(0,0,0,0.9)"}}>{shopPageContent.place_road_address}</div>
                                <div style={{color: "rgba(0,0,0,0.36)"}}>{`( 지번 ) ${shopPageContent.place_road_address}`}</div>
                            </div>
                        </div>
                        <div className="eachInformation">
                            <div className="icon"><ClockIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"} /></div>
                            <div className="contents">
                                {shopPageContent.place_operating_time.map((time, index) => {
                                    if (!time.isDayOff) {
                                        return (
                                            <div key={index} style={{color: "rgba(0,0,0,0.9)"}}>{`(${time.description}${time.type}) ${time.startTime} - ${time.endTime}`}</div> // 나중에
                                        );
                                    }
                                })}
                                <div style={{color: "#3FB8D5", fontFamily: "SpoqaMedium"}}>{`휴무일 : 월, 화`}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='callButton' onClick={openCallModal}>
                        <div className='button'><CallIcon width={"1.2em"} color={"rgba(0,0,0,0.36)"}/></div>
                        <div className='call'>전화하기</div>
                    </div>
                    <div className="menuImg" onClick={()=>{slideOpen(shopPageContent.place_menu_photo_list, 
                                                                    `${shopPageContent.place_name} 메뉴판`, 0)}}
                         style={{backgroundImage:`url(${shopPageContent.place_menu_photo_list[0]})`}}>
                        <div>{`메뉴판 (${shopPageContent.place_menu_photo_list.length})`}</div>
                    </div>
                    <div className="information">
                        <div className="eachInformation">
                            <div className="icon"><MenuIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"}/></div>
                            <div className="contents">
                                <div className='menuList' style={{maxHeight: `${menuHeight}px`}} ref={menuContent}>
                                    {shopPageContent.place_menu_info.map((menu, index) => {
                                        return (
                                            <div className="eachMenu" key={index} ref={index===0?eachMenu:null}>
                                                <div className="name">{menu.name}</div>
                                                <div className="line"/>
                                                <div className="price">{menu.price}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div onClick={()=>{changeMenuHeight()}} className='expandButton' style={{transform:`rotate(${menuFold?"0":"180"}deg)`}}>
                                    <ExpandIcon width={"1.2em"} color={"rgba(0,0,0,0.36)"} />
                                </div>
                            </div>
                        </div>
                        <div className="eachInformation">
                            <div className="icon"><NaverIcon height={"1.6em"} color={"#a3a3a3"} /></div>
                            <div className="contents">
                                <div>네이버 검색 바로가기</div>
                                <a href={shopPageContent.place_naver_link} target="_blank">{shopPageContent.place_naver_link}</a>
                            </div>
                        </div>
                        
                        {/* <div className="eachInformation">
                            <div className="icon naver"><img src={naverBlogIcon} style={{width: "2em"}}/></div>
                            <div className="contents reviews" style={{height: `${reviewHeight}px`}} ref={reviewContent}>
                                리뷰
                                {shopPageContent.reviews.map((review,index) => {
                                    return (
                                        <a className="eachReview" href={review.link} target="_blank" ref={index===0?eachReview:null} key={index}>
                                            <div className="title">{`[ ${review.title} ]`}</div>
                                            <div className="content">{review.content}</div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div> */}
                    </div>
                    <div className="infoChange">
                        <div className="icon"><img src={info_icon} alt="info_icon"/></div>
                        <div className="contents">
                            <div>{"정보 수정 요청하러 가기 >"}</div>
                        </div>
                    </div>
                    {/* {!closeExpandButton ? 
                    <div onClick={()=>{expandReviewHeight()}} className="expandButton">
                        <ExpandIcon width={25} color={"rgba(0,0,0,0.36)"} />
                    </div> 
                    : null} */}
                </SwiperSlide>
                <SwiperSlide className={`gallery`}>
                    <div className="subHeader">
                        <div className="backButton slideBackButton">
                            <BackButton width={15} color={"rgba(0,0,0,0.9)"}/>
                        </div>
                        {`${shopPageContent.place_name} 사진(${shopPageContent.place_provided_photo_list.length + shopPageContent.place_inside_photo_list.length + shopPageContent.place_food_photo_list.length})`}
                    </div>
                    <nav className="galleryType">
                        <div onClick={()=>{setGalleryType('store')}} className={galleryType==='store'?'active':''}>{`가게(${shopPageContent.place_provided_photo_list.length})`}</div>
                        <div onClick={()=>{setGalleryType('inside')}} className={galleryType==='inside'?'active':''}>{`내부(${shopPageContent.place_inside_photo_list.length})`}</div>
                        <div onClick={()=>{setGalleryType('food')}} className={galleryType==='food'?'active':''}>{`음식(${shopPageContent.place_food_photo_list.length})`}</div>
                    </nav>
                    <div className="pictures">
                        {gallery.map((imgSrc, index) => {
                            if (index % 2 === 0) {
                                return (<div className="twoPictures" key={index}>
                                    <div><img src={gallery[index]} alt={index} onClick={()=>{slideOpen(gallery, galleryType, index)}}/></div>
                                    <div>{gallery.length!==index+1?<img src={gallery[index+1]} alt={index+1} onClick={()=>{slideOpen(gallery, galleryType, index+1)}}/>:null}</div>
                                </div>);
                            }
                        })}
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className="subNavbar">
                <div className="buttons">
                    <div className="likeButton" onClick={()=>{clickLike(shopPageContent.rank)}}>
                        {shopPageContent.place_likes
                        ? <HeartFilledIcon width={25} color={"#f17474"}/>
                        : <HeartIcon width={25} color={"#a3a3a3"}/>}
                        찜하기
                    </div>
                    <div className="shareButton"><ShareIcon width={22} color={"#a3a3a3"}/>공유</div>
                </div>
            </div> 
        </div></>
    );
}

export default ShopModal;