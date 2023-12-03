import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
import { getDocumentId, getTabSpaces, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, moveCursor } from "../../utils/Utils";
import { AppContext } from "../../App";
import { applyTextInputStyle, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";


// TODO: 
    // mark multiple lines, style all, tab all, break all (mousemove event)
    // strg a
    // strg c / strg v(?)
export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    textInputIndex: number,
    id?: string | number,
    className?: string
}) {

    const id = getDocumentId("TextInput", props.pageIndex, props.id, props.columnIndex, props.paragraphIndex, props.textInputIndex);
    const [className, setClassName] = useState("TextInput");

    const inputRef = useRef(null);

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);


    useEffect(() => {
        if (props.className)
            setClassName(className + " " + props.className);

    }, []);


    // on selected text input id change
    useEffect(() => {
        // case: focuese this 
        if (appContext.selectedTextInputId === id)
            setClassName(className + " textInputFocus");
    
        // case: no focus
        else
            setClassName(className.replace("textInputFocus", ""));
    }, [appContext.selectedTextInputId]);


    // on selected text input style change
    useEffect(() => {
        // case: focus
        if (id === appContext.selectedTextInputId) 
            applyTextInputStyle($("#" + id), appContext.selectedTextInputStyle);

    }, [appContext.selectedTextInputStyle]);


    function handleFocus(event): void {

        const thisTextInput = $("#" + id);
        
        thisTextInput.addClass("textInputFocus");

        appContext.setSelectedTextInputId(id);

        appContext.setSelectedTextInputStyle(getTextInputStyle(thisTextInput));
    }


    function handleKeyDown(event): void {

        // char that was just typed
        let testChars = event.key === "Tab" ? getTabSpaces() : event.key;

        // case: text too long when including test chars
        if (isTextLongerThanInput(appContext.selectedTextInputId, documentContext.getTextInputOverhead(), testChars) && 
            isKeyAlphaNumeric(event.keyCode) &&
            !appContext.keyCombinationActive) {

            event.preventDefault();
            documentContext.handleTextLongerThanLine(id);
            return;
        }

        if (event.key === "Tab")
            documentContext.handleTab(event);

        if (event.key === "Enter")
            focusNextTextInput(true);

        if (event.key === "ArrowDown")
            focusNextTextInput(false);

        if (event.key === "ArrowUp")
            focusPrevTextInput(event);
    }


    function focusNextTextInput(copyStyles: boolean): void {

        const nextTextInput = documentContext.getNextTextInput(id);
        if (nextTextInput) {
            nextTextInput.trigger("focus");

            // copy style if blank
            if (copyStyles && isBlank(nextTextInput.prop("value")))  
                appContext.setSelectedTextInputStyle(getTextInputStyle($("#" + id)));
        }
    }


    function focusPrevTextInput(event): void {

        const prevTextInput = documentContext.getPrevTextInput(id);

        // case: has no prev text input
        if (!prevTextInput) 
            return;

        event.preventDefault();
        prevTextInput.trigger("focus");

        // move cursor to end of text
        const lastCharIndex = prevTextInput.prop("value").length;
        moveCursor(prevTextInput.prop("id"), lastCharIndex, lastCharIndex);
    }


    return (
        <div className={"textInputContainer"}>
            <label htmlFor={id}></label>
            <input id={id} 
                   className={className} 
                   ref={inputRef} 
                   type="text" 
                   onFocus={handleFocus}
                   onKeyDown={handleKeyDown}
                   />
        </div>
    )
}