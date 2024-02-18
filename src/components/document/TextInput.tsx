import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equalsIgnoreCaseTrim, flashClass, getCursorIndex, getJQueryElementById, insertString, isBlank, isKeyAlphaNumeric, log, moveCursor, replaceAtIndex, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import { StyleProp, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { DEFAULT_FONT_SIZE, KEY_CODES_NO_TYPED_CHAR, SINGLE_COLUMN_LINE_CLASS_NAME, TAB_UNICODE } from "../../globalVariables";
import { PageContext } from "./Page";
import Button from "../helpers/Button";
import { getBrowserFontSizeByMSWordFontSize, getCSSValueAsNumber, getDocumentId, getNextTextInput, getPartFromDocumentId, getPrevTextInput, isTextInputIdValid, isTextLongerThanInput } from "../../utils/documentBuilderUtils";


/**
 * Component defining a text input in the <Document /> and it's logic and styling information.
 * 
 * @since 0.0.1
 */
// IDEA: 
// mark multiple lines, style all, tab all, break all (mousemove event)
// strg a
// strg c / strg v(?)

// TODO: add pictures
// TODO: add table
// TODO: add more pages

// TODO: move cursor to same char index or end on arrow up / down
export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    textInputIndex: number,
    isSingleColumnLine: boolean,
    focusOnRender?: boolean,
    propKey?: string | number
    id?: string | number,
    className?: string,
}) {

    const id = getDocumentId("TextInput", props.pageIndex, props.columnIndex, props.textInputIndex, props.id);
    const className = "TextInput " + (props.className || "");

    const inputRef = useRef(null);
    
    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);

    const [dontHideConnectIconClassName, setDontHideConnectIconClassName] = useState("");
    const [isSingleColumnLineCandidate, setIsSingleColumnLineCandidate] = useState(false);

    const [textInputBorderFlashing, setTextInputBorderFlashing] = useState(false);


    useEffect(() => {
        // set initial font size
        setCssVariable("initialTextInputFontSize", getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE) + "px");

        if ((id === getDocumentId("TextInput", 0, 0, 0) && !props.isSingleColumnLine) || props.focusOnRender)
            documentContext.focusTextInput(id);

    }, []);
    

    useEffect(() => {
        const isSingleColumnLineCandidate = checkIsSingleColumnLineCandidate();

        handleRefreshSingleColumnLine(isSingleColumnLineCandidate);

        if (id === documentContext.selectedTextInputId) 
            documentContext.focusTextInput(id, false, true, undefined, false);

    }, [documentContext.refreshSingleColumnLines]);


    useEffect(() => {
        if (id === documentContext.selectedTextInputId) 
            documentContext.focusTextInput(id, false, true, undefined, false);

    }, [documentContext.selectedTextInputStyle]);


    useEffect(() => {
        if (id !== documentContext.selectedTextInputId) 
            $(inputRef.current!).removeClass("textInputFocus");

    }, [documentContext.selectedTextInputId]);


    function handleKeyDown(event): void {

        const eventKey = event.key;

        // case: text too long when including typed char
        if (!KEY_CODES_NO_TYPED_CHAR.includes(event.keyCode) && (appContext.pressedKey !== "Control"))
            // case: no back tab
            if (eventKey !== "Tab" || appContext.pressedKey !== "Shift")
                // case: text too long
                if (isTextLongerThanInput(documentContext.selectedTextInputId, eventKey === "Tab" ? TAB_UNICODE : eventKey))
                    handleTextLongerThanLine(event);

        if (eventKey === "Tab")
            handleTab(event);
        
        else if (eventKey === "Enter")
            focusNextTextInput(true);

        else if (eventKey === "ArrowDown")
            focusNextTextInput(false);

        else if (eventKey === "ArrowUp")
            focusPrevTextInput(event);

        else if (eventKey === "ArrowLeft")
            handleArrowLeft(event);

        else if (eventKey === "ArrowRight")
            handleArrowRight(event);

        else if (eventKey === "ArrowLeft")
            handleBackspace(event);
    }


    function handlePaste(event): void {

        const pastedText = event.clipboardData.getData("text") || "";

        if (isTextLongerThanInput(documentContext.selectedTextInputId, pastedText))
            handleTextLongerThanLinePreventKeyDown(event);
    }


    function handleMouseDown(event): void {

        // case: selected new text input
        if (documentContext.selectedTextInputId !== id) 
            documentContext.focusTextInput(id);
    }


    function handleMouseOver(event): void {

        handleSingleColumnLineMouseOver(event);
    }


    function handleMousOut(event): void {

        // hide borders
        if (!props.isSingleColumnLine)
            getTextInputsInSameLine().forEach(textInput =>
                toggleSingleColumnLineCandidateBorder(true, textInput.prop("id")));
    }


    /**
     * Toggle borders for singleColumnLines and candidates
     */
    function handleSingleColumnLineMouseOver(event): void {

        let leftTextInputId = ""
        if (isSingleColumnLineCandidate || props.isSingleColumnLine) {
            // toggle borders
            getTextInputsInSameLine().forEach(textInput => {
                const textInputId = textInput.prop("id");
    
                // case: is candidate
                if (isSingleColumnLineCandidate) {
                    toggleSingleColumnLineCandidateBorder(false, textInputId);
                    
                    if (isLeftColumn(textInputId, false))
                        leftTextInputId = textInputId;            
                
                // case: is singleColumnLine
                } else if (isLastSingleColumnLine())
                    leftTextInputId = id;
            });
        }

        // toggle very left connect button
        $("#ButtonConnectLines" + leftTextInputId).fadeIn(100);
    }


    function handleArrowLeft(event): void {

        const cursorIndex = getCursorIndex(id);

        if (cursorIndex === 0)
            focusPrevTextInput(event);
    }


    function handleArrowRight(event): void {
        
        const cursorIndex = getCursorIndex(id);
        const inputValue = $(inputRef.current!).prop("value");

        if (!inputValue || cursorIndex === inputValue.length) {
            event.preventDefault();
            focusNextTextInput(false);
            moveCursor(getNextTextInput(id)?.prop("id"), 0);
        }
    }


    function getLastSingleColumnLine(): HTMLElement | null {

        const singleColumnLines = $("." + SINGLE_COLUMN_LINE_CLASS_NAME);

        // case: no singleColumnLines at all
        if (!singleColumnLines.length)
            return null;

        return singleColumnLines.get(singleColumnLines.length - 1) || null;
    }


    function isLastSingleColumnLine(): boolean {

        // case: not a singleColumnLine
        if (!props.isSingleColumnLine) 
            return false;

        const lastSingleColumnLine = getLastSingleColumnLine();

        if (!lastSingleColumnLine)
            return false;

        return id === lastSingleColumnLine!.id;
    }


    function handleTab(event): void {

        event.preventDefault();

        if (appContext.pressedKey === "Shift") {
            handleBackTab(event);

        } else {
            // case: text too long
            if (isTextLongerThanInput(documentContext.selectedTextInputId, TAB_UNICODE)) {
                handleTextLongerThanLine(event);
                return;
            }

            // add tab after cursor
            const selectedTextInput = $("#" + documentContext.selectedTextInputId);
            const cursorIndex = selectedTextInput.prop("selectionStart");
            const newInputValue = insertString(selectedTextInput.prop("value"), TAB_UNICODE, cursorIndex);
            selectedTextInput.prop("value", newInputValue);

            // move cursor to end of tab
            moveCursor(documentContext.selectedTextInputId, cursorIndex + (equalsIgnoreCaseTrim(documentContext.selectedTextInputStyle.textAlign, "right") ? 0 : + 1));
        }
    }


    function handleBackTab(event): void {

        const textInputValue = $(inputRef.current!).prop("value");
        const cursorIndex = getCursorIndex(id);

        // case: no text or invalid cursor index
        if (cursorIndex < 1)
            return;

        const charInFrontOfCursor = textInputValue.charAt(cursorIndex - 1);

        // case: not a tab
        if (charInFrontOfCursor !== TAB_UNICODE)
            return;
        
        // remove tab
        const newTextInputValue = replaceAtIndex(textInputValue, "", cursorIndex - 1, cursorIndex);

        // update text input
        $(inputRef.current!).val(newTextInputValue);
        moveCursor(id, cursorIndex - 1);
    }


    /**
     * Move cursor to prev text input if at first char.
     */
    function handleBackspace(event): void {

        const cursorIndex = getCursorIndex(id);

        // case: cursor at first char
        if (cursorIndex === 0 && !isTextInputValueMarked(id)) 
            focusPrevTextInput(event);
    }


    async function handleTextLongerThanLine(event): Promise<void> {
        
        const lastTextInputInColumn = documentContext.getLastTextInputOfColumn(id);

        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue = thisTextInput.prop("value");

        const nextTextInput = getNextTextInput(id);
        
        const isNotLastTextInputInColumn = lastTextInputInColumn && lastTextInputInColumn.prop("id") !== id;
        const isNextTextInputBlank = !nextTextInput || isBlank(nextTextInput.prop("value"));
        const cursorIndex = getCursorIndex(id);
        
        // case: can shift text to next line
        if (isNotLastTextInputInColumn && isNextTextInputBlank && cursorIndex === thisTextInputValue.length) {
            // case: dont shift text but continue in next input
            const hasTextWhiteSpace = thisTextInputValue.includes(" ");
            if (!hasTextWhiteSpace)
                focusNextTextInput(true);
            else 
                moveLastWordToNextTextInput();

        // case: can't shift text to next line
        } else
            handleTextLongerThanLinePreventKeyDown(event);
    }


    async function handleTextLongerThanLinePreventKeyDown(event): Promise<void> {

        event.preventDefault();

        // case: border still flashing
        if (textInputBorderFlashing)
            return;

        setTextInputBorderFlashing(true);
        await flashClass(id, "textInputFlash", "textInputFocus", 200);
        setTextInputBorderFlashing(false);
    }


    function handleRefreshSingleColumnLine(isSingleColumnLineCandidate: boolean): void {

        // update state
        setIsSingleColumnLineCandidate(isSingleColumnLineCandidate);

        // update input classes
        if (isSingleColumnLineCandidate) {
            setDontHideConnectIconClassName("dontHideConnectIcon");
            $(inputRef.current!).addClass("singleColumnLineCandidate");
            $(inputRef.current!).addClass("dontHideConnectIcon");
            $(inputRef.current!).removeClass("dontHideDisConnectIcon");

        } else if (props.isSingleColumnLine) {
            setDontHideConnectIconClassName("dontHideDisConnectIcon");
            $(inputRef.current!).removeClass("singleColumnLineCandidate");
            $(inputRef.current!).addClass("dontHideDisConnectIcon");
            $(inputRef.current!).removeClass("dontHideConnectIcon");
        }
    }


    function toggleSingleColumnLineStyle(event): void {

        $(".connectOrDisconnectButton").hide();

        pageContext.handleConnectDisconnectTextInput(id, props.isSingleColumnLine);
    }


    function getTextInputsInSameLine(): JQuery[] {

        const textInputs: JQuery[] = [];
        
        for (let i = 0; i < documentContext.numColumns; i++) {
            const textInputId = getDocumentId("TextInput", props.pageIndex, i, props.textInputIndex);
            
            const textInput = $("#" + textInputId);
            if (textInput)
                textInputs.push(textInput);
        }

        return textInputs;
    }


    function toggleSingleColumnLineCandidateBorder(hide: boolean, textInputId = id): void {
        
        const thisTextInput = $("#" + textInputId);

        if (isLeftColumn(textInputId, false))
            if (hide)
                thisTextInput.removeClass("textInputLeftColumnConnect");
            else
                thisTextInput.addClass("textInputLeftColumnConnect");

        if (isMiddleColumn(textInputId, false))
            if (hide)
                thisTextInput.removeClass("textInputMiddleColumnConnect");
            else
                thisTextInput.addClass("textInputMiddleColumnConnect");

        if (isRightColumn(textInputId, false))
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

        const prevTextInput = getPrevTextInput(id, false);

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


    function isLeftColumn(textInputId = id, debug = true): boolean {

        if (!isTextInputIdValid(textInputId, debug))
            return false;

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex === 0;
    }


    function isMiddleColumn(textInputId = id, debug = true): boolean {

        if (!isTextInputIdValid(textInputId, debug))
            return false;

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex >= 1 && documentContext.numColumns >= 3;
    }


    function isRightColumn(textInputId = id, debug = true): boolean {

        if (!isTextInputIdValid(textInputId, debug))
            return false;

        const columnIndex = stringToNumber(getPartFromDocumentId(textInputId, 2));

        return columnIndex === documentContext.numColumns - 1;
    }


    /**
     * Remove last word (separator is the last white space char) of this text input and add it to next text input.
     * Do nothing if there is no white space char in this text input's value.
     */
    function moveLastWordToNextTextInput(): void {

        const thisTextInput = $(inputRef.current!);
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

        // case: next text input blank
        if (copyStyles && isBlank(nextTextInput.prop("value"))) {
            const fontSizeDiff = documentContext.subtractMSWordFontSizes($(inputRef.current!).css("fontSize"), nextTextInput.css("fontSize"));
            
            // case: cant handle font size
            if (!documentContext.handleFontSizeChange(fontSizeDiff, nextTextInputId))
                // keep nextTextInput's fontSize
                stylePropsToOverride?.push(["fontSize", getCSSValueAsNumber(nextTextInput.css("fontSize"), 2)]);
            
            documentContext.focusTextInput(nextTextInputId, false);
            documentContext.setSelectedTextInputStyle(getTextInputStyle($(inputRef.current!)), stylePropsToOverride);

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
        moveCursor(prevTextInput.prop("id"), lastCharIndex);
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
            key={props.propKey}
             >
            <label className={"textInputLabel " + dontHideConnectIconClassName} htmlFor={id}>
                <Button id={"ConnectLines" + id}
                        className={"connectOrDisconnectButton flexCenter " + dontHideConnectIconClassName}
                        title={props.isSingleColumnLine ? "Zeile aufspalten" : "Zeilen verbinden"}
                        childrenClassName={"flexCenter " + dontHideConnectIconClassName}
                        boxStyle={{
                            backgroundColor: props.isSingleColumnLine ? "rgb(255, 200, 180)" : "rgb(180, 200, 255)",
                            borderRadius: "50%",
                            marginBottom: "2px",
                        }}
                        childrenStyle={{
                            borderRadius: "50%",
                            height: "25px",
                            padding: "0px",
                            width: "25px"
                        }}      
                        hoverBackgroundColor={props.isSingleColumnLine ? "rgb(255, 180, 160)" : "rgb(160, 180, 255)"}
                        clickBackgroundColor="rgb(220, 220, 220)"
                        onClick={toggleSingleColumnLineStyle} 
                        >
                    <i className={"fa-solid fa-link connectIcon " + dontHideConnectIconClassName + " " + (props.isSingleColumnLine && " hidden")}></i>
                    <i className={"fa-solid fa-link-slash disconnectIcon minorMarginTopOne " + dontHideConnectIconClassName + " " + (!props.isSingleColumnLine && " hidden")}></i>
                </Button>
            </label>
            
            {/* Note: don't pass states into className, since jquery's .addClass would mess with that */}
            <input id={id} className={className}
                ref={inputRef} 
                type="text" 
                onMouseDown={handleMouseDown}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                />
        </div>
    )
}