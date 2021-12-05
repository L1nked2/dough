import React, { useState, useEffect } from 'react';
import './OtherTypeContent.css';

import RecommendContent from './RecommendContent';
import ExpandIcon from '../icon/Expand';

import sampleImage from "../../img/login_background.png";

function OtherTypeContents(props) {

    const types = ['정원 찻집', '주택가 레스토랑', '골목길 이자카야', '유럽 야외식당', '향수가게'];
    const mainTitle = "따뜻한 감성의\n강남역 주변 카페 4곳";
    const subTitle = "따뜻한 감성을 지닌 강남역 주변 카페";
    
    const recommendInfo = [
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
        { name: `에이비카페`, subText: '강남역 10분 | 따뜻하고 편안한 느낌의 힐링 카페', imgSrc: sampleImage},
    ]
    
    const contents = [
        {
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        },
        {
            mainTitle: mainTitle,
            subTitle: subTitle,
            recommendInfo: recommendInfo
        }
    ];
    
    const [otherType, setOtherType] = useState(types[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDefault, setIsDefault] = useState(true);

    const dropdownClick = () => setIsDropdownOpen(!isDropdownOpen);

    function selected (type) {
        return type === otherType;
    }
    function changeType (type) {
        setOtherType(type);
        setIsDropdownOpen(!isDropdownOpen);
        setIsDefault(false);
    }

    return (
        <div>
            <div className="menuContainer">
                <div className={`otherType ${isDefault?'default':''}`} onClick={dropdownClick} >
                    {`${otherType} 유형`}
                    <div className="icon"><ExpandIcon width={"0.6em"} color={"rgba(0, 0, 0, 0.36)"}/></div>
                </div>
                <nav id="menuType" className={`menu ${isDropdownOpen?'active':''}`}>
                    <ul>
                        {types.map((type, index) => {
                            return (
                                <li key={index} onClick={()=>{changeType(type)}}><div className={selected(type)?"active":""}>{type}</div></li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            {contents.map((elem, index) => {
                return (
                    <RecommendContent elem={elem} key={index} />
                );
            })}
        </div>
    );
}
  
export default OtherTypeContents;
  
