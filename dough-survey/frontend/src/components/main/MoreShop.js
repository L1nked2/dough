import { Dropdown } from 'antd';
import React, {useState, useEffect } from 'react';
import './MoreShop.css';


function MoreShop(props) {
    const [slideCategory, setSlideCategory] = useState([true, false, false]);
    const changeRestaurant = () => {setSlideCategory([true, false, false]);}
    const changeCafe = () => {setSlideCategory([false, true, false]);}
    const changeBar = () => {setSlideCategory([false, false, true]);}
  
    return (
      <div className="moreShop">
        <div className="moreShopHeader">취향 맛집 더보기</div>
        <div className="moreShopList"></div>
      </div>
    );
  }
  
  export default MoreShop;