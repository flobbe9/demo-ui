import React from "react";
import "../assets/styles/Footer.css";
import { API_VERSION, WEBSITE_NAME } from "../globalVariables";


/**
 * @since 0.0.1
 */
export default function Footer(props) {

    return (
        <div className="Footer flex">
            <div className="col-4">
            </div>
            <div className="col-4 flexCenter">
                <div className="dontBreakText">{WEBSITE_NAME}</div>
            </div>
            <div className="col-4 flexRight">
                <div style={{fontSize: "0.8em"}}>v{API_VERSION}</div>
            </div>
        </div>
    );
}