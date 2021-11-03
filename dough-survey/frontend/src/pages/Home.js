import React from 'react';
import './Home.css';
import Header from '../components/Header'
import SlideImages from '../components/SlideImages'
import CollapseResult from '../components/CollapseResult'

function Home(props) {
  return (
    <div className="Home-page">
      <Header changeIsHome={props.changeIsHome} />
      <CollapseResult content="helloWorld"/>
      <SlideImages />
      <div className="sampleComp" style={{background: "silver"}}>HomeComponent #3</div>
      <div className="sampleComp" style={{background: "orange"}}>HomeComponent #4</div>
    </div>
  );
}

export default Home;
