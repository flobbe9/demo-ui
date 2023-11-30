import React from "react";
import "../assets/styles/PopUp.css";


export default function PopUp(props) {

    const id = props.id ? "PopUp" + props.id : "PopUp";
    const className = props.className ? "PopUp " + props.className : "PopUp";

    // state isDisplayed
    
    // onhide
        // clean up className
        // clean up content

    // TODO: handle Enter

    return (
        <div id={id} className={className + " flexCenter hidePopUp"}>
            <div id="popUpContainer" className="popUpContainer">
                {props.children}
            </div>
        </div>
    )
}