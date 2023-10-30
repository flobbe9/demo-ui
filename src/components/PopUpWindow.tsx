import React, { useEffect } from "react";
import "../assets/styles/PopUpWindow.css";
import { togglePopUp } from "../utils/Utils";


export default function Document(props) {

    const id = props.id ? "PopUpWindow" + props.id : "PopUpWindow";
    const className = props.className ? "PopUpWindow " + props.className : "PopUpWindow";

    // state isDisplayed
    
    // onhide
        // clean up className
        // clean up content


    function handleWindowClose(event) {

        togglePopUp();
    }


    return (
        <div id={id} className={className}>
            <div className="popUpWindowContainer"></div>
        </div>
    )
}