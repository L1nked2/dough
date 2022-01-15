import React, {useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import './Profile.css';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import ModalTemplate from '../components/common/ModalTemplate';
import CloseButton from '../components/icon/Close';
import Chevron from '../components/icon/Chevron';

import sampleImage from "../img/login_background.png";
import { customer_center, info_icon } from '../data/imgPath';

function Profile(props) {
  const [photoCategory, setPhotoCategory] = useState("space");
  const [retestModalIsOpen, setRetestModalIsOpen] = useState(false); 
  const [settingPageIsOpen, setSettingPageIsOpen] = useState(false); 
  const [noResultModalIsOpen, setNoResultModalIsOpen] = useState(false); 
  const openModal = (openFunc) => {
    openFunc(true);
    document.body.style.overflow = 'hidden';
  };

  const cluster = useSelector(state => state.userInfo.cluster);
  const currentList = useSelector(state => state.userInfo.currentList);
  console.log(cluster, currentList);
  return (
    <div className="profilePage">
      <CSSTransition in={retestModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="테스트 다시하기"
                       content={<div className="alert">
                                  {"계속을 누르면\n취향 테스트를 다시할 수 있는 화면으로\n넘어가고, 이전 취향 테스트 결과가\n삭제됩니다. 계속하시겠습니까?"}
                                </div>}
                       closeFunc={()=>{setRetestModalIsOpen(false)}}
                       applyFunc={()=>{setRetestModalIsOpen(false);window.location.replace("/survey");}}
                       applyButton="다시하기"/>
      </CSSTransition>
      <CSSTransition in={settingPageIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <SettingPage closeFunc={()=>{setSettingPageIsOpen(false)}}/>
      </CSSTransition>
      <CSSTransition in={noResultModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="MY 취향 테스트 결과"
                       content={<div className="alert">
                                  {"약속장소 취향테스트를 하지 않아\n결과를 볼 수 없습니다\n\n내 약속장소 취향 결과를 보고싶다면\n취향테스트 하러가기 버튼을 눌러주세요."}
                                </div>}
                       closeFunc={()=>{setNoResultModalIsOpen(false)}}
                       applyFunc={()=>{setNoResultModalIsOpen(false);window.location.replace("/survey");}}
                       applyButton="취향테스트 하러가기"/>
      </CSSTransition>

      <Header className="profile" settingFunc={()=>{openModal(setSettingPageIsOpen)}}/>
      <div className="individual">
        <div className="profileImage" style={{backgroundImage: `url(${sampleImage})`}} />
        <div className="text">
          <div className="name">신혜영</div>
          {cluster >= 0 && <div className="re-test" onClick={()=>{openModal(setRetestModalIsOpen)}}>취향테스트 다시하기</div>}
        </div>
      </div>
      <div className="testResult active" onClick={()=>{if(cluster < 0){openModal(setNoResultModalIsOpen)}}}>
        <div style={{fontSize: '1.1em', color: 'rgba(0,0,0,0.36)'}}>MY</div>
        <div style={{fontSize: '1.2em', color: 'rgba(0,0,0,0.65)'}}>취향 테스트 결과</div>
      </div>
      <div className="content">
        <div className="tag"><span>최근 본 가게</span></div>
        {currentList.length > 0 ? <>
          <nav className="photoType">
            <div className={photoCategory==='space'?'active':''} onClick={()=>{setPhotoCategory('space')}}>공간사진</div>
            <div className={photoCategory==='food'?'active':''} onClick={()=>{setPhotoCategory('food')}}>음식사진</div>
          </nav>
        </>
        : <div className="noCurrent"><div>최근에 본 가게가 없습니다.</div></div>
        }
      </div>
      <Navbar page={"profile"}/>
    </div>
  );
}

export default Profile;

function SettingPage (props) {
  const closeModal = (closeFunc) => {
    closeFunc();
    document.body.style.overflow = 'unset';
  };
  const openModal = (openFunc) => {
    openFunc(true);
    document.body.style.overflow = 'hidden';
  };
  const [resignModalIsOpen, setResignModalIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  return (
    <div className="settingPage">
      <CSSTransition in={logoutModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="로그아웃"
                       content={<div className="alert">
                                  {"정말로 로그아웃하시겠습니까?\n맞으시면 로그아웃 버튼을 눌러주세요."}
                                </div>}
                       closeFunc={()=>{setLogoutModalIsOpen(false)}}
                       applyFunc={()=>{setLogoutModalIsOpen(false)}}
                       applyButton="로그아웃"/>
      </CSSTransition>
      <CSSTransition in={resignModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="탈퇴"
                       content={<div className="alert">
                                  {"정말로 탈퇴하시겠습니까?\n탈퇴하시면 이전의 데이터 모두 삭제됩니다."}
                                </div>}
                       closeFunc={()=>{setResignModalIsOpen(false)}}
                       applyFunc={()=>{setResignModalIsOpen(false)}}
                       applyButton="탈퇴하기"/>
      </CSSTransition>
      
      <div className="subHeader">
        <div onClick={()=>{closeModal(props.closeFunc)}} className="backButton"><CloseButton width={"1.5em"} color={"rgba(0,0,0,0.9)"}/></div>
      </div>
      <div className="mainButtons">
        <div>
          <img src={customer_center} alt='customerCenter'/>
          <div>고객센터</div>
        </div>
        <div>
          <img src={info_icon} alt='infoIcon'/>
          <div>도움말</div>
        </div>
      </div>
      <div className='details'>
        <ToggleButton header="버전 정보" content={<div className="normal">최신 버전(ver.1.0)</div>} />
        <ToggleButton header="약관 및 정책" content={<>
            <div className="policy">이용약관<Chevron className={"click"} width={"0.474em"} color={"rgba(0,0,0,0.36)"}/></div>
            <div className="policy">개인정보처리 방침 (정보)<Chevron className={"click"} width={"0.474em"} color={"rgba(0,0,0,0.36)"}/></div>
                                                    </>} />
        <ToggleButton header="회사 정보" content={<>
            <div className="companyInfo"><div className="tag">상호</div><div className="text">푸른눈의 백룡(주)</div></div>
            <div className="companyInfo"><div className="tag">대표</div><div className="text">개인정보 처리 방침 (정보)</div></div>
            <div className="companyInfo"><div className="tag">주소</div><div className="text">서울특별시 강남구 강남대로 94길 28, 501호</div></div>
            <div className="companyInfo"><div className="tag">사업자등록번호</div><div className="text">495-86-02501</div></div>
                                                  </>} />
        <ToggleButton header="기타" content={<>
            <div className="normal cursor" onClick={()=>{openModal(setLogoutModalIsOpen)}}>로그아웃</div>
            <div className="normal cursor" onClick={()=>{openModal(setResignModalIsOpen)}}>탈퇴</div>
                                              </>} />
      </div>
    </div>
  );
}

function ToggleButton (props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [contHeight, setContHeight] = useState("0px");
  const [isRotate, setIsRotate] = useState("collapseIcon");
  
  const content = useRef(null);
  function toggleCollapse() {
    setIsOpen(!isOpen);
    setIsActive(isOpen ? "" : "active")
    setContHeight(isOpen ? "0px" : `${content.current.scrollHeight}px`);
    setIsRotate(isOpen ? "collapseIcon" : "collapseIcon rotate");
  }
  return (
    <div className="settingCollapse"> 
      <button className={`header ${isActive}`} onClick={toggleCollapse}>
        <Chevron className={`${isRotate}`} width={"0.474em"} color={"#575757"} />
        {props.header}
      </button>
      <div ref={content} style={{maxHeight: `${contHeight}`}} className="collapseContent" >
        {props.content}
      </div>
    </div>
  );
}