import React from 'react';
import './Navbar.css';
import HomeIcon from '../icon/Home';
import RecommendIcon from '../icon/Recommend';
import HeartIcon from '../icon/Heart';
import ProfileIcon from '../icon/Profile';

function Navbar(props) {
  return (
    <nav className="Navbar">
      <div onClick={props.changeState.changeToHome}>
        <HomeIcon className="NavIcons" width={24} color={props.pageComponent[0]?"#3FB8D5":"#A3A3A3"} />
      </div>
      <div onClick={props.changeState.changeToRecommend}>
        <RecommendIcon className="NavIcons" width={18} color={props.pageComponent[1]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeState.changeToFavorite}>
        <HeartIcon className="NavIcons" width={24} color={props.pageComponent[2]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeState.changeToProfile}>
        <ProfileIcon className="NavIcons" width={24} color={props.pageComponent[3]?"#3FB8D5":"#A3A3A3"}/>
      </div>
    </nav>
  );
}

export default Navbar;