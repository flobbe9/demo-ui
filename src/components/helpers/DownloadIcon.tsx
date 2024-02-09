import React from "react";
import "../../assets/styles/DownloadIcon.css";


/**
 * Simple <i> tag using fontawesome library.
 * 
 * @since 0.0.6
 */
// TODO: looks weird in firefox
export default function DownloadIcon(props: {
    id: string,
    className?: string,
    iconClassName?: string
    onClick?,
    onMouseOver?,
    style?: React.CSSProperties,
    children?: React.JSX.Element
}) {

    const id = "DownloadIcon" + (props.id || "");
    const className = "DownloadIcon " + (props.className || "");


    return (
        <span id={id} className={className} onClick={props.onClick} onMouseOver={props.onMouseOver}>
            <i className={"fa-solid fa-arrow-down " + (props.iconClassName || "")}></i>
            {props.children}
        </span>
    )
}