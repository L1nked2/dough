import React from 'react'
import './CategorySelector.css'

function CategorySelector(props){
  // dummy number
  let num_restr = 6;
  let num_cafe = 2;
  let num_bar = 3;
  
  return (
    <div className="categorySelector">
      <div className="categoryItem"> 음식점({num_restr}) </div>
      <div className="categoryItem"> 카페({num_cafe}) </div>
      <div className="categoryItem"> 술집({num_bar}) </div>
    </div>
  );
}

export default CategorySelector;