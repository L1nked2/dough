import React from 'react';
import './Navbar.css';
import HomeIcon from '../icon/Home';
import RecommendIcon from '../icon/Recommend';
import HeartIcon from '../icon/Heart';
import ProfileIcon from '../icon/Profile';
import { Link } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

function Navbar(props) {
  return (
      <nav className="Navbar">
        <Link to="/home" className='button' onClick={()=>{props.setPage('home')}}>
          <HomeIcon className="NavIcons" width={24} color={props.page==="home"?"#3FB8D5":"#A3A3A3"} />
        </Link>
        <Link to="/recommend" className='button' onClick={()=>{props.setPage('recommend')}}>
          <RecommendIcon className="NavIcons" width={18} color={props.page==="recommend"?"#3FB8D5":"#A3A3A3"}/>
        </Link>
        <Link to="/favorite" className='button' onClick={()=>{props.setPage('favorite')}}>
          <HeartIcon className="NavIcons" width={24} color={props.page==="favorite"?"#3FB8D5":"#A3A3A3"}/>
        </Link>
        <Link to="/profile" className='button' onClick={()=>{props.setPage('profile')}}>
          <ProfileIcon className="NavIcons" width={24} color={props.page==="profile"?"#3FB8D5":"#A3A3A3"}/>
        </Link>
      </nav>
  );
}

export default Navbar;