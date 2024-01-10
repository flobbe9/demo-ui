import React from "react";
import "../assets/styles/Version.css";
import { API_VERSION } from "../globalVariables";


/**
 * Display some api versions.
 * 
 * @since 0.0.5
 */
export default function Version(props: {
    id?: string,
    className?: string,
    children?
}) {

    const id = props.id ? "Version" + props.id : "Version";
    const className = props.className ? "Version" + props.className : "Version";


    return (
        <div id={id} className={className}>
            <p>v.{API_VERSION}</p>
        </div>
    )
}