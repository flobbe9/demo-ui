import React from "react";
import "../../../assets/styles/Popup.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../../utils/Utils";


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