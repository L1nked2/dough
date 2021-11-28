import React, { useState, useRef } from 'react';
import './Shop.css';
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
    const [reviewHeight, setReviewHeight] = useState(350);
    const [closeExpandButton, setCloseExpandButton] = useState(false);
    function expandReviewHeight () {
        if (reviewContent.current.scrollHeight >= (reviewHeight + 364)) {
            setReviewHeight(reviewHeight + 364);
        }
        else {
            setReviewHeight(reviewContent.current.scrollHeight);
            setCloseExpandButton(true);
        }
    }
    
    return (
        <div className="shopPage">
            <div className="subHeader">
                <div onClick={() => {closePage()}} className="backButton"><BackButton width={15}/></div>
            </div>
            <div className="name">{shopPageContent.name}</div>
            <div className="simpleInfo">
                <span className="price"><span className="temp"><WonIcon width={15}/>{shopPageContent.price}</span></span>
                <span className="location"><LocationIcon width={15}/>{shopPageContent.distance}</span>
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
                    <div className="icon"><MapIcon height={30} /></div>
                    <div className="contents">
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{shopPageContent.roadAddress}</div>
                        <div style={{color: "rgba(0,0,0,0.36)"}}>{`( 지번 ) ${shopPageContent.lotAddress}`}</div>
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon"><ClockIcon height={32} /></div>
                    <div className="contents">
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{`(영업 시간) ${shopPageContent.businessHours}`}</div>
                        <div style={{color: "rgba(0,0,0,0.9)"}}>{`(쉬는 시간) ${shopPageContent.breakTime}`}</div>
                        <div style={{color: "#3FB8D5", fontFamily: "SpoqaMedium"}}>{`휴무일 : ${shopPageContent.holiday}`}</div>
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon"><MenuIcon height={27} /></div>
                    <div className="contents">
                        {shopPageContent.menuList.map(menu => {
                            return (
                                <div className="eachMenu">
                                    <div className="name">{menu[0]}</div>
                                    <div className="line"/>
                                    <div className="price">{menu[1]}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="eachInformation">
                    <div className="icon naver"><NaverIcon height={25} /></div>
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
            {!closeExpandButton ? <div onClick={()=>{expandReviewHeight()}} className="expandButton"><ExpandIcon width={20} /></div> : null}


            <div className="subNavbar">
                <div className="buttons">
                    <div className="likeButton" onClick={()=>{clickLike()}}>
                        {shopPageContent.like?<HeartFilledIcon width={25}/>:<HeartIcon width={25}/>}
                        좋아요
                    </div>
                    <div className="shareButton"><ShareIcon width={22}/>공유</div>
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


function BackButton(props){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 9.928 15.093">
            <path id="패스_885" data-name="패스 885" d="M0,7,6.135,0l6.135,7" transform="translate(1.517 13.682) rotate(-90)" fill="none" stroke="rgba(0,0,0,0.9)" stroke-linecap="round" stroke-width="2"/>
        </svg>
    );
}
function WonIcon(props){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 10 8">
            <path id="패스_853" data-name="패스 853" d="M231.5,7.5h-.337l.818-2.863a.5.5,0,0,0-.962-.275l-.9,3.137H228.6L227.47,4.332a.5.5,0,0,0-.941,0L225.4,7.5h-1.521l-.9-3.137a.5.5,0,0,0-.962.275l.818,2.863H222.5a.5.5,0,0,0,0,1h.622l.9,3.137a.5.5,0,0,0,.952.031L226.1,8.5h1.8l1.132,3.168A.5.5,0,0,0,229.5,12h.016a.5.5,0,0,0,.465-.363l.9-3.137h.622a.5.5,0,0,0,0-1ZM227,5.986l.54,1.514h-1.081Zm-2.447,3.878L224.163,8.5h.877Zm4.895,0L228.959,8.5h.877Z" transform="translate(-222 -4)" fill="rgba(0,0,0,0.65)"/>
        </svg>
    );
}
function LocationIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 11.2 11.2">
            <path id="패스_892" data-name="패스 892" d="M183.5,2A5.5,5.5,0,1,0,189,7.5,5.5,5.5,0,0,0,183.5,2Zm.55,9.862V11.3a.55.55,0,0,0-1.1,0v.557a4.4,4.4,0,0,1-3.812-3.812h.558a.55.55,0,1,0,0-1.1h-.558a4.4,4.4,0,0,1,3.812-3.812V3.7a.55.55,0,0,0,1.1,0V3.138a4.405,4.405,0,0,1,3.812,3.812H187.3a.55.55,0,1,0,0,1.1h.557A4.405,4.405,0,0,1,184.05,11.862Z" transform="translate(-177.9 -1.9)" fill="rgba(0,0,0,0.65)" stroke="#fff" stroke-width="0.2"/>
        </svg>
    );
}
function HeartIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20.008 17.998">
            <path id="패스_866" data-name="패스 866" d="M7.5,5a4,4,0,0,1,3,1.39l.76.89a1,1,0,0,0,1.52,0l.76-.89A4,4,0,0,1,16.5,5,3.49,3.49,0,0,1,20,8.35c.1,2.94-3.06,5.82-7.86,10.17h0l-.1.09-.13-.11C7.07,14.18,3.9,11.3,4,8.35A3.49,3.49,0,0,1,7.5,5m0-2A5.49,5.49,0,0,0,2,8.27c-.14,3.88,3.29,7,8.55,11.76l.78.71a1,1,0,0,0,1.34,0l.78-.7C18.7,15.27,22.13,12.16,22,8.28A5.5,5.5,0,0,0,16.5,3,6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3Z" transform="translate(-1.996 -3)" fill="#a3a3a3"/>
        </svg>
    );
}
function HeartFilledIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20.008 17.998">
            <path id="패스_866" data-name="패스 866" d="M7.5,3A5.49,5.49,0,0,0,2,8.27c-.14,3.88,3.29,7,8.55,11.76l.78.71a1,1,0,0,0,1.34,0l.78-.7C18.7,15.27,22.13,12.16,22,8.28A5.5,5.5,0,0,0,16.5,3,6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3Z" transform="translate(-1.996 -3)" fill="#f17474"/>
        </svg>
    );
}
function ShareIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 17.5 19.5">
            <g id="그룹_254" data-name="그룹 254" transform="translate(-184 -748)">
                <g id="타원_263" data-name="타원 263" transform="translate(195.5 749)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <g id="패스_6638" data-name="패스 6638" transform="translate(195.5 761.5)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <g id="타원_265" data-name="타원 265" transform="translate(185 755.5)" fill="none">
                <path d="M2.5-1A3.5,3.5,0,1,1-1,2.5,3.5,3.5,0,0,1,2.5-1Z" stroke="none"/>
                <path d="M 2.5 0.5 C 1.397200107574463 0.5 0.5 1.397200107574463 0.5 2.5 C 0.5 3.602799892425537 1.397200107574463 4.5 2.5 4.5 C 3.602799892425537 4.5 4.5 3.602799892425537 4.5 2.5 C 4.5 1.397200107574463 3.602799892425537 0.5 2.5 0.5 M 2.5 -1 C 4.429910182952881 -1 6 0.5700898170471191 6 2.5 C 6 4.429910182952881 4.429910182952881 6 2.5 6 C 0.5700898170471191 6 -1 4.429910182952881 -1 2.5 C -1 0.5700898170471191 0.5700898170471191 -1 2.5 -1 Z" stroke="none" fill="#a3a3a3"/>
                </g>
                <line id="선_146" data-name="선 146" x1="5.5" y2="3" transform="translate(190.5 753.5)" fill="none" stroke="#a3a3a3" stroke-width="1.5"/>
                <line id="선_147" data-name="선 147" x2="5" y2="3" transform="translate(190.446 759)" fill="none" stroke="#a3a3a3" stroke-width="1.5"/>
            </g>
        </svg>
    );
}

function MapIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 15 20">
            <path id="패스_860" data-name="패스 860" d="M100.5,2.266A7.345,7.345,0,0,0,93,9.457c0,4.286,4.735,10.192,6.68,12.439a1.093,1.093,0,0,0,1.639,0c1.946-2.247,6.68-8.153,6.68-12.439A7.345,7.345,0,0,0,100.5,2.266ZM95.143,9.457a5.362,5.362,0,0,1,10.714,0c0,2.959-3.086,7.386-5.357,10.15C98.271,16.864,95.143,12.385,95.143,9.457Z" transform="translate(-93 -2.266)" fill="rgba(0,0,0,0.36)"/>
            <circle id="타원_112" data-name="타원 112" cx="2.5" cy="2.5" r="2.5" transform="translate(5 5)" fill="rgba(0,0,0,0.36)"/>
        </svg>
    );
  }
  
function ClockIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 20 20">
            <path id="circle" d="M232,44a8,8,0,1,1-8,8,8.009,8.009,0,0,1,8-8m0-2a10,10,0,1,0,10,10,10,10,0,0,0-10-10Z" transform="translate(-222 -42)" fill="rgba(0,0,0,0.36)"/>
            <path id="패스_839" data-name="패스 839" d="M235.224,55.579a1,1,0,0,1-.632-.225l-3.158-2.58a1,1,0,0,1-.367-.774V47a1,1,0,0,1,2,0v4.527l2.791,2.28a1,1,0,0,1-.634,1.774Z" transform="translate(-222 -41.767)" fill="rgba(0,0,0,0.36)"/>
        </svg>


    );
}
function MenuIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 18 18">
            <path id="패스_862" data-name="패스 862" d="M60,3H49a2.006,2.006,0,0,0-2,2V19a2.006,2.006,0,0,0,2,2H63a2.006,2.006,0,0,0,2-2V8Zm3,16H49V5H59V9h4Z" transform="translate(-47 -3)" fill="rgba(0,0,0,0.36)"/>
            <rect id="사각형_213" data-name="사각형 213" width="10" height="2" rx="1" transform="translate(4 12)" fill="rgba(0,0,0,0.36)"/>
            <rect id="사각형_214" data-name="사각형 214" width="5" height="2" rx="1" transform="translate(4 4)" fill="rgba(0,0,0,0.36)"/>
            <rect id="사각형_215" data-name="사각형 215" width="10" height="2" rx="1" transform="translate(4 8)" fill="rgba(0,0,0,0.36)"/>
        </svg>
    );
}
function NaverIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 18 18">
            <path id="패스_6630" data-name="패스 6630" d="M3834,834.25v-18h6.11l5.78,9.545V816.25H3852v18h-6.11l-5.78-9.273v9.273Z" transform="translate(-3834 -816.25)" fill="#a3a3a3"/>
        </svg>
    );
}
function ExpandIcon(props) {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 13.107 7.655">
            <path id="패스_7256" data-name="패스 7256" d="M0,5.864,5.139,1l5.14,4.864" transform="translate(11.693 7.278) rotate(180)" fill="none" stroke="rgba(0,0,0,0.36)" stroke-linecap="round" stroke-width="2"/>
        </svg>
    );
}