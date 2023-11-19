import React from "react";
import "../assets/styles/TextInput.css"; 
import { getDocumentId } from "../utils/Utils";


export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    textInputIndex: number,
    id?: string | number,
    className?: string
}) {

    const id = getDocumentId("TextInput", props.pageIndex, props.id, props.columnIndex, props.paragraphIndex, props.textInputIndex);
    const className = props.className ? "TextInput " + props.className : "TextInput";

    return (
        <div className={"textInputContainer"}>
            <label htmlFor={id}></label>
            <input id={id} className={className} type="text" />
        </div>
    )
}