import React from 'react';
import './Home.css';
import Header from '../components/common/Header'
import MyShop from '../components/main/MyShop'
import MoreShop from '../components/main/MoreShop'
import CollapseResult from '../components/main/CollapseResult'

function Home(props) {
  return (
    <div className="Home-page">
      <Header changeIsHome={props.changeIsHome}/>
      <CollapseResult />
      <MyShop />
    </div>
  );
}

export default Home;
