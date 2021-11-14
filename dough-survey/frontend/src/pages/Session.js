import React from 'react'
import './Session.css';
import Header from '../components/common/Header'

function Session(props) {
  return (
    <div className="Session-page">
      <Header changeIsHome={props.changeIsHome}/>
    </div>
  );
}

export default Session;
