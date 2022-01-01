import React from 'react';
import './Header.css';
import BabyakLogo from '../icon/BabyakLogo';

function Header(props) {
  const logoColor = props.className === 'recommend' ? "#FFFFFF" : "#3fb8d5";
  return (
    <div className={`mainHeader ${props.className}`}>
      <div onClick={props.changeIsHome} className="mainLogo"><BabyakLogo color={logoColor}/></div>
    </div>
  );
}

export default Header;
