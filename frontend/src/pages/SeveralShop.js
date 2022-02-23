import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert2';
import './Shop.css';
import CallModal from '../components/main/CallModal';
import ClipLoader from "react-spinners/ClipLoader";
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

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

import SwiperCore, {
    Navigation
} from 'swiper';
import ImageSlideShow from '../components/main/ImageSlideShow';
import ExpandIcon2 from '../components/icon/Expand2';

function Shop () {
    const {stationId, uuid} = useParams();
    SwiperCore.use([Navigation]);
    
    const [shopPageContent, setShopPageContent] = useState({});

    function clickLike () {
        setShopPageContent({...shopPageContent, place_likes: !shopPageContent.place_likes});
    }
    function copyLink () {
        const shareURL = document.createElement('textarea');
        shareURL.textContent = `${window.location.origin}/shop/${"cd853a8d-3376-55fb-858c-0d2bfa16aa48"}/${shopPageContent.place_uuid}`;
        document.body.append(shareURL);
        shareURL.select();
        document.execCommand('copy');
        const Toast = swal.mixin({
            toast: true, 
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', swal.stopTimer)
                toast.addEventListener('mouseleave', swal.resumeTimer)
            }
        });
        Toast.fire({
            icon: 'success',
            title: '클립보드에 복사되었습니다.'
        });
        shareURL.remove();
    }
    function goHome() {
        window.location.href = "/home";
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
    const timeContent = useRef(null);
    const eachTime = useRef(null);
    const [timeHeight, setTimeHeight] = useState(0)
    const [timeFold, setTimeFold] = useState(true);
    useEffect(() => {
        if (!timeFold){setTimeHeight(timeContent.current.scrollHeight);}
    },[timeFold])

    const [galleryType, setGalleryType] = useState("store");
    const [gallery, setGallery] = useState([]);
    useEffect(() => {
        // axios 
        if (galleryType === "store"){setGallery(shopPageContent.place_provided_photo_list);}
        else if (galleryType === "inside"){setGallery(shopPageContent.place_inside_photo_list);}
        else if (galleryType === "food"){setGallery(shopPageContent.place_food_photo_list);}
    }, [galleryType]);

    useEffect (() => {
        const getPlaceDB = async () => { 
            const res = await axios({
                method: 'POST',
                url: 'https://dough-survey.web.app/api/info/place',
                headers: {
                    "Content-Type": `application/json`
                },
                data: {stationId: stationId, userToken: '', placeId: uuid},
            }).then(response => {
                console.log(response.data);
                setGallery(response.data.placeInfo.place_provided_photo_list);
                setShopPageContent(response.data.placeInfo);
            }).catch(err => {
                console.log(err);
            });
        }
        getPlaceDB(); // 추후에 firebase 속도가 빨라지면 uuid만 갖고 open한 뒤 여기에서 shopPageContent를 받아와 저장할 예정
    }, []);
    
    useEffect (() => {
        if (Object.keys(shopPageContent).length !== 0){
            setTimeHeight(eachTime.current.scrollHeight);
            setMenuHeight(eachMenu.current.scrollHeight * 3);
            setStyleDropdown({left: distance.current.offsetLeft,
                              paddingTop: distance.current.scrollHeight,
                              minWidth: distance.current.scrollWidth+2,});
        }
    }, [shopPageContent]);

    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    function openCallModal () {
        setIsCallModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const [isPhotoOpen, setIsPhotoOpen] = useState(false);
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
        setIsPhotoOpen(true)
    }

    const distance = useRef(null);
    const dropdown = useRef(null);
    const [dropdownHeight, setDropdownHeight] = useState(0);
    const stationList = ['동대문', '을지로4가', '동대문역사문화공원'];
    const distanceList = ['1.2km', '1.6km', '1.8km'];
    const [distanceTarget, setDistanceTarget] = useState(0);
    const [styleDropdown, setStyleDropdown] = useState({});
    function dropdownOpen() {
        if (dropdownHeight === 0){setDropdownHeight(dropdown.current.scrollHeight);}
        else {setDropdownHeight(0);}
    }
    function changeDistanceTarget(index) {
        setDistanceTarget(index);
        dropdownOpen();
    }

    window.onpopstate = function () {
        if (isPhotoOpen) {
            setIsPhotoOpen(false);
        }
    }
    return (Object.keys(shopPageContent).length===0 ? 
        <div style={{width:"100%", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}><ClipLoader/></div> : 
        <>
        <CSSTransition in={isPhotoOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
            <ImageSlideShow imgList={photoSlide} title={photoSlideTitle} index={photoSlideIndex} closeFunc={()=>{setIsPhotoOpen(false)}}/>
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
                        <div className="backButton" onClick={goHome}>
                            <BackButton width={15} color={"rgba(0,0,0,0.9)"}/>
                        </div>
                    </div>
                    <div className="name">{shopPageContent.place_name}</div>
                    <div className="simpleInfo">
                        {shopPageContent.place_menu_info &&
                            <span className="price">
                                <WonIcon width={"1em"} color={"#575757"}/>
                                {`${parseInt(parseInt(shopPageContent.place_menu_info[0].price.split(','))/10)} ~ ${parseInt(parseInt(shopPageContent.place_menu_info[0].price.split(','))/10)+1}만원`}
                            </span>
                        }
                        <span className="distance" ref={distance} onClick={dropdownOpen}>
                            <LocationIcon width={"1em"} color={"#575757"}/>
                            {`${stationList[distanceTarget]} ${distanceList[distanceTarget]}`}
                            <div><ExpandIcon2 width={"1em"} color={"#575757"} /></div>
                        </span>
                        <div className="dropdown" style={{...styleDropdown, maxHeight: dropdownHeight}} ref={dropdown}>
                            {stationList.map((station, index) => {
                                if (index !== distanceTarget){
                                    return (
                                        <div key={index} onClick={()=>{changeDistanceTarget(index)}}>{`${station} ${distanceList[index]}`}</div>
                                    );
                                }
                            })}
                        </div>
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
                            <div className="contents" >
                                <div className="timeList" style={{maxHeight: `${timeHeight}px`}} ref={timeContent}>
                                    {shopPageContent.place_operating_time ? shopPageContent.place_operating_time.map((time, index) => {
                                        if (!time.isDayOff) {
                                            return (
                                                <div key={index} style={{color: "rgba(0,0,0,0.9)"}} ref={index===0?eachTime:null}>{`(${time.description} ${time.type}) ${time.startTime} - ${time.endTime}`}{timeFold && shopPageContent.place_operating_time.length!==1 && <span className="more" onClick={()=>{setTimeFold(false)}}>... 더보기</span>}</div>
                                            );
                                        }
                                    })
                                    : <div style={{color: "#A3A3A3"}}>영업시간 정보가 없습니다</div>}
                                </div>
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
                                    {shopPageContent.place_menu_info ? shopPageContent.place_menu_info.map((menu, index) => {
                                        return (
                                            <div className="eachMenu" key={index} ref={index===0?eachMenu:null}>
                                                <div className="name">{menu.name}</div>
                                                <div className="line"/>
                                                <div className="price">{menu.price}</div>
                                            </div>
                                        );
                                    })
                                    : <div className="eachMenu">업체 문의</div> }
                                </div>
                                <div onClick={()=>{changeMenuHeight()}} className='expandButton' style={{transform:`rotate(${menuFold?"0":"180"}deg)`}}>
                                    <ExpandIcon width={"1.2em"} color={"rgba(0,0,0,0.36)"} />
                                </div>
                            </div>
                        </div>
                        <div className="eachInformation">
                            <div className="icon"><NaverIcon height={"1.6em"} color={"#a3a3a3"} /></div>
                            <div className="contents">
                                <div>네이버 지도 바로가기</div>
                                <a href={shopPageContent.place_naver_link} target="_blank">{shopPageContent.place_naver_link}</a>
                            </div>
                        </div>
                    </div>
                    <div className="infoChange">
                        <div className="icon"><img src={info_icon} alt="info_icon"/></div>
                        <div className="contents">
                            <div>{"정보 수정 요청하러 가기 >"}</div>
                        </div>
                    </div>
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
                    <div className="likeButton" onClick={clickLike}>
                        {shopPageContent.place_likes
                        ? <HeartFilledIcon width={25} color={"#f17474"}/>
                        : <HeartIcon width={25} color={"#a3a3a3"}/>}
                        찜하기
                    </div>
                    <div className="shareButton" onClick={copyLink}><ShareIcon width={22} color={"#a3a3a3"}/>공유</div>
                </div>
            </div> 
        </div></>
    );
}

export default Shop;