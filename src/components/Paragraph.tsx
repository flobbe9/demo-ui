import React from "react";
import "../assets/styles/Column.css";
import TextInput from "./TextInput";
import { log } from "../utils/Utils";


export default function Paragraph(props) {

    const id = props.id ? "Paragraph" + props.id : "Paragraph";
    const className = props.className ? "Paragraph " + props.className : "Paragraph";

    // state textinputs

    return (
        <div id={id} className={className}>
            <TextInput id={"-0"}/>
            <TextInput id={"-1"}/>
            <TextInput id={"-2"}/>
        </div>
    )
}