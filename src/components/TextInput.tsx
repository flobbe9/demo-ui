import React, { useContext, useEffect } from "react";
import "../assets/styles/TextInput.css"; 
import { getDocumentId, log } from "../utils/Utils";
import { ColumnContext } from "./Column";


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

    const columnContext = useContext(ColumnContext);

    // TODO: make key enter focus the next input


    return (
        <div className={"textInputContainer"}>
            <label htmlFor={id}></label>
            <input id={id} className={className} type="text" />
        </div>
    )
}