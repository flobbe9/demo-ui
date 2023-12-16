import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getDocumentId, getTabSpaces, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, moveCursor, replaceAtIndex } from "../../utils/Utils";
import { AppContext } from "../../App";
import Style, { StyleProp, applyTextInputStyle, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";
import { ColumnContext } from "./Column";


// TODO: 
    // mark multiple lines, style all, tab all, break all (mousemove event)
    // strg a
    // strg c / strg v(?)

// TODO: minimize use effect calls
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
    const columnContext = useContext(ColumnContext);


    useEffect(() => {
        if (props.className)
            setClassName(className + " " + props.className);

        initTextInputStyle();

    }, []);


    useEffect(() => {
        if (appContext.selectedTextInputId !== id) 
            appContext.unFocusTextInput(id);
        
    }, [appContext.selectedTextInputId]);


    useEffect(() => {
        if (id === appContext.selectedTextInputId)
            appContext.focusTextInput(id, false);

    }, [appContext.selectedTextInputStyle]);


    function initTextInputStyle(): void {

        const style = appContext.selectedTextInputStyle;
        const headingState = documentContext.getHeadingStateByTextInputId(id);

        // set font size of heading or body
        style.fontSize = getCSSValueAsNumber(headingState ? headingState[0] : documentContext.columnFontSize, 2);

        applyTextInputStyle(id, style);
    }


    function handleKeyDown(event): void {

        // char that was just typed
        let typedChar = event.key === "Tab" ? getTabSpaces() : event.key;

        // case: text too long when including typed char
        if (isTextLongerThanInput(appContext.selectedTextInputId, documentContext.getTextInputOverhead(), typedChar) && 
            isKeyAlphaNumeric(event.keyCode) &&
            appContext.pressedKey === "") {

            event.preventDefault();
            documentContext.handleTextLongerThanLine(id);
            return;
        }

        if (event.key === "Tab") 
            handleTab(event);
        
        if (event.key === "Enter")
            focusNextTextInput(true, ["fontSize"]);

        if (event.key === "ArrowDown")
            focusNextTextInput(false);

        if (event.key === "ArrowUp")
            focusPrevTextInput(event);

        if (event.key === "Backspace")
            handleBackspace(event);
    }


    function handleMouseDown(event): void {
        
        columnContext.updateColumnStates(id);

        if (appContext.selectedTextInputId !== id) 
            appContext.focusTextInput(id);
    }


    function handleTab(event): void {

        if (appContext.pressedKey === "Shift") {
            event.preventDefault();
            handleBackspace(event);

        } else 
            documentContext.handleTab(event);
    }


    /**
     * @param copyStyles if true, all styles of selected text input will be copied to next text input
     * @param stylePropsToOverride style props to override the selected style props with if ```copyStyles```is true
     */
    function focusNextTextInput(copyStyles: boolean, stylePropsToOverride?: StyleProp[]): void {

        const nextTextInput = documentContext.getNextTextInput(id);
        if (nextTextInput) {
            // case: next text input blank
            if (copyStyles && isBlank(nextTextInput.prop("value"))) {
                // copy style
                appContext.setSelectedTextInputStyle(getTextInputStyle($("#" + id)), mapTextInputStyleAsTouple(nextTextInput, stylePropsToOverride));
                appContext.focusTextInput(nextTextInput.prop("id"), false);

            // case: next text input not blank
            } else 
                appContext.focusTextInput(nextTextInput.prop("id"), true);
        }
    }


    /**
     * @param textInput which the style is taken from
     * @param styleProperties to map, if not present all style props of text input are used
     * @returns an array of touples i.e. ```[["fontSize", "16px"], "color", "black"]
     */
    function mapTextInputStyleAsTouple(textInput: JQuery, styleProperties?: StyleProp[]): [StyleProp, string][] {

        const textInputStyle = getTextInputStyle(textInput);

        if (styleProperties) 
            return styleProperties.map(styleProp => [styleProp, textInputStyle[styleProp.toString()]])
        
        return Object.entries(textInputStyle)
                     .map(([key, value]) => [key as StyleProp, value]);
    }


    function focusPrevTextInput(event): void {

        const prevTextInput = documentContext.getPrevTextInput(id);

        // case: has no prev text input
        if (!prevTextInput) 
            return;

        event.preventDefault();
        appContext.focusTextInput(prevTextInput.prop("id"), true);

        // move cursor to end of text
        const lastCharIndex = prevTextInput.prop("value").length;
        moveCursor(prevTextInput.prop("id"), lastCharIndex, lastCharIndex);
    }


    /**
     * Remove tab unicodes
     */
    function handleBackspace(event): void {
        
        const input = $(inputRef.current!);
        const value: string = input.prop("value");
        
        const cursorIndex = input.prop("selectionStart");
        const charsInFrontOfCursor = value.charAt(cursorIndex - 1) + value.charAt(cursorIndex - 2);

        // case: remove tab
        if (charsInFrontOfCursor === TAB_UNICODE_ESCAPED) {
            event.preventDefault();

            // remove one of two unicodes
            let newValue = replaceAtIndex(value, "", cursorIndex - 2, cursorIndex);
            input.prop("value", newValue);
        }
    }


    /**
     * @returns true if no chars are found in any text input of selected column, else false (Tabs and spaces don't count as chars here)
     */
    function isSelectedColumnEmpty(): boolean {

        const selectedColumnId = documentContext.getSelectedColumnId();
        if (isBlank(selectedColumnId))
            return true;

        const columnTextInputs = $("#" + selectedColumnId + " .TextInput");

        let isEmpty = true;
        
        Array.from(columnTextInputs).forEach(textInputElement => {
            const textInput = textInputElement as HTMLInputElement;

            if (!isBlank(textInput.value)) {
                isEmpty = false;
                return;
            }
        });

        return isEmpty;
    }


    return (
        <div className={"textInputContainer"}>
            <label htmlFor={id}></label>
            <input id={id} 
                   className={className} 
                   ref={inputRef} 
                   type="text" 
                   onMouseDown={handleMouseDown}
                   onKeyDown={handleKeyDown}
                   onKeyUp={() => documentContext.setIsSelectedColumnEmpty(isSelectedColumnEmpty())}
                   />
        </div>
    )
}