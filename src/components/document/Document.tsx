import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Document.css";
import Page from "./Page";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashBorder, getCSSValueAsNumber, getTabSpaces, getTextWidth, hidePopUp, insertString, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, logWarn, moveCursor } from "../../utils/Utils";
import { AppContext } from "../../App";
import StylePanel from "./StylePanel";
import { TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";


// TODO: how to cache document?
// TODO: fontsize looks smaller in frontend
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);

    const context = {
        handleTab: handleTab,
        handleTextLongerThanLine: handleTextLongerThanLine,
        getTextInputOverhead: getTextInputOverhead,
        getNextTextInput: getNextTextInput,
        getPrevTextInput: getPrevTextInput
    }


    useEffect(() => {
        // confirmPageUnload();

        hidePopUp(appContext.setPopupContent);

        $(".App").css("backgroundColor", "white");

        // TODO: confirm url change
    }, []);


    useEffect(() => {

    }, [appContext.selectedTextInputId])


    /**
     * Add {@link TAB_UNICODE_ESCAPED} to ```selectedTextInput```. Prevent any keydown event.
     */
    function handleTab(event): void {

        event.preventDefault();   

        // case: text too long
        if (isTextLongerThanInput(appContext.selectedTextInputId, getTextInputOverhead(), getTabSpaces())) {
            handleTextLongerThanLine(appContext.selectedTextInputId);
            return;
        }

        // add tab after cursor
        const selectedTextInput = $("#" + appContext.selectedTextInputId);
        const cursorIndex = selectedTextInput.prop("selectionStart");
        const newInputValue = insertString(selectedTextInput.prop("value"), TAB_UNICODE_ESCAPED, cursorIndex);
        selectedTextInput.prop("value", newInputValue);

        // move cursor to end of tab
        moveCursor(appContext.selectedTextInputId, cursorIndex + 2, cursorIndex + 2)
    }


    function handleTextLongerThanLine(textInputId: string): void {

        // TODO: reconsider black
        flashBorder($("#" + textInputId), "bottom", "red", "black", 200);
    }


    /**
     * @returns any space of selectedTextInput's width that cannot be occupied by the text input value (in px)
     */
    function getTextInputOverhead(): number {

        // add up padding and border
        const textInput = $("#" + appContext.selectedTextInputId);
        const paddingRight = getCSSValueAsNumber(textInput.css("paddingRight"), 2);
        const paddingLeft = getCSSValueAsNumber(textInput.css("paddingLeft"), 2);
        const borderRightWidth = getCSSValueAsNumber(textInput.css("borderRightWidth"), 2);
        const borderLefttWidth = getCSSValueAsNumber(textInput.css("borderLeftWidth"), 2);

        return paddingRight + paddingLeft + borderRightWidth + borderLefttWidth;
    }

    
    /**
     * @param textInputId id of the current text input
     * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
     */
    function getNextTextInput(textInputId: string): JQuery | null {

        // case: blank text input id
        if (isBlank(textInputId))
            return null;

        const textInput = $("#" + textInputId);

        // case: falsy text input
        if (!textInput.length) {
            logWarn("hasTextIinputNextLine() failed. 'textInput' not present");
            return null;
        }

        const allTextInputs = $(".TextInput");
        const index = allTextInputs.index(textInput);

        // case: has no next text input
        if (allTextInputs.length - 1 === index)
            return null;

        return $(allTextInputs.get(index + 1)!);
    }


        /**
     * @param textInputId id of the current text input
     * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
     */
    function getPrevTextInput(textInputId: string): JQuery | null {

            // case: blank text input id
            if (isBlank(textInputId))
                return null;
    
            const textInput = $("#" + textInputId);
    
            // case: falsy text input
            if (!textInput.length) {
                logWarn("hasTextIinputNextLine() failed. 'textInput' not present");
                return null;
            }
    
            const allTextInputs = $(".TextInput");
            const index = allTextInputs.index(textInput);
    
            // case: has no next text input
            if (index === 0)
                return null;
    
            return $(allTextInputs.get(index - 1)!);
        }


    return (
        <div id={id} className={className}>
            {/* <ControlBar /> */}

            <DocumentContext.Provider value={context}>
                <StylePanel />

                <div className="pageContainer">
                    <div className="flexCenter">
                        <Page pageIndex={0}/>
                    </div>
                    <div className="flexCenter">
                        <Page pageIndex={1}/>
                    </div>
                </div>
            </DocumentContext.Provider>
        </div>
    )
}


export const DocumentContext = createContext({
    handleTab: (event) => {},
    handleTextLongerThanLine: (iputId: string) => {},
    getTextInputOverhead: (): number => {return 0},
    getNextTextInput: (inputId: string): JQuery | null => {return null},
    getPrevTextInput: (inputId: string): JQuery | null => {return null}
})