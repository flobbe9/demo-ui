import React from "react";
import "../../../assets/styles/PopupContainer.css";


/**
 * Container component for ```<Popup />```. Only exists for several css configurations.
 * 
 * @since 0.0.6
 */
export default function PopupContainer(props: {
    id?: string,
    className?: string,
    children?,

}) {

    const id = props.id ? "PopupContainer" + props.id : "PopupContainer";
    const className = props.className ? "PopupContainer " + props.className : "PopupContainer";


    return (
        <div id={id} className={className + "PopupContainer flexCenter hidePopup"}>
            {props.children}
        </div>
    )
}