import React, { useState } from "react";
import './StarRating.css';

function StarRating(props) {
  const stars = [1,2,3,4,5,6,7];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  function saveRating (index) {
    setRating(index);
    props.nextPage();
  }
  return (
    <div className="score">
      {stars.map((index) => {
        return (
          <div onMouseOver={()=>{setHover(index)}} onMouseLeave={()=>{setHover(0)}} onClick={()=>{saveRating(index)}}>
            <Star width={"2em"} color={(index<=hover)||(index<=rating)?"#3FB8D5":"#D1D1D1"} className={`star`} />
          </div>
        );
      })}
    </div>
  );
}

export default StarRating;

function Star(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 25.809 24.888" className={props.className}>
      <path id="패스_7286" data-name="패스 7286" d="M13.479.63A.651.651,0,0,1,14.063,1L17.7,8.445,25.826,9.64a.653.653,0,0,1,.526.448.664.664,0,0,1-.165.675l-5.882,5.8,1.389,8.187a.662.662,0,0,1-.259.644.645.645,0,0,1-.686.05l-7.27-3.865-7.27,3.865a.645.645,0,0,1-.686-.05.662.662,0,0,1-.259-.644l1.389-8.187-5.882-5.8a.664.664,0,0,1-.165-.675.653.653,0,0,1,.526-.448L9.26,8.445,12.895,1A.651.651,0,0,1,13.479.63Z" transform="translate(-0.574 -0.63)" fill={props.color}/>
    </svg>
  );
}
