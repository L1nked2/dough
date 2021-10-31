import React from 'react'
import './Session.css';
import Header from '../components/Header'

function Session(props) {
  return (
    <div className="Session-page">
      <Header changeIsHome={props.changeIsHome}/>
      <div className="sampleComp" style={{background: "darkgray"}}>SessionComponent #1</div>
      <div className="sampleComp" style={{background: "skyblue"}}>SessionComponent #2</div>
      <div className="sampleComp" style={{background: "darksalmon"}}>SessionComponent #3</div>
    </div>
  );
}

export default Session;
