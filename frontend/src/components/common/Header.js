import React from 'react';
import './Header.css';
import logoImage from "../../img/logo.svg"

function Header(props) {
  return (
    <div className="Main-header">
      <img onClick={props.changeIsHome} className="Main-logo" src={logoImage} alt="logo"/>
    </div>
  );
}

export default Header;
