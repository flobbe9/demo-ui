import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getCursorIndex, getDocumentId, getFontSizeDiffInWord, getPartFromDocumentId, getTabSpaces, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, moveCursor, replaceAtIndex, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import { StyleProp, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { DEFAULT_FONT_SIZE, SINGLE_COLUMN_LINE_CLASS_NAME, SINGLE_TAB_UNICODE_ESCAPED, TAB_UNICODE_ESCAPED } from "../../globalVariables";
import { PageContext } from "./Page";
import Button from "../helpers/Button";
import { getNextTextInput, getPrevTextInput, isTextInputIdValid } from "../../utils/documentUtils";


// IDEA: 
    // mark multiple lines, style all, tab all, break all (mousemove event)
    // strg a
    // strg c / strg v(?)

// TODO: underline tabs
// TODO: fix tab size
// TODO: focus might have a performance issue, reduce getColumnTextInput calls!
export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    textInputIndex: number,
    isSingleColumnLine: boolean,
    key?: string | number
    id?: string | number,
    className?: string,
}) {

    const id = getDocumentId("TextInput", props.pageIndex, props.id ? props.id : "", props.columnIndex, props.paragraphIndex, props.textInputIndex);
    const className = props.className ? "TextInput " + props.className : "TextInput";

    const inputRef = useRef(null);
    
    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);

    const [dontHideConnectIconClassName, setDontHideConnectIconClassName] = useState("");
    const [isSingleColumnLineCandidate, setIsSingleColumnLineCandidate] = useState(false);


    useEffect(() => {
        // set initial font size
        setCssVariable("initialTextInputFontSize", DEFAULT_FONT_SIZE + getFontSizeDiffInWord(DEFAULT_FONT_SIZE) + "px");

        setIsSingleColumnLineCandidate(checkIsSingleColumnLineCandidate());

        // focus first text input of document or singleColumnLine
        if (id === getDocumentId("TextInput", 0, "", 0, 0, 0) || props.isSingleColumnLine)
            documentContext.focusTextInput(id);

    }, []);


    useEffect(() => {
        const isSingleColumnLineCandidate = checkIsSingleColumnLineCandidate();

        // update state
        setIsSingleColumnLineCandidate(isSingleColumnLineCandidate);

        // update classes
        if (isSingleColumnLineCandidate || props.isSingleColumnLine)
            setDontHideConnectIconClassName("dontHideConnectIcon");

    }, [documentContext.refreshSingleColumnLines])


    useEffect(() => {
        if (id !== documentContext.selectedTextInputId) 
            documentContext.unFocusTextInput(id);
        
    }, [documentContext.selectedTextInputId]);


    useEffect(() => {
        if (id === documentContext.selectedTextInputId) 
            documentContext.focusTextInput(id, false);

    }, [documentContext.selectedTextInputStyle]);


    useEffect(() => {
        if (id === documentContext.selectedTextInputId)
            handleFontSizeChange();

    }, [documentContext.selectedTextInputStyle.fontSize]);


    function handleFontSizeChange(): void {

        documentContext.focusTextInput(id, false);
            
        const numLinesToAdd = documentContext.getNumLinesOverhead();

        // case: some lines to add
        if (numLinesToAdd > 0) {
            // get all paragraphs to 
            const paragraphIds = documentContext.getParagraphIdsForFontSizeChange();
            documentContext.setParagraphIdAppendTextInput([paragraphIds, numLinesToAdd]);
        }
    }


    // 53.8ms
    // 148.3ms
    function handleKeyDown(event): void {

        // char that was just typed
        let typedChar = event.key === "Tab" ? getTabSpaces() : event.key;

        // case: text too long when including typed char
        if (isTextLongerThanInput(documentContext.selectedTextInputId, documentContext.getTextInputOverhead(), typedChar) && 
            isKeyAlphaNumeric(event.keyCode) && 
            appContext.pressedKey !== "Control")
            handleTextLongerThanLine(event);

        if (event.key === "Tab") 
            handleTab(event);
        
        else if (event.key === "Enter")
            focusNextTextInput(true);

        else if (event.key === "ArrowDown")
            focusNextTextInput(false);

        else if (event.key === "ArrowUp")
            focusPrevTextInput(event);

        else if (event.key === "ArrowLeft")
            handleArrowLeft(event);

        else if (event.key === "ArrowRight")
            handleArrowRight(event);

        else if (event.key === "Backspace")
            handleBackspace(event);
    }


    function handleMouseDown(event): void {

        // case: selected new text input
        if (documentContext.selectedTextInputId !== id) 
            documentContext.focusTextInput(id);
    }


    function handleClick(event): void {
        
        handleCursorInBetweenSingleTabUnicodes(event.target.id);
    }
    

    function handleMouseOver(event): void {

        handleSingleLineColumnMouseOver(event)
    }


    function handleMousOut(event): void {

        // hide borders
        if (props.isSingleColumnLine)
            $(inputRef.current).removeClass("textInputSingleColumnDisconnect");
        else
            getTextInputsInSameLine().forEach(textInput =>
                toggleSingleColumnLineCandidateBorder(true, textInput.prop("id")));
    }


    /**
     * Toggle borders for singleColumnLines and candidates
     */
    function handleSingleLineColumnMouseOver(event): void {

        let leftTextInputId = ""
        if (isSingleColumnLineCandidate || props.isSingleColumnLine) {
            // show borders
            getTextInputsInSameLine().forEach(textInput => {
                const textInputId = textInput.prop("id");
    
                // case: is candidate
                if (isSingleColumnLineCandidate) {
                    toggleSingleColumnLineCandidateBorder(false, textInputId);
                    
                    if (isLeftColumn(textInputId))
                        leftTextInputId = textInputId;            
                
                // case: is singleColumnLine
                } else if (isLastSingleColumnLine()) {
                    $(inputRef.current).addClass("textInputSingleColumnDisconnect");
                    leftTextInputId = id;
                }
            });
        }

        // show very left connect button
        $("#ButtonConnectLines" + leftTextInputId).fadeIn(100);
    }


    function isLastSingleColumnLine(): boolean { 

        // case: not a singleColumnLine
        if (!props.isSingleColumnLine) 
            return false;

        const singleColumnLines = $("." + SINGLE_COLUMN_LINE_CLASS_NAME);

        // case: no singleColumnLines at all
        if (!singleColumnLines.length)
            return false;

        const lastSingleColumnLine = singleColumnLines.get(singleColumnLines.length - 1);

        return id === lastSingleColumnLine!.id;
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
     * Remove tab unicodes. Move cursor to prev text input if at first char.
     */
    function handleBackspace(event): void {

        // case: is tab
        const cursorIndex = getCursorIndex(id);
        if (areCharsInFrontOfCursorTab()) {
            const input = $(inputRef.current!);
            const value: string = input.prop("value");

            // remove one unicode, let default behaivour remove the other
            let newValue = replaceAtIndex(value, "", cursorIndex - 1, cursorIndex);
            input.prop("value", newValue);

        // case: cursor at first char
        } else if (cursorIndex === 0 && !isTextInputValueMarked(id)) 
            focusPrevTextInput(event);
    }


    function handleTextLongerThanLine(event): void {
        
        const lastTextInputInColumn = documentContext.getLastTextInputOfColumn(id);
        const thisTextInput = $(inputRef.current);
        const nextTextInput = getNextTextInput(id);

        const isNotLastTextInputInColumn = lastTextInputInColumn.prop("id") !== id;
        const isNextTextInputBlank = !nextTextInput || isBlank(nextTextInput.prop("value"));
        const hasTextWhiteSpace = thisTextInput.prop("value").includes(" ");

        // case: can shift text to next line
        if (isNotLastTextInputInColumn && isNextTextInputBlank) {
            // case: dont shift text but continue in next input
            if (!hasTextWhiteSpace)
                focusNextTextInput(true);
            else 
                moveLastWordToNextTextInput();

        // case: can't shift text to next line
        } else {
            event.preventDefault();
            documentContext.handleTextLongerThanLine(id);
        }
    }


    function handleConnectLines(event): void {

        $(".connectIcon").hide();

        // only works because there's one text input per paragraph
        pageContext.connectColumnLines(props.paragraphIndex);
    }


    function handleDisconnectLines(event): void {

        // only works because there's one text input per paragraph
        pageContext.disconnectColumnLine(props.paragraphIndex);
    }


    function getTextInputsInSameLine(): JQuery[] {

        const textInputs: JQuery[] = [];
        
        for (let i = 0; i < documentContext.numColumns; i++) {
            // only works because there's one text input per paragraph
            const textInputId = getDocumentId("TextInput", props.pageIndex, "", i, props.paragraphIndex, props.textInputIndex);
            
            const textInput = $("#" + textInputId);
            if (textInput)
                textInputs.push(textInput);
        }

        return textInputs;
    }


    function toggleSingleColumnLineCandidateBorder(hide: boolean, textInputId = id): void {
        
        const thisTextInput = $("#" + textInputId);

        if (isLeftColumn(textInputId))
            if (hide)
                thisTextInput.removeClass("textInputLeftColumnConnect");
            else
                thisTextInput.addClass("textInputLeftColumnConnect");

        if (isMiddleColumn(textInputId))
            if (hide)
                thisTextInput.removeClass("textInputMiddleColumnConnect");
            else
                thisTextInput.addClass("textInputMiddleColumnConnect");

        if (isRightColumn(textInputId))
            if (hide)
                thisTextInput.removeClass("textInputRightColumnConnect");
            else
                thisTextInput.addClass("textInputRightColumnConnect");
    }


    /**
     * @returns true if this text input is not a singleColumnLine already but the previous text input in column is one, or if this text input is
     *          first in column and not a singleColumnLine. 
     *          False if only one column in document or is not first page.
     */
    function checkIsSingleColumnLineCandidate(): boolean {

        // case: no singleColumnLines possible
        if (documentContext.numColumns <= 1)
            return false;

        // case: not on first page
        if (props.pageIndex !== 0)
            return false;
    
        const isNoSingleColumnLine = !props.isSingleColumnLine;
        let prevTextInputIsSingleColumnLine = false;

        const prevTextInput = getPrevTextInput(id);

        // case: prev text input is singleColumnLine
        if (prevTextInput && prevTextInput.length)
            prevTextInputIsSingleColumnLine = prevTextInput.prop("className").includes(SINGLE_COLUMN_LINE_CLASS_NAME);
    
        // case: no prev text input at all
        if (!prevTextInput || !prevTextInput.length)
            return isNoSingleColumnLine;

        const prevTextInputId = prevTextInput.prop("id");

        const prevTextInputColumnIndex = stringToNumber(getPartFromDocumentId(prevTextInputId, 2));

        // case: first text input in column on first page
        if (props.columnIndex !== prevTextInputColumnIndex)
            prevTextInputIsSingleColumnLine = true;

        return isNoSingleColumnLine && prevTextInputIsSingleColumnLine;
    }


    function isLeftColumn(textInputId = id): boolean {

        isTextInputIdValid(textInputId);

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex === 0;
    }


    function isMiddleColumn(textInputId = id): boolean {

        isTextInputIdValid(textInputId);

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex >= 1 && documentContext.numColumns >= 3;
    }


    function isRightColumn(textInputId = id): boolean {

        isTextInputIdValid(textInputId);

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex === documentContext.numColumns - 1;
    }


    /**
     * Remove last word (separator is the last white space char) of this text input and add it to next text input.
     * Do nothing if there is no white space char in this text input's value.
     */
    function moveLastWordToNextTextInput(): void {

        const thisTextInput = $(inputRef.current);
        const nextTextInput = getNextTextInput(id);

        // case: no next text input
        if (!nextTextInput)
            return;

        let thisInputValue = thisTextInput.prop("value");
        const lastSpaceIndex = thisInputValue.lastIndexOf(" ");

        // case: no space char
        if (lastSpaceIndex === -1)
            return;

        const lastWord = thisInputValue.substring(lastSpaceIndex + 1);

        // remove last word from this text input
        thisInputValue = replaceAtIndex(thisInputValue, "", lastSpaceIndex + 1);
        thisTextInput.prop("value", thisInputValue);

        // add last word to next text input
        focusNextTextInput(true);
        nextTextInput.val(lastWord);
    }


    /**
     * @param copyStyles if true, all styles of selected text input will be copied to next text input
     * @param stylePropsToOverride style props to override the selected style props with if ```copyStyles```is true
     */
    function focusNextTextInput(copyStyles: boolean, stylePropsToOverride: [StyleProp, string | number][] = []): void {

        const nextTextInput = getNextTextInput(id);
        
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
            
            documentContext.focusTextInput(nextTextInput.prop("id"), false);
            documentContext.setSelectedTextInputStyle(getTextInputStyle($("#" + id)), stylePropsToOverride);

        // case: next text input not blank
        } else 
            documentContext.focusTextInput(nextTextInput.prop("id"), true);
    }


    function focusPrevTextInput(event): void {

        const prevTextInput = getPrevTextInput(id);

        // case: has no prev text input
        if (!prevTextInput) 
            return;

        event.preventDefault();
        documentContext.focusTextInput(prevTextInput.prop("id"), true);

        // move cursor to end of text
        const lastCharIndex = prevTextInput.prop("value").length;
        moveCursor(prevTextInput.prop("id"), lastCharIndex, lastCharIndex);
    }


    /**
     * @returns true if ```2 chars in front of cursor === TAB_UNICODE_ESCAPED```.
     */
    function areCharsInFrontOfCursorTab(): boolean {

        // get input value
        const input = $(inputRef.current!);
        const value: string = input.prop("value");

        // case: text is marked
        if (isTextInputValueMarked(input.prop("id")))
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


    /**
     * @param textInputId id of text input to check the value of 
     * @returns true if value of text input is marked
     */
    function isTextInputValueMarked(textInputId: string): boolean {

        if (!textInputId)
            return false;

        const textInput = $("#" + textInputId);
        return textInput.prop("selectionStart") !== textInput.prop("selectionEnd")
    }


    return (
        <div className={"textInputContainer flexCenter " + dontHideConnectIconClassName} 
            onMouseOver={handleMouseOver}
            onMouseOut={handleMousOut}
             >
            <label className={"textInputLabel " + dontHideConnectIconClassName} htmlFor={id}>
                {/* connect column lines */}
                <Button id={"ConnectLines" + id}
                        className={"connectIcon flexCenter " + dontHideConnectIconClassName}
                        title={props.isSingleColumnLine ? "Zeile aufspalten" : "Zeilen verbinden"}

                        childrenClassName={"flexCenter " + dontHideConnectIconClassName}
                        boxStyle={{
                            backgroundColor: props.isSingleColumnLine ? "rgb(255, 200, 180)" : "rgb(180, 200, 255)",
                            borderRadius: "50%",
                            marginBottom: "2px",
                        }}
                        childrenStyle={{
                            borderRadius: "50%",
                            height: "30px",
                            padding: "0px",
                            width: "30px"
                        }}      
                        hoverBackgroundColor={props.isSingleColumnLine ? "rgb(255, 180, 160)" : "rgb(160, 180, 255)"}
                        clickBackgroundColor="rgb(220, 220, 220)"

                        handleClick={props.isSingleColumnLine ? handleDisconnectLines : handleConnectLines} 
                        >
                    <i className={"fa-solid fa-link " + dontHideConnectIconClassName + (props.isSingleColumnLine ?  "hidden" : "")}></i>
                    <i className={"fa-solid fa-link-slash " + dontHideConnectIconClassName + (props.isSingleColumnLine ? "" : " hidden")}></i>
                </Button>
            </label>

            <input id={id} 
                className={className + " " + dontHideConnectIconClassName} 
                ref={inputRef} 
                type="text" 
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                />
        </div>
    )
}