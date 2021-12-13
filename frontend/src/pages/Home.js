import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../components/common/Header'
import MyShop from '../components/main/MyShop'
import CollapseResult from '../components/main/CollapseResult'
import ShopModal from './Shop'
import LocationModal from './Location'
import Navbar from '../components/common/Navbar';
import { initialMenuState } from '../actions/homePageInfo'

import { CSSTransition } from "react-transition-group";
import { useDispatch, useSelector } from 'react-redux';
import { initializeList } from '../actions/myPlaceList';

function Home() {
  const shopPageIsOpen = useSelector((state) => state.homePageInfo.shopPageIsOpen);
  const locationPageIsOpen = useSelector((state) => state.homePageInfo.locationPageIsOpen);
  const fullFoodList = useSelector((state) => state.homePageInfo.fullFoodList); 
  const fullDrinkList = useSelector((state) => state.homePageInfo.fullDrinkList); 
  const initializedMenuList = useSelector((state) => state.homePageInfo.initializedList); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeList(sampleList));
    if (!initializedMenuList) {
      dispatch(initialMenuState(fullFoodList, fullDrinkList))
    }
    return null;
  },[])
  
  return (
    <div className="Home-page">
      <CSSTransition in={shopPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <ShopModal />
      </CSSTransition>
      <CSSTransition in={locationPageIsOpen} unmountOnExit classNames="fade" timeout={{enter: 200, exit: 200}}>
        <LocationModal />
      </CSSTransition>
      
      <Header />
      <CollapseResult />
      <MyShop />
      <Navbar page={"home"}/>
    </div>
  );
}

export default Home;


/* 아래 부분은 axios post로 DB에서 받아올 데이터 */
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

const sampleList = [
  {...sampleShop, rank: 1},
  {...sampleShop, rank: 2, name: '치돈치돈'},
  {...sampleShop, rank: 3, name: '바른돈가'},
  {...sampleShop, rank: 4, name: '정돈'},
  {...sampleShop, rank: 5},
  {...sampleShop, rank: 6}
]