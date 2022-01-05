import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { sumScore, changeScore, nextPage, previousPage, reset } from "../../actions/survey";
import img1 from "../../img/restaurant/download.jpg";
import img2 from "../../img/restaurant/download1.jpg";
import img3 from "../../img/restaurant/download2.jpg";
import { useState, useEffect } from "react";
import { Progress } from "./Progress";
import StarRating from './StarRating';
import BackButton from "../icon/Back";

import "./Survey.css"
import { Link, useHistory } from "react-router-dom";

function Survey() {
  const scores = useSelector((state) => state.survey.scores);
  const page = useSelector((state) => state.survey.page);
  // const quizs = useSelector((state) => state.survey.quizs); // DB에서 제대로 된 이미지 링크 받은 후 redux 사용 시
  const quizs = [img1, img2, img3, img1, img2, img3, img1, img2, img3]
  const dispatch = useDispatch();
  
  function goBack () {
    dispatch(previousPage());
  }
  useEffect (() => {
    window.addEventListener("popstate",goBack);
    return () => {
        window.removeEventListener("popstate",goBack);
    }
  }, []);

  let history = useHistory();
  useEffect (() => {
    if (page < 0) {
      dispatch(reset());
      history.go(-1);
    }
  }, [page])

  return (
    <div className="surveyStart">
      <div className="subHeader">
        {page !== 0 ? <div onClick={goBack} className="backButton"><BackButton width={"0.5em"} color={"rgba(0,0,0,0.9)"}/></div> : null}
        가게 취향 테스트
      </div>
      <PreSurvey isActive={page === 0} dispatch={dispatch} zIndex={page+1} page={page}/>
      {quizs.map((imgSrc, index) => {
        return <Question key={index} isActive={page === index+1} imgSrc={imgSrc} dispatch={dispatch} scores={scores} 
                          zIndex={page+1} number={page} maxNumber={quizs.length}/>
      })}
      <PostSurvey isActive={page === quizs.length+1} imgSrc={img1} dispatch={dispatch} zIndex={page+1} number={page} maxNumber={quizs.length}/>
    </div>
  );
}

export default Survey;

function isSurveyPage () {
  return (window.location.href.split('/').length === 4 && window.location.href.split('/')[window.location.href.split('/').length - 1] === 'survey' )
          ||
         (window.location.href.split('/').length === 5 && window.location.href.split('/')[window.location.href.split('/').length - 2] === 'survey' 
                                                       && window.location.href.split('/')[window.location.href.split('/').length - 1] === '' )
}
function PreSurvey(props) {
  const dispatch = props.dispatch;
  const images = [img1, img2, img3];
  var imgIndex = 0;
  var timer = null;
  function showRotate() {
    imgIndex = (imgIndex + 1)%3;
    document.getElementById("img_id").src = images[imgIndex];
    timer = setTimeout(showRotate, 1500);
  } 
  useEffect(() => {
    if (props.isActive && isSurveyPage()){
      showRotate();
    }
  },[props.page]);

  function next() {
    clearTimeout(timer);
    dispatch(nextPage());
  }

  return (
    <div className={`contents ${props.isActive ? 'mount' : 'unmount'}`} style={{zindex: props.zIndex}}>
      <div className="contents1">
        <div className="title">내가 가고 싶은 가게는?</div>
        <div className="subtitle">(소요시간 : 2분)</div>
      </div>
      <div className="contents2">
        <img id="img_id" src={images[imgIndex]}></img>
      </div>
      <div className="contents3">
        <div>취향에 맞는 음식점을 찾기가 어려우신가요?</div>
        <div>취향테스트를 통해 "AI"로 추천되는 가게들을 확인하세요!</div>
      </div>
      <div className="contents4">
        <div className="start" onClick={next}>시작하기</div>
        <Link to={'/home'} className="notYet" onClick={()=>{clearTimeout(timer)}}>나중에 하기</Link>
      </div>
    </div>
  );
}


function Question(props) {
  const dispatch = props.dispatch;
  function next (score) {
    dispatch(changeScore(props.number-1, score));
    dispatch(nextPage());
  }
  
  return (
    <div className={`contents ${props.isActive ? 'mount' : 'unmount'} quiz`} style={{zindex: props.zIndex}}>
      <div className="contents5" >
        <Progress number={props.number} maxNumber={props.maxNumber}/>
      </div>
      <div className="contents6" >
        <span style={{fontSize: "2em", fontFamily: "SpoqaMedium", marginRight: "0.25em"}}>Q</span>
        다음 가게에 대한 당신의 점수는?
      </div>
      <div className="contents7" >
        <img id="img_id" src={props.imgSrc}></img>
        <div className="contents8" >
          <StarRating next={next} number={props.number} scores={props.scores}/>
        </div>
      </div>
    </div>
  );
}


function PostSurvey(props) {
  let history = useHistory();
  const dispatch = props.dispatch;
  const scores = useSelector((state) => state.survey.scores);
  if (props.isActive) {
    for (let i = 0; i < scores.length; i++) {
      dispatch(sumScore(scores[i]));
    }
    // axios post scores
    setTimeout(() => {
      dispatch(reset());
      history.replace('/survey/result');
    }, 3000)
  }
  return (
    <div className={`contents ${props.isActive ? 'mount' : 'unmount'} quiz`} style={{zindex: props.zIndex}}>
      <div className="contents5" >
        <Progress number={props.maxNumber} maxNumber={props.maxNumber}/>
      </div>
      <div className="contents9" >
        <img id="img_id" src={props.imgSrc}></img>
      </div>
      <div className="contents10" >
        분석 중...
      </div>
    </div>
  );
}