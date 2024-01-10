import React from "react";
import "../../../assets/styles/PopupContainer.css";


/**
 * Container component for ```<Popup />```. Only exists for several css configurations.
 * 
 * @since 0.0.5
 */
export default function PopupContainer(props: {
    id: string,
    className?: string,
    children?,
    onClick?
}) {

    const id = "PopupContainer" + props.id;
    const className = "PopupContainer " + (props.className || "");


    return (
        <div id={id} className={className + " flexCenter"} onClick={props.onClick}>
            {props.children}
        </div>
    )
}