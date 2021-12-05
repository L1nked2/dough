import React, { useState, useEffect, useRef } from 'react';
import './Shop.css';

import BackButton from '../components/icon/Back';
import WonIcon from '../components/icon/Won';
import LocationIcon from '../components/icon/Location';
import MapIcon from '../components/icon/MapBold';
import ClockIcon from '../components/icon/Clock';
import MenuIcon from '../components/icon/Menu';
import NaverIcon from '../components/icon/Naver';
import ExpandIcon from '../components/icon/Expand';
import HeartIcon from '../components/icon/HeartSub';
import HeartFilledIcon from '../components/icon/HeartFilled';
import ShareIcon from '../components/icon/Share';
import naverBlogIcon from "../img/naverblog.svg";

function ShopModal(props) {
    // const [shopPageContent, setShopPageContent] = useState(props.shopPageContents);
    const [shopPageContent, setShopPageContent] = useState(sampleShop);

    function clickLike () {
        setShopPageContent({
            ...shopPageContent, like: !shopPageContent.like
        });
    }

    function closePage () {
        props.setShopPageContents(shopPageContent);
        props.closePage();
    }

    const reviewContent = useRef(null);
    const eachReview = useRef(null);
    const [reviewHeight, setReviewHeight] = useState(340);
    const [closeExpandButton, setCloseExpandButton] = useState(false);
    function expandReviewHeight () {
        if (reviewContent.current.scrollHeight >= (reviewHeight + 359)) {
            setReviewHeight(reviewHeight + 359);
        }
        else {
            setReviewHeight(reviewContent.current.scrollHeight);
            setCloseExpandButton(true);
        }
    }
    
    const goBack = () => {
        window.history.back();
        props.closePage();
    }
    useEffect (() => {
        window.history.pushState({page: "shop_modal"}, "shop_modal");
        window.addEventListener("popstate",props.closePage);
        return () => {
            window.removeEventListener("popstate",props.closePage);
        }
    }, []);

    return (
        <div className="shopPage">
            <div className="subHeader">
                <div onClick={() => {goBack()}} className="backButton">
                    <BackButton width={15} color={"rgba(0,0,0,0.9)"}/>
                </div>
            </div>
            <div className="name">{shopPageContent.name}</div>
            <div className="simpleInfo">
                <span className="price">
                    <span className="temp"><WonIcon width={15} color={"rgba(0,0,0,0.65)"}/>{shopPageContent.price}</span>
                </span>
                <span className="location"><LocationIcon width={15} color={"rgba(0,0,0,0.65)"}/>{shopPageContent.distance}</span>
            </div>
            <div className="fourPictures">
                <div className="twoPictures">
                    <img src={shopPageContent.firstImgSrc} alt="first" />
                    <img src={shopPageContent.secondImgSrc} alt="second" />
                </div>
                <div className="twoPictures">
                    <img src={shopPageContent.thirdImgSrc} alt="third" />
                    <img src={shopPageContent.fourthImgSrc} alt="fourth" />
                </div>
            </div>
            <div className="information">
                <div className="eachInformation">
                    <div className="icon"><MapIcon height={30} color={"rgba(0,0,0,0.36)"} /></div>
                    <div className="contents">
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{shopPageContent.roadAddress}</div>
                        <div style={{color: "rgba(0,0,0,0.36)"}}>{`( 지번 ) ${shopPageContent.lotAddress}`}</div>
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon"><ClockIcon height={32} color={"rgba(0,0,0,0.36)"} /></div>
                    <div className="contents">
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{`(영업 시간) ${shopPageContent.businessHours}`}</div>
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{`(쉬는 시간) ${shopPageContent.breakTime}`}</div>
                        <div style={{color: "#3FB8D5", fontFamily: "SpoqaMedium"}}>{`휴무일 : ${shopPageContent.holiday}`}</div>
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon"><MenuIcon height={27} color={"rgba(0,0,0,0.36)"}/></div>
                    <div className="contents">
                        {shopPageContent.menuList.map((menu, index) => {
                            return (
                                <div className="eachMenu" key={index}>
                                    <div className="name">{menu[0]}</div>
                                    <div className="line"/>
                                    <div className="price">{menu[1]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon naver"><NaverIcon height={25} color={"#a3a3a3"} /></div>
                    <a className="contents" href={shopPageContent.naverLink} target="_blank">{shopPageContent.naverLink}</a>
                </div>
                <div className="eachInformation">
                    <div className="icon naver"><img src={naverBlogIcon} style={{width: "27px"}}/></div>
                    <div className="contents reviews" style={{height: `${reviewHeight}px`}} ref={reviewContent}>
                        리뷰
                        {shopPageContent.reviews.map(review => {
                            return (
                                <a className="eachReview" href={review.link} target="_blank">
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
                <ExpandIcon width={20} color={"rgba(0,0,0,0.36)"} />
            </div> 
            : null}


            <div className="subNavbar">
                <div className="buttons">
                    <div className="likeButton" onClick={()=>{clickLike()}}>
                        {shopPageContent.like
                        ? <HeartFilledIcon width={25} color={"#f17474"}/>
                        : <HeartIcon width={25} color={"#a3a3a3"}/>}
                        좋아요
                    </div>
                    <div className="shareButton"><ShareIcon width={22} color={"#a3a3a3"}/>공유</div>
                </div>
            </div>
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