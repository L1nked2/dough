import React, { useState, useEffect, useRef } from 'react';
import './RecommendList.css';
import ShopInList from '../components/recommend/ShopInList';

import BackButton from '../components/icon/Back';
import ShareIcon from '../components/icon/Share';

function RecommendListModal(props) {
    // const [listPageContent, setListPageContent] = useState(props.pageContents);
    const [listPageContent, setListPageContent] = useState(sampleList);
    
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
        <div className="listPage" id="listPage">
            <div className="subHeader">
                <div onClick={() => {goBack()}} className="backButton"><BackButton width={15} color={"rgba(0,0,0,0.9)"}/></div>
                <div className="shareButton"><ShareIcon width={20} color={"rgba(0,0,0,0.9)"}/></div>
            </div>
            <div className="title">{listPageContent.title}</div>
            <div className="subtitle">{listPageContent.subtitle}</div>
            <div className="content">
                <div className="target">{`for ${listPageContent.target}`}</div>
                {listPageContent.shops.map((elem) => {
                    return (
                        <ShopInList elem={elem} />
                    );
                })}
            </div>
        </div>
    );
}

export default RecommendListModal;


const sampleList = {
    title: "따뜻한 감성의\n강남역 주변 카페 3곳",
    subtitle: "따뜻한 감성을 지닌 강남역 주변 카페",
    target: "주택가 레스토랑",
    shops: [
        {name: "빙봉",
         location: "강남",
         distance: "역에서 200m",
         price: "1 ~ 2만원",
         menuCategory: "브런치",
         like: false,
         spaceImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         spaceImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg3: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         simple: "당근케이크가 맛있는 휴양지 느낌의 카페",
         detailed: "에이비카페는 각 층마다 다른 컨셉과 분위기를 즐길 수 있는 카페인데, 전반적으로 여행지에서 만날 법한 휴양지 느낌이 나고, 따뜻한 색감의 조명이 있는 곳입니다.\n커피는 기본이고 다양한 종류의 차 메뉴가 있고, 라떼, 에이드 종류도 함께 판매되고 있습니다. 디저트로는 다양한 케이크 종류가 있는데 당근케이크가 인기 메뉴입니다. ",
         tags: "#성동구민종합센터 부설주차장 이용 #4인 가능 #예약 불가"},

         {name: "리마크스",
         location: "강남",
         distance: "역에서 200m",
         price: "1 ~ 2만원",
         menuCategory: "칵테일",
         like: false,
         spaceImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         spaceImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg3: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         simple: "모히토 맛있는 뷰 맛집 카페",
         detailed: "에이비카페는 각 층마다 다른 컨셉과 분위기를 즐길 수 있는 카페인데, 전반적으로 여행지에서 만날 법한 휴양지 느낌이 나고, 따뜻한 색감의 조명이 있는 곳입니다.\n커피는 기본이고 다양한 종류의 차 메뉴가 있고, 라떼, 에이드 종류도 함께 판매되고 있습니다. 디저트로는 다양한 케이크 종류가 있는데 당근케이크가 인기 메뉴입니다. ",
         tags: "#성동구민종합센터 부설주차장 이용 #4인 가능 #예약 불가"},

         {name: "카페온화",
         location: "강남",
         distance: "역에서 200m",
         price: "1 ~ 2만원",
         menuCategory: "케이크",
         like: false,
         spaceImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg1: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         spaceImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg2: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         menuImg3: "https://image.beansdrawer.com/short-hair/mackerel/n00-08.jpg",
         simple: "수플레 팬 케이크가 유명한 따스한 분위기의 카페",
         detailed: "에이비카페는 각 층마다 다른 컨셉과 분위기를 즐길 수 있는카페인데, 전반적으로 여행지에서 만날 법한 휴양지 느낌이 나고, 따뜻한 색감의 조명이 있는 곳입니다.\n커피는 기본이고 다양한 종류의 차 메뉴가 있고, 라떼, 에이드 종류도 함께 판매되고 있습니다. 디저트로는 다양한 케이크 종류가 있는데 당근케이크가 인기 메뉴입니다. ",
         tags: "#성동구민종합센터 부설주차장 이용 #4인 가능 #예약 불가"},
    ]
}
