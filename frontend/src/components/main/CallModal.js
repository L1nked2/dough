import React, { useRef, useEffect, useState } from 'react';
import './CallModal.css';
import CallIcon from '../../components/icon/Call';

function CallModal(props) {
    function closeModal () {
        props.setIsCallModalOpen(false);
        document.body.style.overflow = 'unset';
    }
    useEffect (() => {
        const overlay = document.getElementById('overlayCall');
        window.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        return () => {window.removeEventListener("click", closeModal())};
    },[])
    
    return (
        <div className="overlayCall" id="overlayCall">
            <div className="modal" >
                <a href={`tel:${props.callNum}`} className="number">
                    <span className="callIcon"><CallIcon width={"1.4em"} color={"rgba(0,0,0,0.65)"}/></span>
                    <span className="call">{`통화 ${props.callNum}`}</span>
                </a>
                <div className="cancel" onClick={()=>{closeModal()}}>취소</div>
            </div>
        </div>
    );
  }
  
export default CallModal;
