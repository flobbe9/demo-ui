import React from "react";
import "../../../assets/styles/Popup.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../../utils/Utils";


/**
 * Container that can be toggled via ```togglePopup()```. An overlay will be displayed to
 * blur any other content (z-index = 2).
 * 
 * @since 0.0.5
 */
export default function Popup(props: {
    className?: string,
    children?,

    height?: "small" | "large" | "full",
    width?: "small" | "large" | "full",
}) {

    const className = "Popup " + (props.height? (props.height + "Height ") : " ") + 
                                 (props.width? (props.width + "Width ") : " ");

    return (
        <div id={"Popup"} className={className}>
            {props.children}
        </div>
    )
}