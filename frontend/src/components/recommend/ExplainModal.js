import React, { useRef, useEffect, useState } from 'react';
import './ExplainModal.css';

function ExplainModal(props) {
    function closeModal () {
        props.setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    }
    useEffect (() => {
        const overlay = document.getElementById('overlayExplain');
        const button = document.getElementById('myTypeExplain');
        window.addEventListener("click", (e) => {
            if (e.target === overlay && e.target !== button) {
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

function Triangle () {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="41.5" height="38" viewBox="0 0 41.5 38">
            <defs>
                <filter id="다각형_1" x="0" y="0" width="41.5" height="38" filterUnits="userSpaceOnUse">
                <feOffset dy="1" input="SourceAlpha"/>
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feFlood flood-opacity="0.161"/>
                <feComposite operator="in" in2="blur"/>
                <feComposite in="SourceGraphic"/>
                </filter>
            </defs>
            <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#다각형_1)">
                <path id="다각형_1-2" data-name="다각형 1" d="M8.75,0,17.5,14H0Z" transform="translate(12 11)" fill="#fff"/>
            </g>
        </svg>
    );
}
