import React from "react";
import "./Progress.css";

export function Progress(props) {
  const number = props.number>props.maxNumber ? props.maxNumber : props.number
  return (
    <div className="progress">
      <div className="gauge">
        <span
          className="fill"
          style={{ width: `${(number / props.maxNumber) * 100}%` }}
        ></span>
      </div>
    </div>
  );
}
