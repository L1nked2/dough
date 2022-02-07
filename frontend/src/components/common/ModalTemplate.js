import React, { useRef, useEffect, useState } from 'react';
import './ModalTemplate.css';

function ModalTemplate(props) {
    function closePage() {
        props.closeFunc();
        document.body.style.overflow = 'unset';
    };
    function apply() {
        props.applyFunc();
        document.body.style.overflow = 'unset';
    }

    useEffect (() => {
        const modal = document.getElementById('overlayModal');
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                closePage();
            }
        });
        window.history.pushState({page: "modal"}, "modal");
        
        if(props.dropHandler) {
            var drop = document.getElementById('modal');
            drop.ondragover = function (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            drop.ondrop = function (e) {
                props.dropHandler(e);
            }
        }
        return () => {
            window.removeEventListener("click", closePage);
        };
    },[])

    window.onpopstate = function () {
        closePage();
    }
    return (
        <div className="overlayModal" id="overlayModal">
            <div className="header">{props.header}</div>
            <div className="modal" id="modal" >
                {props.content}
                <div className="buttonSection">
                    <div className="close" onClick={closePage}>{props.closeButton?props.closeButton:"닫기"}</div>
                    <div className={`apply ${props.checkIsChange && props.checkIsChange()?"unactive":""}`} onClick={apply}>{props.applyButton}</div>
                </div>
            </div>
        </div>
    );
  }
  
export default ModalTemplate;