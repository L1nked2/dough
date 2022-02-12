import React, {useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

import './Profile.css';
import { openShopPage, setShopPageContents } from "../actions/homePageInfo";
import { changeName, changeProfileImg } from "../actions/userInfo";
import { firebaseInit, getFirebaseAuth } from "../firebaseInit";

import ClipLoader from "react-spinners/ClipLoader";
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import NoLogin from '../components/common/NoLogin';
import ModalTemplate from '../components/common/ModalTemplate';
import CloseButton from '../components/icon/Close';
import Chevron from '../components/icon/Chevron';

import sampleImage from "../img/login_background.png";
import { customer_center, info_icon, unknown_profile_icon } from '../data/imgPath';
import BackButton from '../components/icon/Back';

firebaseInit();

function Profile(props) {
  const dispatch = useDispatch();
  const [photoCategory, setPhotoCategory] = useState("space");
  const [profileChangeModalIsOpen, setProfileChangeModalIsOpen] = useState(false); 
  const [retestModalIsOpen, setRetestModalIsOpen] = useState(false); 
  const [settingPageIsOpen, setSettingPageIsOpen] = useState(false); 
  const [noResultModalIsOpen, setNoResultModalIsOpen] = useState(false); 
  const openModal = (openFunc) => {
    openFunc(true);
    document.body.style.overflow = 'hidden';
  };
  const openPage = (shop) => {
    dispatch(openShopPage());
    document.body.style.overflow = 'hidden';
    dispatch(setShopPageContents({...shop, tag: 'currentList'}));
  }

  const userName = useSelector(state => state.userInfo.name);
  const imgFile = useSelector(state => state.userInfo.imgFile);
  const imgPreviewURL = useSelector(state => state.userInfo.imgPreviewURL);
  const cluster = useSelector(state => state.userInfo.cluster);
  const currentList = useSelector(state => state.userInfo.currentList);

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getUserInfo = async (userToken) => { 
    const res = await axios({
        method: 'POST',
        url: 'https://dough-survey.web.app/api/info/user',
        headers: {
            "Content-Type": `application/json`
        },
        data: {userToken: userToken},
    }).then(response => {
        console.log(response.data);
        dispatch(changeName(response.data.userInfo.user_name));
        dispatch(changeProfileImg(response.data.userInfo.user_photo_url));
        setIsLoading(false);
        setIsLogin(true);
    }).catch(err => {
        console.log(err);
    });
  }
  useEffect (() => {
    // 런칭용 코드
    getFirebaseAuth(getUserInfo);

    // 개발용 코드
    // dispatch(changeName("신혜영"));
    // dispatch(changeProfileImg(sampleImage));
    // setIsLoading(false);
    // setIsLogin(true);
  }, []);

  return (
    isLoading ? <div style={{width:"100%", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}><ClipLoader/></div> : 
    <div className="profilePage">
      <CSSTransition in={retestModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="테스트 다시하기"
                       content={<div className="alert">
                                  {"계속을 누르면\n취향 테스트를 다시할 수 있는 화면으로\n넘어가고, 이전 취향 테스트 결과가\n삭제됩니다. 계속하시겠습니까?"}
                                </div>}
                       closeFunc={()=>{setRetestModalIsOpen(false)}}
                       applyFunc={()=>{setRetestModalIsOpen(false);window.location.href="/survey";}}
                       applyButton="다시하기"/>
      </CSSTransition>
      <CSSTransition in={profileChangeModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ProfileChangePage closeFunc={()=>{setProfileChangeModalIsOpen(false)}}/>
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
                       applyFunc={()=>{setNoResultModalIsOpen(false);window.location.href="/survey";}}
                       applyButton="취향테스트 하러가기"/>
      </CSSTransition>

      <Header className="profile" settingFunc={()=>{openModal(setSettingPageIsOpen)}}/>
      <div className="individual">
        <div className="profileImage" ><div style={{backgroundImage: `url(${isLogin?imgFile===''?sampleImage:imgPreviewURL:unknown_profile_icon})`}} /></div>
        <div className="text">
          <div className="name">{isLogin?userName:"unknown"}</div>
          {isLogin && <div className="profileChange" onClick={()=>{openModal(setProfileChangeModalIsOpen)}}>프로필 편집</div>}
          {cluster >= 0 && <div className="re-test" onClick={()=>{openModal(setRetestModalIsOpen)}}>취향테스트 다시하기</div>}
        </div>
      </div>
      <div className={`testResult ${isLogin?"active":""}`}
           onClick={()=>{if(cluster < 0){
                           openModal(setNoResultModalIsOpen)
                         } else {
                           window.location.href="/survey/result";
                         }}}>
        <div style={{fontSize: '1.1em', color: '#A3A3A3'}}>MY</div>
        <div style={{fontSize: '1.2em', color: '#575757'}}>취향 테스트 결과</div>
      </div>
      <div className="content">
        <div className="tag"><span>최근 본 가게</span></div>
        {!isLogin ? <>
          <NoLogin />
        </>:<>
          {currentList.length > 0 ? <>
            <nav className="photoType">
              <div className={photoCategory==='space'?'active':''} onClick={()=>{setPhotoCategory('space')}}>공간사진</div>
              <div className={photoCategory==='food'?'active':''} onClick={()=>{setPhotoCategory('food')}}>음식사진</div>
            </nav>
            <div className="pictures">
              {currentList.map((elem, index) => {
                if (index % 2 === 0) {
                  return (<div className="twoPictures" key={index}>
                    <div><img src={photoCategory==='space'?
                                  currentList[index].place_main_photo_list[0]:
                                  currentList[index].place_main_photo_list[1]} alt={index} onClick={()=>{openPage(currentList[index])}}/></div>
                    <div>
                    {currentList.length!==index+1 ?
                      <img src={photoCategory==='space' ?
                                    currentList[index+1].place_main_photo_list[0]:
                                    currentList[index+1].place_main_photo_list[1]} alt={index+1} onClick={()=>{openPage(currentList[index+1])}}/>
                    : null}</div>
                  </div>);
                }
              })}
            </div>
          </>
          : <div className="noCurrent"><div>최근에 본 가게가 없습니다.</div></div>
          }
          </>
        }
      </div>
      <Navbar page={"profile"}/>
    </div>
  );
}

export default Profile;

function ProfileChangePage (props) {
  const closeModal = () => {
    props.closeFunc();
    document.body.style.overflow = 'unset';
  };
  useEffect (() => {
    window.history.pushState({page: "profile_change_modal"}, "profile_change_modal");
  }, []);

  const dispatch = useDispatch();
  const userName = useSelector(state => state.userInfo.name);
  const imgPreviewURL = useSelector(state => state.userInfo.imgPreviewURL);

  const [isEnter, setIsEnter] = useState(false);
  function inputName() {
    if (!isEnter) {
      setIsEnter(true);
    }
  }
  function exitInputName() {
    if (isEnter) {
      setIsEnter(false);
    }
  }
  function resetName() {
    document.getElementById('_name').value = '';
    document.getElementById('_name').focus();
  }
  function enterName() {
    if (document.getElementById('_name').value !== ''){
      dispatch(changeName(document.getElementById('_name').value));
    }
    else{
      document.getElementById('_name').value = userName;
    }
    setIsEnter(false);
    window.blur();
  }
  function enterkey() {
    if (window.event.keyCode == 13) {
      enterName();
    }
  }

  function onLoadFile (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(changeProfileImg(reader.result));
    }
    reader.readAsDataURL(file);
    setProfileImgModalIsOpen(false);
  }
  const changeFile = (e) => {
    e.preventDefault();
    onLoadFile(e.target.files[0]);
  }
  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onLoadFile(e.dataTransfer.files[0]);
  };

  const [profileImgModalIsOpen, setProfileImgModalIsOpen] = useState(false);
  window.onpopstate = function () {
    if (!profileImgModalIsOpen) {
      closeModal();
    }
  }
  return (
    <div className="profileChangePage">
      <CSSTransition in={profileImgModalIsOpen} unmountOnExit classNames="fadeOverlay" timeout={{enter: 200, exit: 200}}>
        <ModalTemplate header="프로필 사진 수정"
                       content={<><div className="profileAlert">{"사진을 여기에 끌어다 놓으세요."}</div>
                                  <div className="button">
                                    <div>
                                      컴퓨터에서 불러오기
                                      <input type="file" id="image" accept="img/*" onChange={changeFile} style={{display: isEnter?"none":"block"}}/>
                                    </div>
                                  </div>
                                </>}
                       closeFunc={()=>{setProfileImgModalIsOpen(false)}}
                       applyFunc={()=>{setProfileImgModalIsOpen(false)}}
                       closeButton="취소"
                       applyButton="저장"
                       dropHandler={dropHandler}
                       />
      </CSSTransition>
      <div className="subHeader">
        <div onClick={!isEnter?closeModal:exitInputName} className="backButton"><BackButton width={"0.6em"} color={"rgba(0,0,0,0.9)"}/></div>
        {!isEnter?"프로필 편집":"닉네임 수정"}
      </div>
      <div className="content">
        <div className="profileImage" style={{opacity: isEnter?"0":"1"}}>
          <div style={{backgroundImage: `url(${imgPreviewURL===''?sampleImage:imgPreviewURL})`}} onClick={()=>{setProfileImgModalIsOpen(true)}}/>
        </div>
        <div className="name" onClick={inputName} style={{top: isEnter?"50%":"120%"}}>
          <input id="_name" type="text" defaultValue={userName} placeholder={userName} autoComplete="off" onKeyUp={enterkey}/>
          {!isEnter ? <div className="button"><Chevron width={"0.7em"} color={"rgba(0,0,0,0.9)"}/></div>
                    : <div className="button" onClick={resetName}><CloseButton width={"0.9em"} color={"rgba(0,0,0,0.9)"}/></div>}
        </div>
      </div>
      <div className="enter" onClick={enterName} style={{opacity: isEnter?"1":"0"}}>완료</div>
    </div>
  );
}
function SettingPage (props) {
  const closeModal = () => {
    props.closeFunc();
    document.body.style.overflow = 'unset';
  };
  const openModal = (openFunc) => {
    openFunc(true);
    document.body.style.overflow = 'hidden';
  };
  useEffect (() => {
    window.history.pushState({page: "setting_modal"}, "setting_modal");
  }, []);
  const [resignModalIsOpen, setResignModalIsOpen] = useState(false);
  const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false);
  window.onpopstate = function () {
    if (!(logoutModalIsOpen || resignModalIsOpen)) {
      closeModal();
    }
  }
  const deleteUser = async (userToken) => { 
    const res = await axios({
        method: 'POST',
        url: 'https://dough-survey.web.app/api/account/deleteUser',
        headers: {
            "Content-Type": `application/json`
        },
        data: {userToken: userToken},
    }).then(response => {
        console.log(response.data);
        setResignModalIsOpen(false);
    }).catch(err => {
        console.log(err);
    });
  }
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
                       applyFunc={()=>{getFirebaseAuth(deleteUser)}}
                       applyButton="탈퇴하기"/>
      </CSSTransition>
      
      <div className="subHeader">
        <div onClick={closeModal} className="backButton"><CloseButton width={"1.5em"} color={"rgba(0,0,0,0.9)"}/></div>
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
    setContHeight(isOpen ? "0px" : `${content.current.scrollHeight+2}px`);
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