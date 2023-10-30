import React from "react";
import "../assets/styles/TextInput.css"; 


export default function TextInput(props) {

    const id = props.id ? "TextInput" + props.id : "TextInput";
    const className = props.className ? "TextInput " + props.className : "TextInput";


    return (
        <div id={id} className={className}>
            <input type="text"/>
        </div>
    )
}