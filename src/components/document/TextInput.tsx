import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getCursorIndex, getDocumentId, getTabSpaces, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, moveCursor, replaceAtIndex } from "../../utils/Utils";
import { AppContext } from "../../App";
import { StyleProp, applyTextInputStyle, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { SINGLE_TAB_UNICODE_ESCAPED, TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";
import { ColumnContext } from "./Column";


// TODO: 
    // mark multiple lines, style all, tab all, break all (mousemove event)
    // strg a
    // strg c / strg v(?)

// TODO: increase font size but only on display
// TOOD: underline tabs
// TODO: fix tab size
// TODO: font size does not work
// TODO: focus after select
export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    textInputIndex: number,
    isHeading: boolean,
    key?: string | number
    id?: string | number,
    className?: string,
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
        const headingFontsize = headingState ? headingState[0] : "";

        // font size
        // case: heading
        if (props.isHeading && !isBlank(headingFontsize)) {
            log("heading: " + headingFontsize)   
            style.fontSize = getCSSValueAsNumber(headingFontsize, 2);
        }
        
        // case: normal line
        else {
            log("normal: " + documentContext.columnFontSize)   
            style.fontSize = getCSSValueAsNumber(documentContext.columnFontSize, 2);
        }

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

        if (event.key === "ArrowLeft")
            handleArrowLeft(event);

        if (event.key === "ArrowRight")
            handleArrowRight(event);

        if (event.key === "Backspace")
            handleBackspace(event);
    }


    function handleMouseDown(event): void {
        
        columnContext.updateColumnStates(id);

        if (appContext.selectedTextInputId !== id) 
            appContext.focusTextInput(id);
    }


    function handleClick(event): void {
        
        handleCursorInBetweenSingleTabUnicodes(event.target.id);
    }


    /**
     * Move cursor left by one char if cursor is in between two connected tab unicodes. I.e. a click on cursor '|' in ```\t\t\t|\t```
     * would move the cursor like ```\t\t|\t\t```
     * @param textInputId id of text input to potentially move cursor of
     */
    function handleCursorInBetweenSingleTabUnicodes(textInputId: string): void {

        const cursorIndex = getCursorIndex(textInputId);
        const inputValue = $(inputRef.current!).prop("value");

        // count single tab unicodes in front of cursor
        let tabUnicodeCount = 0;
        for (let i = cursorIndex - 1; i >= 0; i--) {
            if (inputValue.charAt(i) !== SINGLE_TAB_UNICODE_ESCAPED)
                break;

            tabUnicodeCount++;
        }

        // is cursor between tab unicodes
        const isCursorInBetweenTabUnicodes = inputValue.charAt(cursorIndex - 1) === SINGLE_TAB_UNICODE_ESCAPED && 
                                             inputValue.charAt(cursorIndex) === SINGLE_TAB_UNICODE_ESCAPED;
                          
        // case: cursor between connected tab unicodes
        if (isCursorInBetweenTabUnicodes && tabUnicodeCount % 2 === 1)
            moveCursor(textInputId, cursorIndex - 1, cursorIndex - 1);
    }


    function handleTab(event): void {

        if (appContext.pressedKey === "Shift") {
            event.preventDefault();
            handleBackspace(event);

        } else 
            documentContext.handleTab(event);
    }


    function handleArrowLeft(event): void {

        if (areCharsInFrontOfCursorTab()) {
            const cursorIndex = getCursorIndex(event.target.id);
            moveCursor(event.target.id, cursorIndex - 1, cursorIndex - 1);
        }
    }


    function handleArrowRight(event): void {

        if (areCharsAfterCursorTab()) {
            const cursorIndex = getCursorIndex(event.target.id);
            moveCursor(event.target.id, cursorIndex + 1, cursorIndex + 1);
        }
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
        
        // case: is tab
        if (areCharsInFrontOfCursorTab()) {
            const input = $(inputRef.current!);
            const value: string = input.prop("value");
            const cursorIndex = input.prop("selectionStart");

            event.preventDefault();

            // remove both unicodes
            let newValue = replaceAtIndex(value, "", cursorIndex - 2, cursorIndex);
            input.prop("value", newValue);
        }
    }


    /**
     * @returns true if ```2 chars in front of cursor === TAB_UNICODE_ESCAPED```.
     */
    function areCharsInFrontOfCursorTab(): boolean {

        // get input value
        const input = $(inputRef.current!);
        const value: string = input.prop("value");
        
        // get 2 chars in front of cursor
        const cursorIndex = input.prop("selectionStart");
        const charsInFrontOfCursor = value.charAt(cursorIndex - 1) + value.charAt(cursorIndex - 2);

        return charsInFrontOfCursor === TAB_UNICODE_ESCAPED;
    }


    /**
     * @returns true if ```2 chars after cursor === TAB_UNICODE_ESCAPED```.
     */
    function areCharsAfterCursorTab(): boolean {

        // get input value
        const input = $(inputRef.current!);
        const value: string = input.prop("value");
        
        // get 2 chars after cursor
        const cursorIndex = input.prop("selectionStart");
        const charsInFrontOfCursor = value.charAt(cursorIndex) + value.charAt(cursorIndex + 1);

        return charsInFrontOfCursor === TAB_UNICODE_ESCAPED;
    }


    /**
     * @returns true if no chars are found in any text input of selected column, else false (Tabs and spaces don't count as chars here)
     */
    function isSelectedColumnEmpty(): boolean {

        const selectedColumnId = appContext.getSelectedColumnId();
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
                   onClick={handleClick}
                   onKeyDown={handleKeyDown}
                   onKeyUp={() => documentContext.setIsSelectedColumnEmpty(isSelectedColumnEmpty())}
                   />
        </div>
    )
}