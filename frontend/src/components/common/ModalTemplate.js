import React, { useRef, useEffect, useState } from 'react';
import './ModalTemplate.css';

function ModalTemplate(props) {
    const closePage = () => {
        props.closeFunc();
        document.body.style.overflow = 'unset';
    };

    useEffect (() => {
        const modal = document.getElementById('overlayModal');
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                closePage();
            }
        });
        window.history.pushState({page: "modal"}, "modal");
        window.addEventListener("popstate", closePage);
        return () => {
            window.removeEventListener("click", closePage);
            window.removeEventListener("popstate",closePage);
        };
    },[])

    return (
        <div className="overlayModal" id="overlayModal">
            <div className="header">{props.header}</div>
            <div className="modal">
                {props.content}
                <div className="buttonSection">
                    <div className="close" onClick={closePage}>닫기</div>
                    <div className={`apply ${props.checkIsChange && props.checkIsChange()?"unactive":""}`} onClick={props.applyFunc}>{props.applyButton}</div>
                </div>
            </div>
        </div>
    );
  }
  
export default ModalTemplate;