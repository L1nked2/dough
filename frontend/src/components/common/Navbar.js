import React from 'react';
import './Navbar.css';

function Navbar(props) {
  return (
    <nav className="Navbar">
      <div onClick={props.changeState.changeToHome}>
        <HomeIcon className="NavIcons" color={props.pageComponent[0]?"#3FB8D5":"#A3A3A3"} />
      </div>
      <div onClick={props.changeState.changeToSession}>
        <SessionIcon className="NavIcons" color={props.pageComponent[1]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeState.changeToFavorite}>
        <HeartIcon className="NavIcons" color={props.pageComponent[2]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeState.changeToProfile}>
        <ProfileIcon className="NavIcons" color={props.pageComponent[3]?"#3FB8D5":"#A3A3A3"}/>
      </div>
    </nav>
  );
}

export default Navbar;

function HomeIcon (props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g id="그룹_155" data-name="그룹 155" transform="translate(-35 -742)">
        <path id="패스_863" data-name="패스 863" d="M0,0H24V24H0Z" transform="translate(35 742)" fill="none"/>
        <path id="패스_864" data-name="패스 864" d="M16,13.016V19h3V9.667L12,5,5,9.667V19H8V13.016Z" transform="translate(35 742)" fill="none"/>
        <path id="패스_865" data-name="패스 865" d="M12,5.4l7,4.666V19H16V14.016a1,1,0,0,0-1-1H9a1,1,0,0,0-1,1V19H5V10.07L12,5.4M12,3,3.891,8.406A2,2,0,0,0,3,10.07V19a2,2,0,0,0,2,2h5V15.016h4V21h5a2,2,0,0,0,2-2V10.07a2,2,0,0,0-.891-1.664L12,3Z" transform="translate(35 742)" fill={props.color}/>
      </g>
    </svg>
  );
}
function SessionIcon (props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <g id="그룹_1861" data-name="그룹 1861" transform="translate(-134 -749)">
        <g id="사각형_771" data-name="사각형 771" transform="translate(134 749)" fill="none" stroke={props.color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <rect width="8" height="8" stroke="none"/>
          <rect x="1" y="1" width="6" height="6" fill="none"/>
        </g>
        <g id="사각형_773" data-name="사각형 773" transform="translate(134 759)" fill="none" stroke={props.color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <rect width="8" height="8" stroke="none"/>
          <rect x="1" y="1" width="6" height="6" fill="none"/>
        </g>
        <g id="사각형_774" data-name="사각형 774" transform="translate(144 759)" fill="none" stroke={props.color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <rect width="8" height="8" stroke="none"/>
          <rect x="1" y="1" width="6" height="6" fill="none"/>
        </g>
        <g id="사각형_772" data-name="사각형 772" transform="translate(144 749)" fill="none" stroke={props.color} stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <rect width="8" height="8" stroke="none"/>
          <rect x="1" y="1" width="6" height="6" fill="none"/>
        </g>
      </g>
    </svg>

  );
}
function HeartIcon (props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g id="그룹_153" data-name="그룹 153" transform="translate(-223 -742)">
        <g id="레이어_1" data-name="레이어 1" transform="translate(223 742)">
          <path id="패스_866" data-name="패스 866" d="M7.5,5a4,4,0,0,1,3,1.39l.76.89a1,1,0,0,0,1.52,0l.76-.89A4,4,0,0,1,16.5,5,3.49,3.49,0,0,1,20,8.35c.1,2.94-3.06,5.82-7.86,10.17h0l-.1.09-.13-.11C7.07,14.18,3.9,11.3,4,8.35A3.49,3.49,0,0,1,7.5,5m0-2A5.49,5.49,0,0,0,2,8.27c-.14,3.88,3.29,7,8.55,11.76l.78.71a1,1,0,0,0,1.34,0l.78-.7C18.7,15.27,22.13,12.16,22,8.28A5.5,5.5,0,0,0,16.5,3,6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3Z" fill={props.color}/>
          <rect id="사각형_235" data-name="사각형 235" width="24" height="24" fill="none"/>
        </g>
      </g>
    </svg>
  );
}
function ProfileIcon (props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g id="그룹_156" data-name="그룹 156" transform="translate(-1525 -887)">
        <g id="그룹_144" data-name="그룹 144" transform="translate(1437 847)">
          <path id="패스_846" data-name="패스 846" d="M97.411,51.174a4.108,4.108,0,0,0,5.763-5.763,2.063,2.063,0,0,0-.585-.585,4.108,4.108,0,0,0-5.763,5.763A2.063,2.063,0,0,0,97.411,51.174ZM100,46a2,2,0,1,1-2,2A2.006,2.006,0,0,1,100,46Z" fill={props.color}/>
          <path id="패스_847" data-name="패스 847" d="M100,54c-2.67,0-8,1.34-8,4v1a1,1,0,0,0,1,1h14a1,1,0,0,0,1-1V58C108,55.34,102.67,54,100,54Zm-6,4c.2-.71,3.3-2,6-2s5.78,1.28,6,2Z" fill={props.color}/>
        </g>
        <g id="그룹_145" data-name="그룹 145" transform="translate(1481 847)">
          <rect id="사각형_210" data-name="사각형 210" width="24" height="24" transform="translate(44 40)" fill="none"/>
        </g>
        <g id="그룹_147" data-name="그룹 147" transform="translate(1481 847)">
          <rect id="사각형_210-2" data-name="사각형 210" width="24" height="24" transform="translate(44 40)" fill="none"/>
        </g>
      </g>
    </svg>

  );
}