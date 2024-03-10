import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/TextInput.css"; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equalsIgnoreCaseTrim, flashClass, getCursorIndex, getJQueryElementById, getTextWidth, includesIgnoreCaseTrim, insertString, isBlank, isEmpty, isNumberFalsy, log, moveCursor, replaceAtIndex, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import Style, { SingleStyle, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "../../abstract/Style";
import { DocumentContext } from "./Document";
import { DEFAULT_FONT_SIZE, KEY_CODES_NO_TYPED_CHAR, MAX_NUM_SINGLE_COLUMN_LINES, SINGLE_COLUMN_LINE_CLASS_NAME, TAB_UNICODE } from "../../globalVariables";
import { PageContext } from "./Page";
import Button from "../helpers/Button";
import { getBrowserFontSizeByMSWordFontSize, getColumnTextInputsAfter, getDocumentId, getLastTextInputOfColumn, getMarkedTextInputValue, getNextTextInput, getPartFromDocumentId, getPrevTextInput, getTextInputValueSubstringOfWidth, isTextInputIdValid, isTextInputValueMarked, isTextLongerThanInput } from "../../utils/documentBuilderUtils";
import { ColumnContext } from "./Column";


/**
 * Component defining a text input in the <Document /> and it's logic and styling information.
 * 
 * @since 0.0.1
 */
// IDEA: 
// mark multiple lines, style all, tab all, break all (mousemove event)
// strg a
// strg c / strg v(?)

// FEAT: add pictures
// FEAT: add table
// FEAT: add more pages

export default function TextInput(props: {
    pageIndex: number,
    columnIndex: number,
    textInputIndex: number,
    isSingleColumnLine: boolean,
    focusOnRender?: boolean,
    /** initial position of cursor in case of focusOnRender === true */
    cursorIndex?: number,
    initValue?: string,
    initStyle?: Style,
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
    const columnContext = useContext(ColumnContext);
    
    const [dontHideConnectIconClassName, setDontHideConnectIconClassName] = useState("");
    const [isSingleColumnLineCandidate, setIsSingleColumnLineCandidate] = useState(false);
    const [isLastSingleColumnLine, setIsLastSingleColumnLine] = useState(false);

    const [textInputBorderFlashing, setTextInputBorderFlashing] = useState(false);


    useEffect(() => {
        // set initial font size
        setCssVariable("initialTextInputFontSize", getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE) + "px");

        applyInitProps();

    }, []);


    useEffect(() => {
        const isSingleColumnLineCandidate = checkIsSingleColumnLineCandidate();

        handleRefreshSingleColumnLine(isSingleColumnLineCandidate);

        if (id === documentContext.selectedTextInputId) 
            documentContext.focusTextInput(id, false, true, false);

    }, [documentContext.refreshSingleColumnLines]);


    useEffect(() => {
        if (id === documentContext.selectedTextInputId)
            documentContext.focusTextInput(id, false, true, false);

    }, [documentContext.selectedTextInputStyle]);


    useEffect(() => {
        if (id !== documentContext.selectedTextInputId) 
            $(inputRef.current!).removeClass("textInputFocus");

    }, [documentContext.selectedTextInputId]);

    
    /**
     * Apply certain props to this text input, i.e. "defaultValue".
     */
    function applyInitProps(): void {

        const textInput = $(inputRef.current!);
        const focusTextInput = (id === getDocumentId("TextInput", 0, 0, 0) && !props.isSingleColumnLine) || props.focusOnRender;

        if (props.initValue)
            textInput.val(props.initValue);

        if (props.initStyle) {
            applyTextInputStyle(id, props.initStyle);

            // only set style if not focusing on render
            if (!focusTextInput)
                documentContext.setSelectedTextInputStyle(props.initStyle);
        }

        if (focusTextInput) {
            documentContext.focusTextInput(id);

            if (!isNumberFalsy(props.cursorIndex))
                moveCursor(id, props.cursorIndex);
        }
    }


    function handleKeyDown(event): void {

        const eventKey = event.key;

        // case: text too long when including typed char
        if (!KEY_CODES_NO_TYPED_CHAR.includes(event.keyCode) && (appContext.pressedKey !== "Control"))
            // case: no back tab
            if (eventKey !== "Tab" || appContext.pressedKey !== "Shift")
                // case: text too long
                if (isTextLongerThanInput(documentContext.selectedTextInputId, eventKey === "Tab" ? TAB_UNICODE : eventKey).isTextTooLong)
                    handleTextLongerThanLine(event);

        if (eventKey === "Tab")
            handleTab(event);
        
        else if (eventKey === "Enter")
            handleEnter(event);
            
        else if (eventKey === "Backspace")
            handleBackspace(event);

        else if (eventKey === "Delete")
            handleDeleteKey(event);

        else if (eventKey === "ArrowDown")
            handleArrowDown(event);

        else if (eventKey === "ArrowUp")
            handleArrowUp(event);

        else if (eventKey === "ArrowLeft")
            handleArrowLeft(event);

        else if (eventKey === "ArrowRight")
            handleArrowRight(event);
    }


    function handlePaste(event): void {

        const pastedText = event.clipboardData.getData("text") || "";

        if (isTextLongerThanInput(documentContext.selectedTextInputId, pastedText).isTextTooLong)
            handleTextLongerThanLinePreventKeyDown(event);
    }


    function handleMouseDown(event): void {

        // case: selected new text input
        if (documentContext.selectedTextInputId !== id) 
            documentContext.focusTextInput(id);
    }


    function handleMouseOver(event): void {

        // only handle connect lines if max num single column lines not reached yet
        if (props.isSingleColumnLine || documentContext.numSingleColumnLines < MAX_NUM_SINGLE_COLUMN_LINES) {
            const leftTextInputId = handleSingleColumnLineCandidateMouseOver(event);
            
            // fade in connect / disconnect button on the left
            $("#ButtonConnectLines" + leftTextInputId).fadeIn(100);
        }
    }


    function handleMousOut(event): void {

        // hide borders
        if (!props.isSingleColumnLine)
            getTextInputsInSameLine().forEach(textInput =>
                toggleSingleColumnLineCandidateBorder(true, textInput.prop("id")));
    }


    /**
     * Toggle styles for singleColumnLineCandidates.
     */
    function handleSingleColumnLineCandidateMouseOver(event): string {

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
                } else if (isLastSingleColumnLine)
                    leftTextInputId = id;
            });
        }

        return leftTextInputId;
    }


    function handleArrowLeft(event): void {

        const cursorIndex = getCursorIndex(id);

        if (cursorIndex !== 0)
            return;

        const prevTextInput = focusPrevTextInput(event);
        if (!prevTextInput)
            return;

        moveCursor(prevTextInput.prop("id"), prevTextInput.prop("value").length)
    }


    function handleArrowRight(event): void {
        
        const cursorIndex = getCursorIndex(id);
        const inputValue = $(inputRef.current!).prop("value");

        if (!inputValue || cursorIndex === inputValue.length) {
            event.preventDefault();

            const nextTextInput = focusNextTextInput(false);
            if (nextTextInput)
                moveCursor(nextTextInput.prop("id"), 0);
        }
    }


    function handleArrowDown(event): void {

        event.preventDefault();

        const cursorPos = getCursorIndex(id);

        const nextTextInput = focusNextTextInput(false);

        if (!nextTextInput)
            return;

        // set cursor to where it was in text input above
        moveCursor(nextTextInput.prop("id"), cursorPos, cursorPos);
    }


    function handleArrowUp(event): void {
        
        event.preventDefault();

        const cursorPos = getCursorIndex(id);

        const prevTextInput = focusPrevTextInput(event);

        if (!prevTextInput)
            return;

        // set cursor to where it was in text input below
        moveCursor(prevTextInput.prop("id"), cursorPos, cursorPos);
    }


    function getLastSingleColumnLine(): HTMLElement | null {

        const singleColumnLines = $("." + SINGLE_COLUMN_LINE_CLASS_NAME);

        // case: no singleColumnLines at all
        if (!singleColumnLines.length)
            return null;

        return singleColumnLines.get(singleColumnLines.length - 1) || null;
    }


    function checkIsLastSingleColumnLine(): boolean {

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
            if (isTextLongerThanInput(documentContext.selectedTextInputId, TAB_UNICODE).isTextTooLong) {
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


    function handleEnter(event): void {

        const nextTextInput = getNextTextInput(id);
        if (!nextTextInput)
            return;
        const nextTextInputId = nextTextInput.prop("id");

        const thisTextInput = $(inputRef.current!);
        let thisTextInputValue: string = thisTextInput.prop("value");

        const cursorIndex = getCursorIndex(id);

        // case: text is marked
        if (isTextInputValueMarked(id)) {
            const markedText = getMarkedTextInputValue(id);
            
            // remove marked text
            thisTextInputValue = thisTextInputValue.replace(markedText, "");
            thisTextInput.val(thisTextInputValue);
        }
        
        const textBeforeCursor = thisTextInputValue.substring(0, cursorIndex);
        const textAfterCursor = thisTextInputValue.substring(cursorIndex);

        // case: no text inputs found
        const allColumnTextInputsAfterIncluding = getColumnTextInputsAfter(id);
        if (!allColumnTextInputsAfterIncluding?.length)
            return;

        // case: last text input not blank
        if (allColumnTextInputsAfterIncluding.length !== 0 && !isBlank(allColumnTextInputsAfterIncluding.last().prop("value"))) {
            documentContext.showSubtlePopup("Kann keinen Absatz machen", "Die Letzte Zeile des Dokumentes muss leer sein, um weitere Absätze machen zu können.", "Warn");
            return;
        }

        const fontSizeDiff = documentContext.subtractMSWordFontSizes(thisTextInput.css("fontSize"), nextTextInput.css("fontSize"));
        const numLinesDiff = documentContext.getNumLinesDeviation(id, fontSizeDiff);
        const wrapper = {
            columnIds: new Set<string>(),
            numTextInputsToRemove: 0
        }
        const canHandleFontSize = documentContext.canHandleFontSizeTooLarge(wrapper, numLinesDiff, nextTextInputId, true, props.isSingleColumnLine);
        const stylesToOverride: SingleStyle[] = canHandleFontSize ? [] : [{attr: "fontSize", value: getBrowserFontSizeByMSWordFontSize(14)}];
        
        // shift all following text input values and styles excluding this one
        shiftTextInputValuesAndStyles("down", id, allColumnTextInputsAfterIncluding);

        // remove text from this text input
        thisTextInput.val(textBeforeCursor);
        // add text to next text input
        nextTextInput.val(textAfterCursor);

        focusNextTextInput(true, stylesToOverride);
        moveCursor(nextTextInputId, 0);
    }


    function handleBackspace(event): void {

        const cursorIndex = getCursorIndex(id);

        // case: not at start of line
        if (cursorIndex !== 0)
            return;

        // case: text is marked
        if (isTextInputValueMarked(id))
            return;

        event.preventDefault();

        const prevTextInput = getPrevTextInput(id);
        // case: is first line of document
        if (!prevTextInput)
            return;
        const prevTextInputId = prevTextInput.prop("id");
        const prevTextInputValue: string = prevTextInput.prop("value");

        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue: string = thisTextInput.prop("value");

        const { isTextTooLong, textOverheadWidth } = isTextLongerThanInput(prevTextInputId, thisTextInputValue);
        // case: this text input value is too long for prev text input
        if (isTextTooLong) {
            // get text that would fit in prev text input
            handleBackspaceTextTooLong(textOverheadWidth);

        // case: whole text fits
        } else {
            // shift all following text input values and styles excluding this one
            shiftTextInputValuesAndStyles("up");

            // append this value to prev value
            const newTextInputValue = prevTextInputValue + thisTextInputValue;
            prevTextInput.val(newTextInputValue);

            // handle potential font size change
            const fontSizeDiff = documentContext.subtractMSWordFontSizes(getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE), thisTextInput.css("fontSize"));
            documentContext.handleFontSizeChange(fontSizeDiff, id);
        }

        focusPrevTextInput(event, isEmpty(prevTextInputValue));
        moveCursor(prevTextInputId, prevTextInputValue.length);
    }


    // TODO: delete next char sequence until space even if no space in this one
    // TODO: space??
    function handleDeleteKey(event): void {
        
        const cursorIndex = getCursorIndex(id);
        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue: string = thisTextInput.prop("value");
        
        // case: not at end of line
        if (cursorIndex !== thisTextInputValue.length)
            return;

        event.preventDefault();
        
        const nextTextInput = getNextTextInput(id);
        // case: is first line of document
        if (!nextTextInput)
            return;

        const nextTextInputValue: string = nextTextInput.prop("value");
    
        const { isTextTooLong, textOverheadWidth } = isTextLongerThanInput(id, nextTextInputValue);
        // case: next text input value is too long for this text input
        if (isTextTooLong) {
            // get text that would fit inside this text input
            handleDeleteTextTooLong(textOverheadWidth);

            moveCursor(id, cursorIndex);

        // case: whole text fits
        } else {
            // apply styles of next text input
            if (isEmpty(thisTextInputValue))
                documentContext.setSelectedTextInputStyle(getTextInputStyle(nextTextInput.prop("id")));

            // shift all following text input values and styles excluding this one
            shiftTextInputValuesAndStyles("up", id, getColumnTextInputsAfter(id));

            // append next value to this value
            const newTextInputValue = thisTextInputValue + nextTextInputValue;
            thisTextInput.val(newTextInputValue);

            // handle potential font size change
            const fontSizeDiff = documentContext.subtractMSWordFontSizes(getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE), nextTextInput.css("fontSize"));
            documentContext.handleFontSizeChange(fontSizeDiff, id);

            moveCursor(id, cursorIndex);
        }
    }


    /**
     * Move all text inputs after and including this text input one line up or down. "Moving" them means copying their value and style. Used for "Enter" or "Backspace" keys.
     *  
     * @param direction to shift the text input values to, possible values are "up" or "down" (backspace or enter key)
     * @param allColumnTextInputsAfterIncluding list of text inputs after and including this text input, if not present those will be fetched
     */
    function shiftTextInputValuesAndStyles(direction: "up" | "down", documentId = documentContext.selectedTextInputId, allColumnTextInputsAfterIncluding?: JQuery | null): void {

        if (!allColumnTextInputsAfterIncluding)
            allColumnTextInputsAfterIncluding = getColumnTextInputsAfter(documentId, true);

        // case: no text inputs at all
        if (!allColumnTextInputsAfterIncluding)
            return;

        // case: enter key
        if (direction === "down") {
            for (let i = allColumnTextInputsAfterIncluding.length - 1; i >= 0; i--) {
                const textInput = (allColumnTextInputsAfterIncluding.get(i) as HTMLInputElement);
                if (!textInput)
                    continue;

                const prevTextInput = (allColumnTextInputsAfterIncluding.get(i - 1) as HTMLInputElement);
                // case: reached selected text input
                if (i === 0)
                    break;

                const prevTextInputValue = prevTextInput.value;
                const prevTextInputStyle = getTextInputStyle(prevTextInput.id);
                
                textInput.value = prevTextInputValue;
                applyTextInputStyle(textInput.id, prevTextInputStyle);
            }

        // case: backspace key
        } else if (direction === "up") {
            for (let i = 0; i < allColumnTextInputsAfterIncluding.length; i++) {
                const textInput = (allColumnTextInputsAfterIncluding.get(i) as HTMLInputElement);
                if (!textInput)
                    continue;

                const nextTextInput = (allColumnTextInputsAfterIncluding.get(i + 1) as HTMLInputElement);
                // case: end of document
                if (!nextTextInput) {
                    textInput.value = "";
                    applyTextInputStyle(textInput.id, getDefaultStyle());
                    break;
                }
                
                if (nextTextInput.id === documentContext.selectedTextInputId)
                    break;

                const nextTextInputValue = nextTextInput.value;
                const nextTextInputStyle = getTextInputStyle(nextTextInput.id);

                textInput.value = nextTextInputValue;
                applyTextInputStyle(textInput.id, nextTextInputStyle);
            }
        }
    }


    /**
     * Append longest possible substring of this text inputs value to prev text input value.
     * 
     * @param textOverheadWidth width of the text that cannot fit inside prev text input
     */
    function handleBackspaceTextTooLong(textOverheadWidth: number): void {

        const prevTextInput = getPrevTextInput(id);
        if (!prevTextInput)
            return;

        const prevTextInputValue = prevTextInput.prop("value");
        
        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue = thisTextInput.prop("value");

        // get text that would fit in prev text input
        const fittingTextWidth = getTextWidth(thisTextInputValue, prevTextInput.css("fontSize"), prevTextInput.css("fontFamily"), prevTextInput.css("fontWeight")) - textOverheadWidth;
        const fittingText = getTextInputValueSubstringOfWidth(id, fittingTextWidth)!;

        // append text that just fits
        const newPrevTextInputValue = prevTextInputValue + fittingText;
        prevTextInput.val(newPrevTextInputValue);

        // remove text that was appended
        thisTextInput.val(thisTextInputValue.replace(fittingText, ""));
    }

    
    /**
     * Append longest possible substring of next text input's value to this text input's value.
     * 
     * @param textOverheadWidth width of next text inputs's value that cannot fit inside this text input
     */
    function handleDeleteTextTooLong(textOverheadWidth: number): void {

        const nextTextInput = getNextTextInput(id);
        if (!nextTextInput)
            return;

        const nextTextInputValue = nextTextInput.prop("value");
        
        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue = thisTextInput.prop("value");

        // get text that would fit in this text input
        const fittingTextWidth = getTextWidth(nextTextInputValue, thisTextInput.css("fontSize"), thisTextInput.css("fontFamily"), thisTextInput.css("fontWeight")) - textOverheadWidth;
        const fittingText = getTextInputValueSubstringOfWidth(nextTextInput.prop("id"), fittingTextWidth)!;

        // append text that just fits
        const newTextInputValue = thisTextInputValue + fittingText;
        thisTextInput.val(newTextInputValue);

        // remove text that was appended
        nextTextInput.val(nextTextInputValue.replace(fittingText, ""));
    }


    async function handleTextLongerThanLine(event): Promise<void> {
        
        const lastTextInputInColumn = getLastTextInputOfColumn(id);

        const thisTextInput = $(inputRef.current!);
        const thisTextInputValue = thisTextInput.prop("value");

        const nextTextInput = getNextTextInput(id);
        const isNotLastTextInputInColumn = lastTextInputInColumn && lastTextInputInColumn.prop("id") !== id;
        const isNextTextInputBlank = !nextTextInput || isBlank(nextTextInput.prop("value"));
        const cursorIndex = getCursorIndex(id);
        
        // case: can shift text to next line
        if (isNotLastTextInputInColumn && isNextTextInputBlank && cursorIndex === thisTextInputValue.length && nextTextInput) {
            // case: dont shift text but continue in next input
            const fontSizeDiff = documentContext.subtractMSWordFontSizes(thisTextInput.css("fontSize"), nextTextInput.css("fontSize"));
            const numLinesDiff = documentContext.getNumLinesDeviation(id, fontSizeDiff);
            const wrapper = {
                columnIds: new Set<string>(),
                numTextInputsToRemove: 0
            }
            const canHandleFontSize = documentContext.canHandleFontSizeTooLarge(wrapper, numLinesDiff, nextTextInput.prop("id"), true, props.isSingleColumnLine);
            const stylesToOverride: SingleStyle[] = canHandleFontSize ? [] : [{attr: "fontSize", value: getBrowserFontSizeByMSWordFontSize(14)}];

            const hasTextWhiteSpace = thisTextInputValue.includes(" ");
            if (!hasTextWhiteSpace)
                focusNextTextInput(true, stylesToOverride);
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

        const isLastSingleColumnLine = checkIsLastSingleColumnLine();
        setIsLastSingleColumnLine(isLastSingleColumnLine);

        // update state
        setIsSingleColumnLineCandidate(isSingleColumnLineCandidate);

        // update input classes
        if (isSingleColumnLineCandidate) {
            setDontHideConnectIconClassName("dontHideConnectIcon");
            $(inputRef.current!).addClass("singleColumnLineCandidate");
            $(inputRef.current!).addClass("dontHideConnectIcon");
            $(inputRef.current!).removeClass("dontHideDisConnectIcon");

        } else if (isLastSingleColumnLine) {
            setDontHideConnectIconClassName("dontHideDisConnectIcon");
            $(inputRef.current!).removeClass("singleColumnLineCandidate");
            $(inputRef.current!).addClass("dontHideDisConnectIcon");
            $(inputRef.current!).removeClass("dontHideConnectIcon");

        } else if (!isLastSingleColumnLine) {
            setDontHideConnectIconClassName("");
            $(inputRef.current!).removeClass("singleColumnLineCandidate");
            $(inputRef.current!).removeClass("dontHideDisConnectIcon");
            $(inputRef.current!).removeClass("dontHideConnectIcon");
        }
    }


    function toggleSingleColumnLineStyle(event): void {

        // only offer connect button if max num single column lines not reached yet
        if (props.isSingleColumnLine || documentContext.numSingleColumnLines < MAX_NUM_SINGLE_COLUMN_LINES) {
            // hide connect / disconnect button
            $(".connectOrDisconnectButton").hide();
            
            pageContext.handleConnectDisconnectTextInput(id, props.isSingleColumnLine);
        }
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
     * @param stylesToOverride style props to override the selected style props with if ```copyStyles```is true
     * @return the next textinput or null if not found
     */
    function focusNextTextInput(copyStyles: boolean, stylesToOverride?: SingleStyle[]): JQuery | null {

        const nextTextInput = getNextTextInput(id);
        // case: end of document
        if (!nextTextInput)
            return null;

        const nextTextInputId = nextTextInput.prop("id");

        if (copyStyles) {
            // handle potential font size change
            const fontSizeDiff = documentContext.subtractMSWordFontSizes($(inputRef.current!).css("fontSize"), nextTextInput.css("fontSize"));
            documentContext.handleFontSizeChange(fontSizeDiff, nextTextInputId, true);

            // focus next text input
            documentContext.focusTextInput(nextTextInputId, false);
            documentContext.setSelectedTextInputStyle(getTextInputStyle(id), stylesToOverride);

        } else 
            documentContext.focusTextInput(nextTextInputId, true);

        return nextTextInput;
    }


    /**
     * @param event 
     * @param copyStyles if true, all styles of selected text input will be copied to prev text input
     * @returns the prev text input or null if not found
     */
    function focusPrevTextInput(event, copyStyles = false): JQuery | null {

        const prevTextInput = getPrevTextInput(id);
        if (!prevTextInput) 
            return null;

        documentContext.focusTextInput(prevTextInput.prop("id"), !copyStyles);

        return prevTextInput;
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