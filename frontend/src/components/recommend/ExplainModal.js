import React, { useRef, useEffect, useState } from 'react';
import './ExplainModal.css';
import Triangle from '../icon/Triangle';

function ExplainModal(props) {
    function closeModal () {
        props.setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    }
    useEffect (() => {
        const overlay = document.getElementById('overlayExplain');
        window.addEventListener("click", (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
        return () => {window.removeEventListener("click", closeModal())};
    },[])
    
    return (
        <div className="overlayExplain" id="overlayExplain">
            <div className="modal" style={{marginLeft: `calc(${props.modalX}px - 1em)`, marginTop: `calc(${props.modalY}px + 1em)`}}>
                <div><Triangle /></div>
                <div className="content">
                    <div>{"이 유형의 사람들은"}</div>
                    <div>{"따뜻한 색감의 조명과"}</div>
                    <div>{"담백한 음식류를 선호해요"}</div>
                </div>
            </div>
        </div>
    );
  }
  
export default ExplainModal;
