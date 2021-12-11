import React from 'react'
import './Profile.css';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';

function Profile(props) {
  return (
    <div className="Profile-page">
      <Header changeIsHome={props.changeIsHome}/>
      <div className="sampleComp" style={{background: "gray"}}>ProfileComponent #1</div>
      <div className="sampleComp" style={{background: "salmon"}}>ProfileComponent #2</div>
      <div className="sampleComp" style={{background: "white"}}>ProfileComponent #3</div>
      <Navbar page={"profile"}/>
    </div>
  );
}

export default Profile;
