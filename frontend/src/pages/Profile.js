import React, {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import './Profile.css';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import ModalTemplate from '../components/common/ModalTemplate';

import { openRetestModal, closeRetestModal } from '../actions/userInfo'
import sampleImage from "../img/login_background.png";

function Profile(props) {
  const dispatch = useDispatch();
  const [photoCategory, setPhotoCategory] = useState("space");
  const retestModalIsOpen = useSelector((state) => state.userInfo.retestModalIsOpen);
  const openPage = (openFunc) => {
    dispatch(openFunc())
    document.body.style.overflow = 'hidden';
  };
  return (
    <div className="profilePage">
      <CSSTransition in={retestModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="테스트 다시하기"
                       content={<div className="retestAlert">
                                  {"계속을 누르면\n취향 테스트를 다시할 수 있는 화면으로\n넘어가고, 이전 취향 테스트 결과가\n삭제됩니다. 계속하시겠습니까?"}
                                </div>}
                       closeFunc={()=>{dispatch(closeRetestModal())}}
                       applyFunc={()=>{dispatch(closeRetestModal());window.location.replace("/survey");}}
                       applyButton="다시하기"/>
      </CSSTransition>
      <Header />
      <div className="individual">
        <div className="profileImage" style={{backgroundImage: `url(${sampleImage})`}} />
        <div className="text">
          <div className="name">신혜영</div>
          <div className="re-test" onClick={()=>{openPage(openRetestModal)}}>취향테스트 다시하기</div>
        </div>
      </div>
      <div className="testResult active">
        <div style={{fontSize: '1.1em', color: 'rgba(0,0,0,0.36)'}}>MY</div>
        <div style={{fontSize: '1.2em', color: 'rgba(0,0,0,0.65)'}}>취향 테스트 결과</div>
      </div>
      <div className="content">
        <div className="tag"><span>최근 본 가게</span></div>
        <nav className="photoType">
          <div className={photoCategory==='space'?'active':''} onClick={()=>{setPhotoCategory('space')}}>공간사진</div>
          <div className={photoCategory==='food'?'active':''} onClick={()=>{setPhotoCategory('food')}}>음식사진</div>
        </nav>
      </div>
      <Navbar page={"profile"}/>
    </div>
  );
}

export default Profile;
