import React from 'react';
import './Navbar.css';
import { AiOutlineHome, AiOutlineFileText, AiOutlineHeart, AiOutlineUser } from "react-icons/ai";

// function Navbar() {
//   return (
//     <nav className="Navbar">
//       <div><a href="/"><AiOutlineHome className="NavIcons" /></a></div>
//       <div><a href="/session"><AiOutlineFileText className="NavIcons" /></a></div>
//       <div><AiOutlineHeart className="NavIcons" /></div>
//       <div><a href="/profile"><AiOutlineUser className="NavIcons" /></a></div>
//     </nav>
//   );
// }

function Navbar(props) {
  return (
    <nav className="Navbar">
      <div onClick={props.changeIsHome}>
        <AiOutlineHome className="NavIcons" color={props.pageComponent[0]?"#3FB8D5":"#A3A3A3"} />
      </div>
      <div onClick={props.changeIsSession}>
        <AiOutlineFileText className="NavIcons" color={props.pageComponent[1]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeIsFavorite}>
        <AiOutlineHeart className="NavIcons" color={props.pageComponent[2]?"#3FB8D5":"#A3A3A3"}/>
      </div>
      <div onClick={props.changeIsProfile}>
        <AiOutlineUser className="NavIcons" color={props.pageComponent[3]?"#3FB8D5":"#A3A3A3"}/>
      </div>
    </nav>
  );
}

export default Navbar;
