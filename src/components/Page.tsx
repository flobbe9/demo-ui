import React from "react";
import "../assets/styles/Page.css";
import Column from "./Column";
import TextInput from "./TextInput";


export default function Page(props) {

    // state columns
    const id = props.id ? "Page" + props.id : "Page";
    const className = props.className ? "Page " + props.className : "Page";

    return (
        <div id={id} className={className}>
            <div className="headingContainer">
                <TextInput id="heading" />
            </div>

            <div className="columnContainer">
                <Column />

                <Column />
                
                <Column />
            </div>
        </div>
    )
}