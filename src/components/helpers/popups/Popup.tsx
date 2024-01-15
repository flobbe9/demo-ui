import React, { useState, useEffect, useRef, forwardRef } from "react";
import "../../../assets/styles/Popup.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../../utils/basicUtils";


/**
 * Container that can be toggled via ```toggleGlobalPopup()```. An overlay will be displayed to
 * blur any other content (z-index = 2).
 * 
 * @since 0.0.5
 */
// TODO: remove dimension props, style should be enough
export default forwardRef(function Popup(props: {
    id: string,
    className?: string,
    children?,
    style?: React.CSSProperties,

    height: "small" | "medium" | "large" | "full",
    width: "small" | "medium" | "large" | "full",
    handleOverlayClick?: () => void
}, ref) {

    const id = "Popup" + props.id;
    const className = "Popup " + initClassName();
    
    const overlayRef = useRef(null);
    const childrenRef = useRef(null);


    function initClassName(): string {

        let newClassName = props.className + " ";

        if (props.height)
            newClassName += props.height + "Height ";

        if (props.width)
            newClassName += props.width + "Width ";

        if (props.className)
            newClassName += props.className + " ";

        return newClassName;
    }


    return (
        <div id={id} className={className} style={props.style} ref={ref}>
            <div className={"popupOverlay"} ref={overlayRef} onClick={props.handleOverlayClick}></div>

            <div className={"popupChildren"} ref={childrenRef}>{props.children}</div>
        </div>
    )
});