import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Document.css";
import Page from "./Page";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, flashBorder, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, getTabSpaces, getTextWidth, hidePopup, insertString, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, logWarn, moveCursor, stringToNumber } from "../../utils/Utils";
import { AppContext } from "../../App";
import StylePanel from "./StylePanel";
import { TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";
import ControlPanel from "../ControlPanel";
import Button from "../helpers/Button";
import { buildDocument, downloadDocument } from "../../builder/Builder";


// TODO: how to cache document?
// TODO: fontsize looks smaller in frontend
// TODO: update to bootstrap 5
// TODO: landscape mode interferes with controlpanel on small width screens 
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);

    const [isSelectedColumnEmpty, setIsSelectedColumnEmpty] = useState(true);
    const [textInputBorderFlashing, setTextInputBorderFlashing] = useState(false);

    const context = {
        handleTab,
        handleTextLongerThanLine,
        getTextInputOverhead,
        getNextTextInput,
        getPrevTextInput,
        getHeadingStateByTextInputId,
        isSelectedColumnEmpty,
        setIsSelectedColumnEmpty,
        checkIsSelectedColumnEmpty,
        checkIsColumnEmptyById
    }


    useEffect(() => {
        if (process.env.REACT_APP_ENV !== "dev")
            confirmPageUnload();

        hidePopup(appContext.setPopupContent);

        $(".App").css("backgroundColor", "white");
    }, []);


    /**
     * Overloading ```checkIsColumnEmtpyById```.
     */
    function checkIsSelectedColumnEmpty(): boolean {

        const selectedColumnId = appContext.getSelectedColumnId();

        return checkIsColumnEmptyById(selectedColumnId);
    }


    /**
     * @returns true if no chars are found in any text input of selected column, else false (Tabs and spaces don't count as chars here)
     */
    function checkIsColumnEmptyById(columnId: string): boolean {

        if (isBlank(columnId))
            return true;

        const columnTextInputs = $("#" + columnId + " .TextInput");

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


    /**
     * Add {@link TAB_UNICODE_ESCAPED} to ```selectedTextInput```. Prevent any keydown event.
     */
    function handleTab(event): void {

        event.preventDefault();   

        // case: text too long
        if (isTextLongerThanInput(appContext.selectedTextInputId, getTextInputOverhead(), getTabSpaces())) {
            handleTextLongerThanLine(appContext.selectedTextInputId, "rgb(0, 255, 255)");
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


    /**
     * Flash border bottom color of text input and go back to border color from before. Use ```textInputborderFlashing``` state to
     * prevent flashing after event action.
     * 
     * @param textInputId id of text input where text is too long
     */
    async function handleTextLongerThanLine(textInputId: string, initialBorderColor = "rgb(128, 128, 128)"): Promise<void> {

        // case: border still flashing
        if (textInputBorderFlashing)
            return;

        setTextInputBorderFlashing(true);
        await flashBorder($("#" + textInputId), "bottom", "red", initialBorderColor, 200);
        setTextInputBorderFlashing(false);
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


    function getHeadingStateByTextInputId(textInputId: string): [string, (fontSize: string) => void] | null {

        const textInputIndex = getTextInputIndex(textInputId);

        // case: textInputId falsy
        if (textInputIndex === -1) {
            logWarn("'getHeadingStateByTextInputId' failed.");
            return null;
        }

        switch (textInputIndex) {
            case 0: 
                if (appContext.columnHeading1FontSize)
                    return [appContext.columnHeading1FontSize, appContext.setColumnHeading1FontSize];
                break;

            case 1: 
                if (appContext.columnHeading2FontSize)
                    return [appContext.columnHeading2FontSize, appContext.setColumnHeading2FontSize];
                break;

            case 2: 
                if (appContext.columnHeading3FontSize)
                    return [appContext.columnHeading3FontSize, appContext.setColumnHeading3FontSize];
                break;
        }

        return null;
    }


    function getTextInputIndex(textInputId: string): number {

        if (isBlank(textInputId)) {
            logWarn("'getTextInputIndex' failed. 'textInputId' cannot be blank");
            return -1;
        }

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            logWarn("'getTextInputIndex' failed. 'textInput' length is 0");
            return -1;
        }

        const columnId = appContext.getColumnIdByTextInputId(textInputId);
        const columnTextInputs = $("#" + columnId + " .TextInput");

        return Array.from(columnTextInputs).indexOf(textInput.get(0)!);
    }

    
    async function buildAndDownloadDocument(): Promise<void> {

        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns);

        if (buildResponse.status === 200)
            downloadDocument(false, appContext.documentFileName);
    }


    return (
        <div id={id} className={className}>
            {/* mobile controlbar */}
            {/* <ControlPanel /> */}

            <DocumentContext.Provider value={context}>
                <StylePanel />

                <div className="subContainer flexRight align-items-start">
                    <div className="pageContainer">
                        <div className="flexCenter">
                            <Page pageIndex={0} />
                        </div>

                        <div className="flexCenter">
                            <Page pageIndex={1}/>
                        </div>
                    </div>

                    <div className="controlPanelContainer flexRight mr-2">
                        <ControlPanel /> 
                    </div>
                </div>

            </DocumentContext.Provider>
        </div>
    )
}


export const DocumentContext = createContext({
    handleTab: (event) => {},
    handleTextLongerThanLine: (iputId: string, initialBorderColor?: string) => {},
    getTextInputOverhead: (): number => {return 0},
    getNextTextInput: (inputId: string): JQuery | null => {return null},
    getPrevTextInput: (inputId: string): JQuery | null => {return null},

    columnFontSize: "-1px",
    setColumnFontSize: (columnFontSize: string) => {},
    isSelectedColumnEmpty: true,
    setIsSelectedColumnEmpty: (isEmpty: boolean) => {},
    checkIsSelectedColumnEmpty: (): boolean => {return true},
    checkIsColumnEmptyById: (columnId: string): boolean => {return true},

    getHeadingStateByTextInputId: (textInputId: string): [string, (fontSize: string) => void] | null => {return null}
})