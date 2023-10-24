import React, { useContext, useEffect } from "react";
import "../assets/styles/TextInput.css";
import $ from "jquery";
import { PageColumnLineContext } from "./PageColumnLine";
import { DocumentContext } from "./Document";
import { logError, getCSSValueAsNumber, getDocumentId, getWidthRelativeToWindow, isBlank, isNumberFalsy, isTextLongerThanInput, moveCursor, log } from "../utils/Utils";
import { PageColumnContext } from "./PageColumn";
import { PageContext } from "./Page";
import { getTextInputWidth } from "../utils/GlobalVariables";


export default function TextInput(props: {
    /** index of <Page /> insede <Document /> */
    pageIndex: number;
    /** index of <PageColumn /> insied a <Page /> */
    pageColumnIndex: number;
    /** key of <PageColumnLine /> */
    pageColumnLineKey: string;
    /** key of <TextInput /> */
    textInputKey: string;
    defaultValue?: string;
    focusOnRender?: boolean;
    className?: string;
    style?;
}) {

    const thisId = getDocumentId("TextInput", props.pageIndex, props.pageColumnIndex, props.pageColumnLineKey, props.textInputKey);
    const thisClassName = props.className ? "TextInput " + props.className : "TextInput";

    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);
    const pageColumnContext = useContext(PageColumnContext);
    const pageColumnLineContext = useContext(PageColumnLineContext);


    useEffect(() => {
        if (props.focusOnRender) {
            documentContext.selectTextInput(thisId);
            moveCursor(thisId);
        }
    }, []);


    function handleKeyDown(event): void {

        if (event.key === "Tab")
            handleTab(event);

        else if (event.key === "Backspace")
            handleBackspace(event);

        else if (event.key === "Enter")
            handleEnter(event);

        else if (event.key === "ArrowRight")
            handleArrowRight(event);

        else if (event.key === "ArrowLeft")
            handleArrowLeft(event);

        else if (event.key === "ArrowDown")
            handleArrowDown(event);

        else if (event.key === "ArrowUp")
            handleArrowUp(event);
        
        else
            handleNewText(event);
    }


    /**
     * Handle tab event. Shift text in front of cursor by one tab. Do nothing if tab is used in last text input of line.<p>
     * 
     * Assuming that event.target === currentTextInput
     * @param event
     */
    function handleTab(event) {

        event.preventDefault();

        if (isMaxNumTabsReached()) {
            if (!isLastTextInputInLine()) {
                if (isLastTextInputInLineBlank()) {
                    pageColumnLineContext.removeTextInput(pageContext.maxNumTextInputsPerLine - 1);
                    addTabMoveContent(documentContext.currentTextInputId);

                } else {
                    const lastTextInput = pageColumnLineContext.getTextInputElementByIndex(pageContext.maxNumTextInputsPerLine - 1);
                    if (!lastTextInput) {
                        logError("Failed to add tab.'lastTextInput' is falsy");
                        return;
                    }   

                    addTabMoveContent(documentContext.currentTextInputId);

                    // TODO: might be new column or page
                    // pageColumnContext.addPageColumnLine(lastTextInput.value, false);
                }
            }
        } else {
            addTabMoveContent(documentContext.currentTextInputId);
        }
    }


    function handleBackspace(event) {
        documentContext.removePage();
        // pageColumnLineContext.removeTextInput();
    }


    function handleNewText(event): void {
        
        const currentTextInput = getCurrentTextInput();
        if (!currentTextInput) {
            console.error("Failed to handle new text. Current text input is falsy");
            return;
        }

        // if max num reached
        if (isTextLongerThanInput(currentTextInput.prop("id"))) {
            mergeNextTextInput();

            // if is last text input in line
            // append new line
            // move any content from last text input to first text input of new line
            // else
            // if last text input of line is empty
            // remove last text input of line
            // else
            // append new line
            // move all content from last text input into first text input of new line
            // increase input width
        }
    }


    function handleEnter(event) {
        pageColumnContext.addPageColumnLine("", true);
    }


    function handleClick(event) {
    }

    // TODO: cursor does not move to first position on "select"
    function handleArrowRight(event): void {

        const cursorPosition = getCursorPosition(thisId);
        if (isNumberFalsy(cursorPosition)) {
            logError("Failed to handle arrowRight event. 'cursorPosition' is falsy");
            return;
        }

        const currentTextInput = getCurrentTextInput();
        if (!currentTextInput) {
            logError("Failed to handle arrowRight event. 'currentTextInput' or is falsy");
            return;
        }

        const currentTextInputValue = currentTextInput.prop("value");

        // TODO: what if next line / column / page? make helper "get next text input"
        if (currentTextInputValue.length === cursorPosition) {
            event.preventDefault();

            const nextTextInput = pageColumnLineContext.getTextInputByIndex(pageColumnLineContext.getCurrentTextInputIndex() + 1)
            if (!nextTextInput)
                return;

            const nextTextInputId = nextTextInput.prop("id");

            documentContext.selectTextInput(nextTextInputId);
            moveCursor(nextTextInputId);
        }
    }
    
    function handleArrowLeft(event) {

        const cursorPosition = getCursorPosition(thisId);
        if (isNumberFalsy(cursorPosition)) {
            logError("Failed to handle arrowLeft event. 'cursorPosition' is falsy");
            return;
        }

        if (cursorPosition === 0) {
            event.preventDefault();
            
            const prevTextInput = pageColumnLineContext.getTextInputByIndex(pageColumnLineContext.getCurrentTextInputIndex() - 1)
            if (!prevTextInput)
                return;

            const prevTextInputId = prevTextInput.prop("id");
            const prevTextInputValue = prevTextInput.prop("value");

            documentContext.selectTextInput(prevTextInput.prop("id"));
            moveCursor(prevTextInputId, prevTextInputValue.length, prevTextInputValue.length);
        }
    }

    
    // TODO
    function handleArrowUp(event) {

        const cursorPosition = getCursorPosition(thisId);
        if (isNumberFalsy(cursorPosition)) {
            logError("Failed to handle arrowRight event. 'cursorPosition' is falsy");
            return;
        }

        const currentTextInput = getCurrentTextInput();
        if (!currentTextInput) {
            logError("Failed to handle arrowRight event. 'currentTextInput' or is falsy");
            return;
        }

        const currentTextInputValue = currentTextInput.prop("value");

        // find text input in line above with same index
        // move to same cursor position
        // focus
    }


    // TODO
    function handleArrowDown(event) {

        const cursorPosition = getCursorPosition(thisId);
        if (isNumberFalsy(cursorPosition)) {
            logError("Failed to handle arrowRight event. 'cursorPosition' is falsy");
            return;
        }

        const currentTextInput = getCurrentTextInput();
        if (!currentTextInput) {
            logError("Failed to handle arrowRight event. 'currentTextInput' or is falsy");
            return;
        }

        const currentTextInputValue = currentTextInput.prop("value");

        // find text input in line below with same index
        // move to same cursor position
        // focus
    }


    function addTabMoveContent2(): void {

        if (isLastTextInputInLineBlank()) {
            pageColumnLineContext.removeTextInput(pageContext.maxNumTextInputsPerLine - 1);
            addTabMoveContent(documentContext.currentTextInputId);

        } else {
            // get content and style from last input
            // const contentLastTextInput = pageColumnLineContext.getTextInputElementByIndex(pageContext.maxNumTextInputsPerLine - 1)?.value;

            // remove last input
            // pageColumnLineContext.removeTextInput(pageContext.maxNumTextInputsPerLine - 1);

            // move content from last text input into first text input of new line
            addTabMoveContent(documentContext.currentTextInputId);

            // append new line
            // pageColumnContext.addPageColumnLine();

            // set content and style of first input to deleted one
            
        }
    }


    // rename this
    function addTabMoveContent(textInputId: string) {

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            console.error("Failed to add tab and move content. Falsy id: " + textInput);
            return;
        }

        const cursorPosition = getCursorPosition(textInputId);
        if (isNumberFalsy(cursorPosition)) {
            console.error("Failed to add tab and move content. Falsy cursor position");
            return;
        }

        const content = textInput.prop("value");

        // add text input with contentAfterCursor
        const contentAfterCursor = content.substring(cursorPosition!);
        pageColumnLineContext.addTextInput(true, pageColumnLineContext.getCurrentTextInputIndex() + 1, contentAfterCursor);

        // remove contentAfterCursor from prev text input
        const contentBeforeCursor = content.substring(0, cursorPosition!);
        textInput.prop("value", contentBeforeCursor);
    }


    /**
     * Get value of given text input and return index the first char after cursor if exists.
     *
     * E.g. "HelloWorld" with cursor after 'o' of "Hello" returns 5.
     *
     * @param textInputId
     * @returns char index of value of text input or null
     */
    function getCursorPosition(textInputId: string): number | null {

        const textInput = $("#" + textInputId);

        if (!textInput.length) {
            console.error("Failed to get text input with id: " + textInputId);
            return null;
        }

        const cursorPosition = (textInput.get(0) as HTMLInputElement).selectionStart;

        if (isNumberFalsy(cursorPosition)) {
            console.error("Failed to get cursor position for input with id: " + textInputId);
            return null;
        }

        return cursorPosition;
    }


    function moveLineOverhead() {
        // append new line
        // move content of last text input to new line first text input
    }


    function removeLastTextInputInLine() {
        // if last text input of line is empty
        // remove last text input of line
    }


    function mergeNextTextInput() {

        const firstTextInput = $("#" + thisId);
        if (!firstTextInput) {
            console.error("Failed to handle new text. Current text input is falsy");
            return;
        }   
        
        const currentWidth = getCSSValueAsNumber(getWidthRelativeToWindow(firstTextInput.css("width"), 2), 1);
        firstTextInput.css("width", currentWidth + getTextInputWidth() + "%");

        // TODO: text longer than window width
    }


    /**
     * @returns true if number of text inputs in a {@link PageColumnLine} is maxed out
     */
    function isMaxNumTabsReached(): boolean {

        return pageColumnLineContext.numTextInputsInLine === pageContext.maxNumTextInputsPerLine;
    }


    /**
     * @returns true if current text input is the last in current {@link PageColumnLine}
     */
    function isLastTextInputInLine(): boolean {

        return pageColumnLineContext.getCurrentTextInputIndex() === pageContext.maxNumTextInputsPerLine - 1;
    }


    /**
     * @returns true if value of last text input in {@link PageColumnLine} is empty or blank, false if not
     *          and if last text input in line could not be found for some reason
     * @see {@link isBlank}
     */
    function isLastTextInputInLineBlank(): boolean {

        const indexLastTextInputInLine = pageColumnLineContext.numTextInputsInLine - 1;

        const lastTextInputInLine = pageColumnLineContext.getTextInputElementByIndex(indexLastTextInputInLine);

        if (!lastTextInputInLine) {
            console.error("Failed get last text input in line.");
            return false;
        }

        return isBlank(lastTextInputInLine.value);
    }


    function getCurrentTextInputElement(): HTMLInputElement | null {

        return pageColumnLineContext.getTextInputElementByIndex(pageColumnLineContext.getCurrentTextInputIndex());
    }


    function getCurrentTextInput(): JQuery | null {

        const currentTextInput = $("#" + thisId);

        return currentTextInput.length === 0 ? null : currentTextInput;
    }


    return (
        <input id={thisId}
            className={thisClassName}
            type="text"
            style={props.style}
            onKeyDown={handleKeyDown}
            onClickCapture={() => documentContext.selectTextInput(thisId)}
            onClick={handleClick}
            defaultValue={props.defaultValue} />
    );
}