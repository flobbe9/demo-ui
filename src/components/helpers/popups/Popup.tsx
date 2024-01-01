import React, { useState, useEffect } from "react";
import "../../../assets/styles/Popup.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, togglePopupOverlay } from "../../../utils/Utils";


/**
 * Container that can be toggled via ```toggleGlobalPopup()```. An overlay will be displayed to
 * blur any other content (z-index = 2).
 * 
 * @since 0.0.5
 */
export default function Popup(props: {
    id: string,
    className?: string,
    children?,
    style?: React.CSSProperties,

    height: "small" | "medium" | "large" | "full",
    width: "small" | "medium" | "large" | "full",
}) {


    const [className, setClassName] = useState("Popup");
    const id = props.id + "Popup";
    const overlayId = props.id + "PopupOverlay";
    const childrenId = props.id + "PopupChildren";


    useEffect(() => {
        initClassName();

    }, []);


    function initClassName(): void {

        let newClassName = className + " ";

        if (props.height)
            newClassName += props.height + "Height ";

        if (props.width)
            newClassName += props.width + "Width ";

        if (props.className)
            newClassName += props.className + " ";

        setClassName(newClassName);
    }


    function handleOverlayClick(event): void {

        togglePopupOverlay();
        $("#" + id + " .Popup").fadeOut(100);
    }


    return (
        <div id={id} className={className} style={props.style}>
            <div id={overlayId} className={"popupOverlay"} onClick={handleOverlayClick}></div>

            <div id={childrenId} className={"popupChildren"}>{props.children}</div>
        </div>
    )
}