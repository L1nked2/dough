import React from 'react'
import './CategorySelector.css'

function CategorySelector(props){
  // dummy number
  let num_restr = 6;
  let num_cafe = 2;
  let num_bar = 3;
 
  const currCategory = props.category; 
  const setCategory = props.setCategory;

  //border-bottom: 3px solid blue; 
  function getClassName(categoryName) {
    let className = "categoryItem";
    if (currCategory === categoryName) 
      className += " selected";
    return className;
  }

  return (
    <div className="categorySelector">
      <div className={getClassName("restr")} onClick={()=>setCategory("restr")}> 
        음식점({num_restr}) </div>
      <div className={getClassName("cafe")} onClick={()=>setCategory("cafe")}> 
        카페({num_cafe}) </div>
      <div className={getClassName("bar")} onClick={()=>setCategory("bar")}> 
        술집({num_bar}) </div>
    </div>
  );
}

export default CategorySelector;