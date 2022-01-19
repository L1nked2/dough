import React from 'react'
import './CategorySelector.css'

function CategorySelector(props){
  const userFavorites = props.userFavorites;  
  if (!userFavorites) return null; // it may take time to fetch from server

  let num_restr = Object.keys(userFavorites.rest).length;
  let num_cafe = Object.keys(userFavorites.cafe).length;
  let num_bar = Object.keys(userFavorites.bar).length;
 
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
      <div className={getClassName("rest")} onClick={()=>setCategory("rest")}> 
        음식점({num_restr}) </div>
      <div className={getClassName("cafe")} onClick={()=>setCategory("cafe")}> 
        카페({num_cafe}) </div>
      <div className={getClassName("bar")} onClick={()=>setCategory("bar")}> 
        술집({num_bar}) </div>
    </div>
  );
}

export default CategorySelector;