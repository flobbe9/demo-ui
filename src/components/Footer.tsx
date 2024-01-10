import React from "react";
import "../assets/styles/Footer.css";
import { API_NAME } from "../globalVariables";


/**
 * @since 0.0.1
 */
export default function Footer(props) {

    return (
        <div className="Footer">
            <div className="footerItem">{API_NAME}</div>
        </div>
    );
}