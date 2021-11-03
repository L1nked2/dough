import React from 'react'
import './Favorite.css';
import Header from '../components/Header'

function Favorite(props) {
  return (
    <div className="Favorite-page">
      <Header changeIsHome={props.changeIsHome}/>
      <div className="sampleComp" style={{background: "coral"}}>FavoriteComponent #1</div>
      <div className="sampleComp" style={{background: "salmon"}}>FavoriteComponent #2</div>
      <div className="sampleComp" style={{background: "white"}}>FavoriteComponent #3</div>
    </div>
  );
}

export default Favorite;
