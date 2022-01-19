import React from 'react'
import './BackHeader.css'

function BackHeader(props){
  return (
    <div className="backHeader">
      <div className="backButton"> ◁ </div>
      <div className="stationInfo"> 
        {props.stationName}({props.stationNumPlaces}) 
      </div>
    </div>
  )
}

export default BackHeader;