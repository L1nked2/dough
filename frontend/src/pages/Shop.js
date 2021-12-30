import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Shop.css';
import { closeShopPage, tempLikeChange, setShopPageContents } from '../actions/homePageInfo';
import { openListPage } from '../actions/recommendPageInfo';
import { likeChange } from '../actions/myPlaceList';
import CallModal from '../components/main/CallModal';
import { CSSTransition } from 'react-transition-group';

import BackButton from '../components/icon/Back';
import WonIcon from '../components/icon/Won';
import LocationIcon from '../components/icon/Location';
import MapIcon from '../components/icon/MapBold';
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

function ShopModal() {
    const dispatch = useDispatch();
    const [shopPageContent, setShopPageContents] = useState({...useSelector(state => state.homePageInfo.shopPageContent), isLoaded: false});
    const listPageIsOpen = useSelector(state => state.recommendPageInfo.listPageIsOpen);

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
    function expandReviewHeight () {
        if (reviewContent.current.scrollHeight >= (reviewHeight + eachReview.current.scrollHeight*1.0125*3)) {
            setReviewHeight(reviewHeight + eachReview.current.scrollHeight*1.0125*3);
        }
        else {
            setReviewHeight(reviewContent.current.scrollHeight);
            setCloseExpandButton(true);
        }
    }
    
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
        if (listPageIsOpen) {dispatch(openListPage())}
    };
    const goBack = () => {
        window.history.back();
    }

    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    function openCallModal () {
        setIsCallModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    SwiperCore.use([Navigation]);

    const [galleryType, setGalleryType] = useState("store");
    const [gallery, setGallery] = useState([]);
    useEffect(() => {
        // axios 
        if (gallery.length !== 0) {
            if (galleryType === "store"){setGallery(shopPageContent.placeData.place_photo_list);}
            else if (galleryType === "inside"){setGallery(shopPageContent.placeData.place_photo_list);}
            else if (galleryType === "food"){setGallery(shopPageContent.placeData.place_photo_list);}
        }
    }, [galleryType]);

    useEffect(() => {
        const getShopData = async () => {
            const res = await axios({
                method: 'POST',
                url: 'https://dough-survey.web.app/api/place',
                headers: {
                    "Content-Type": `application/json`
                },
                data: {stationId: "00000001", placeId: "00000001"},
            }).then(response => {
                return response.data;
            }).catch(err => {
                console.log(err);
            });
            setShopPageContents({reviews: shopPageContent.reviews,
                                name: shopPageContent.name,
                                price: shopPageContent.price,
                                businessHours: shopPageContent.businessHours,
                                breakTime: shopPageContent.breakTime,
                                holiday: shopPageContent.holiday,
                                menuList: shopPageContent.menuList,
                                isLoaded: true,
                                ...res});
        }
        getShopData();
        window.history.pushState({page: "shop_modal"}, "shop_modal");
        window.addEventListener("popstate",closePage);
        return () => {
            window.removeEventListener("popstate",closePage);
        }
    }, [])
    useEffect(() => {
        console.log(shopPageContent)
        if (shopPageContent.isLoaded){
            setReviewHeight(eachReview.current.scrollHeight * 1.1875 * 2.4);
            setMenuHeight(eachMenu.current.scrollHeight * 3);
            setGallery(shopPageContent.placeData.place_photo_list);
        }
    }, [shopPageContent])
    return (
        <div className="shopPage" id="shopPage">
        {shopPageContent.isLoaded && <>
            <CSSTransition in={isCallModalOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
                        <CallModal setIsCallModalOpen={setIsCallModalOpen} callNum={"010-5250-0316"}/>
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
                    <div className="name">{shopPageContent.name}</div>
                    <div className="simpleInfo">
                        <span className="price">
                            <span className="temp"><WonIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/>{shopPageContent.price}</span>
                        </span>
                        <span className="location"><LocationIcon width={"1em"} color={"rgba(0,0,0,0.65)"}/>{`역에서 ${shopPageContent.distance}`}</span>
                    </div>
                    <div className="fourPictures" >
                        <div className="twoPictures">
                            <img src={shopPageContent.placeData.place_photo_list[0]} alt="first" />
                            <img src={shopPageContent.placeData.place_photo_list[1]} alt="second" />
                        </div>
                        <div className="twoPictures">
                            <img src={shopPageContent.placeData.place_photo_list[2]} alt="third" />
                            <img src={shopPageContent.placeData.place_photo_list[3]} alt="fourth" />
                        </div>
                    </div>
                    <div className="information">
                        <div className="eachInformation">
                            <div className="icon"><MapIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"} /></div>
                            <div className="contents">
                                <div style={{color: "rgba(0,0,0,0.9)"}}>{shopPageContent.placeData.place_road_address}</div>
                                <div style={{color: "rgba(0,0,0,0.36)"}}>{`( 지번 ) ${shopPageContent.placeData.place_road_address}`}</div>
                            </div>
                        </div>
                        <div className="eachInformation">
                            <div className="icon"><ClockIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"} /></div>
                            <div className="contents">
                                <div style={{color: "rgba(0,0,0,0.9)"}}>{`(영업 시간) ${shopPageContent.businessHours}`}</div>
                                <div style={{color: "rgba(0,0,0,0.9)"}}>{`(쉬는 시간) ${shopPageContent.breakTime}`}</div>
                                <div style={{color: "#3FB8D5", fontFamily: "SpoqaMedium"}}>{`휴무일 : ${shopPageContent.holiday}`}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='callButton' onClick={openCallModal}>
                        <div className='button'><CallIcon width={"1.2em"} color={"rgba(0,0,0,0.36)"}/></div>
                        <div className='call'>전화하기</div>
                    </div>
                    <div className="information">
                        <div className="eachInformation">
                            <div className="icon"><MenuIcon height={"1.8em"} color={"rgba(0,0,0,0.36)"}/></div>
                            <div className="contents">
                                <div className='menuList' style={{maxHeight: `${menuHeight}px`}} ref={menuContent}>
                                    {shopPageContent.menuList.map((menu, index) => {
                                        return (
                                            <div className="eachMenu" key={index} ref={index===0?eachMenu:null}>
                                                <div className="name">{menu[0]}</div>
                                                <div className="line"/>
                                                <div className="price">{menu[1]}</div>
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
                            <div className="icon naver"><NaverIcon height={"1.6em"} color={"#a3a3a3"} /></div>
                            <a className="contents" href={shopPageContent.placeData.place_naver_link} target="_blank">{shopPageContent.placeData.place_naver_link}</a>
                        </div>
                        <div className="eachInformation">
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
                        </div>
                    </div>
                    {!closeExpandButton ? 
                    <div onClick={()=>{expandReviewHeight()}} className="expandButton">
                        <ExpandIcon width={25} color={"rgba(0,0,0,0.36)"} />
                    </div> 
                    : null}
                </SwiperSlide>
                <SwiperSlide className={`gallery`}>
                    <div className="subHeader">
                        <div className="backButton slideBackButton">
                            <BackButton width={15} color={"rgba(0,0,0,0.9)"}/>
                        </div>
                        {`${shopPageContent.name} 사진(${gallery.length})`}
                    </div>
                    <nav className="galleryType">
                        <div onClick={()=>{setGalleryType('store')}} className={galleryType==='store'?'active':''}>{`가게()`}</div>
                        <div onClick={()=>{setGalleryType('inside')}} className={galleryType==='inside'?'active':''}>{`내부()`}</div>
                        <div onClick={()=>{setGalleryType('food')}} className={galleryType==='food'?'active':''}>{`음식()`}</div>
                    </nav>
                    <div className="pictures">
                        {gallery.map((imgSrc, index) => {
                            if (index % 2 === 0) {
                                return (<div className="twoPictures" key={index}>
                                    <img src={gallery[index]} alt={index} />
                                    {gallery.length!==index+1?<img src={gallery[index+1]} alt={index+1} />:null}
                                </div>);
                            }
                        })}
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className="subNavbar">
                <div className="buttons">
                    <div className="likeButton" onClick={()=>{clickLike(shopPageContent.rank)}}>
                        {shopPageContent.like
                        ? <HeartFilledIcon width={25} color={"#f17474"}/>
                        : <HeartIcon width={25} color={"#a3a3a3"}/>}
                        좋아요
                    </div>
                    <div className="shareButton"><ShareIcon width={22} color={"#a3a3a3"}/>공유</div>
                </div>
            </div> 
            </>}
        </div>
    );
}

export default ShopModal;


const sampleShop = {
    name: "임실치돈",
    category: "음식점",
    menuCategory: "돈가스",
    like: false,
    price: "1 ~ 2만원",
    distance: "역에서 200m",
    firstImgSrc: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
    secondImgSrc: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
    thirdImgSrc: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
    fourthImgSrc: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
    roadAddress: "서울특별시 강남구 강남대로 110길 26",
    lotAddress: "서울시 강남구 역삼동 811-4",
    businessHours: "11:00-22:00",
    breakTime: "14:00-17:00",
    holiday: "월, 화",
    menuList: [
        ["등심 돈카츠", "13,000"],
        ["안심 돈카츠", "14,000"],
        ["멘치카츠", "17,000"],
        ["스페셜 등심 돈카츠", "16,000"],
        ["프리미엄 부타 돈카츠", "25,000"]
    ],
    naverLink: "https://m.map.naver.com/",
    reviews: [
        {title: "강남역 돈까스 맛집 추천, 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "신논현 돈까스 찐맛집 : 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "수요미식회 돈까스로 유명한 곳,...",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "강남역 돈까스 맛집 추천, 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "신논현 돈까스 찐맛집 : 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "수요미식회 돈까스로 유명한 곳,...",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
         {title: "강남역 돈까스 맛집 추천, 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집 안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "신논현 돈까스 찐맛집 : 정돈",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
        {title: "수요미식회 돈까스로 유명한 곳,...",
         content: "안녕하세요:) 돈까스는 저의 소울 푸드입니다.. 강남역 갈\
         떄마다 항상 웨이팅으로 가득했던 정돈이 드디어 무리 맛집",
         link: "https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=alswl9476&logNo=221740267533"},
    ]
}