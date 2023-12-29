import React, { useContext, useEffect, useRef } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getCursorIndex, getDocumentId, getFontSizeDiffInWord, getTabSpaces, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, moveCursor, replaceAtIndex } from "../../utils/Utils";
import { AppContext } from "../App";
import { StyleProp, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { DEFAULT_FONT_SIZE, SELECT_COLOR, SINGLE_TAB_UNICODE_ESCAPED, TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";


// TODO: 
    // mark multiple lines, style all, tab all, break all (mousemove event)
    // strg a
    // strg c / strg v(?)

// TODO: underline tabs
// TODO: fix tab size
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

    const id = getDocumentId("TextInput", props.pageIndex, props.id ? props.id : "", props.columnIndex, props.paragraphIndex, props.textInputIndex);
    const className = props.className ? "TextInput " + props.className : "TextInput";

    const inputRef = useRef(null);

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);


    useEffect(() => {
        // set initial font size
        document.documentElement.style.setProperty("--initialTextInputFontSize", DEFAULT_FONT_SIZE + getFontSizeDiffInWord(DEFAULT_FONT_SIZE) + "px");
        
        // focus first text input of document
        if (id === getDocumentId("TextInput", 0, "", 0, 0, 0))
            appContext.focusTextInput(id);
    }, [])


    useEffect(() => {
        if (id !== appContext.selectedTextInputId) 
            appContext.unFocusTextInput(id);
        
    }, [appContext.selectedTextInputId]);


    useEffect(() => {
        if (id === appContext.selectedTextInputId) {
            appContext.focusTextInput(id, false);
            
            // check num lines to add to column
            const numLinesToAdd = documentContext.getNumLinesOverhead();
            if (numLinesToAdd > 0) 
                documentContext.setParagraphIdAppendTextInput([documentContext.getParagraphIdByColumnId(), numLinesToAdd])
        }

    }, [appContext.selectedTextInputStyle]);


    function handleKeyDown(event): void {

        // char that was just typed
        let typedChar = event.key === "Tab" ? getTabSpaces() : event.key;

        // case: text too long when including typed char
        // TODO: does not validate when key combination is active
        if (isTextLongerThanInput(appContext.selectedTextInputId, documentContext.getTextInputOverhead(), typedChar) && 
            isKeyAlphaNumeric(event.keyCode) &&
            appContext.pressedKey === "") {

            event.preventDefault();
            documentContext.handleTextLongerThanLine(id, SELECT_COLOR);
            return;
        }

        if (event.key === "Tab") 
            handleTab(event);
        
        if (event.key === "Enter")
            focusNextTextInput(true);

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

        // case: selected new text input
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
    function focusNextTextInput(copyStyles: boolean, stylePropsToOverride: [StyleProp, string | number][] = []): void {

        const nextTextInput = documentContext.getNextTextInput(id);
        
        // case: end of document
        if (!nextTextInput)
            return;
    
        const nextTextInputId = nextTextInput.prop("id");
        const nextTextInputFontSize = nextTextInput.css("fontSize");

        // case: next text input blank
        if (copyStyles && isBlank(nextTextInput.prop("value"))) {
            const checkFontSize = documentContext.isFontSizeTooLarge(nextTextInputId); 
            
            // case: font size too large
            if (checkFontSize[0]) 
                // case: cant handle font size too large
                if (!documentContext.handleFontSizeTooLarge(false, checkFontSize[1], nextTextInputId))
                    // override fontSize with nextTextInputFontSize (keep nextTextInputFontSize)
                    stylePropsToOverride?.push(["fontSize", getCSSValueAsNumber(nextTextInputFontSize, 2)]);
            
            appContext.focusTextInput(nextTextInput.prop("id"), false);
            appContext.setSelectedTextInputStyle(getTextInputStyle($("#" + id)), stylePropsToOverride);

        // case: next text input not blank
        } else 
            appContext.focusTextInput(nextTextInput.prop("id"), true);
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
     * Remove tab unicodes.
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

        // case: text is marked
        if (input.prop("selectionStart") !== input.prop("selectionEnd"))
            return false;
        
        // get 2 chars in front of cursor
        const cursorIndex = input.prop("selectionEnd");
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


    return (
        <div className={"textInputContainer flexCenter"}>
            <label htmlFor={id}></label>
            <input id={id} 
                   className={className} 
                   ref={inputRef} 
                   type="text" 
                   onMouseDown={handleMouseDown}
                   onClick={handleClick}
                   onKeyDown={handleKeyDown}
                   onKeyUp={() => documentContext.setIsSelectedColumnEmpty(documentContext.checkIsSelectedColumnEmpty())}
                   />
        </div>
    )
}