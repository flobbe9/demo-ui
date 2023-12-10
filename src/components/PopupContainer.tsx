import React from "react";
import "../assets/styles/PopupContainer.css";


export default function PopupContainer(props: {
    id?: string,
    className?: string,
    children?,

}) {

    const id = props.id ? "PopupContainer" + props.id : "PopupContainer";
    const className = props.className ? "PopupContainer " + props.className : "PopupContainer";


    return (
        <div id={id} className={className + " flexCenter hidePopUp"}>
            {props.children}
        </div>
    )
}