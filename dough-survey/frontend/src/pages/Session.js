import React from 'react'
import './Session.css';
import Header from '../components/common/Header'

function Session(props) {
  return (
    <div className="Session-page">
      <Header changeIsHome={props.changeState.changeToHome}/>
    </div>
  );
}

export default Session;
