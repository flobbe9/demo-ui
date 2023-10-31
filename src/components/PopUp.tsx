import React, { useContext, useEffect } from "react";
import "../assets/styles/PopUp.css";
import { hidePopUp } from "../utils/Utils";
import { AppContext } from "../App";


export default function PopUp(props) {

    const id = props.id ? "PopUp" + props.id : "PopUp";
    const className = props.className ? "PopUp " + props.className : "PopUp";

    const appContext = useContext(AppContext);

    // state isDisplayed
    
    // onhide
        // clean up className
        // clean up content



    return (
        <div id={id} className={className}>
            <div id="popUpContainer" className="popUpContainer dontHidePopUp">
                <div className="header" onClick={() => hidePopUp(appContext.setPopUpContent)}>
                    <img src={"closeX.png"} alt="close icon" className="smallIconButton"/>
                </div>

                {props.children}

                <div className="footer">
                    <button className="blackButton blackButtonContained buttonSmall" onClick={() => hidePopUp(appContext.setPopUpContent)}>
                        Schließen
                    </button>
                </div>
            </div>
        </div>
    )
}