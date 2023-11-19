import React, { useContext, useEffect } from "react";
import "../../assets/styles/TextInput.css"; 
import { getDocumentId, log } from "../../utils/Utils";
import { AppContext } from "../../App";
import Style, { applyTextInputStyle, getTextInputStyle } from "../../abstract/Style";


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

    const appContext = useContext(AppContext);


    useEffect(() => {
        if (id === appContext.selectedTextInputId) 
            applyTextInputStyle($("#" + id), appContext.selectedTextInputStyle);

    }, [appContext.selectedTextInputStyle]);


    function handleFocus(event): void {

        appContext.setSelectedTextInputId(id);
    }



    return (
        <div className={"textInputContainer"}>
            <label htmlFor={id}></label>
            <input id={id} className={className} type="text" onFocus={handleFocus}/>
        </div>
    )
}