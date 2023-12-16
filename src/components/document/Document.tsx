import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Document.css";
import Page from "./Page";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashBorder, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, getTabSpaces, getTextWidth, hidePopUp, insertString, isBlank, isKeyAlphaNumeric, isTextLongerThanInput, log, logWarn, moveCursor, stringToNumber } from "../../utils/Utils";
import { AppContext } from "../../App";
import StylePanel from "./StylePanel";
import { TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";


// TODO: how to cache document?
// TODO: fontsize looks smaller in frontend
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);
    
    const [columnFontSize, setColumnFontSize] = useState(appContext.selectedTextInputStyle.fontSize + "px");
    const [renderColumn, setRenderColumn] = useState(false);

    // TODO: make this generic sothat adding headings is easier, ColumnTypeConfig?
    const [columnHeading1FontSize, setColumnHeading1FontSize] = useState(appContext.selectedTextInputStyle.fontSize + "px");
    const [columnHeading2FontSize, setColumnHeading2FontSize] = useState(appContext.selectedTextInputStyle.fontSize + "px");
    const [columnHeading3FontSize, setColumnHeading3FontSize] = useState(appContext.selectedTextInputStyle.fontSize + "px");

    const [isSelectedColumnEmpty, setIsSelectedColumnEmpty] = useState(true);

    const context = {
        handleTab,
        handleTextLongerThanLine,
        getTextInputOverhead,
        getNextTextInput,
        getPrevTextInput,
        getSelectedColumnId,
        getColumnIdByTextInputId,
        columnFontSize,
        setColumnFontSize,
        renderColumn,
        setRenderColumn,
        columnHeading1FontSize,
        setColumnHeading1FontSize,
        columnHeading2FontSize,
        setColumnHeading2FontSize, 
        columnHeading3FontSize,
        setColumnHeading3FontSize,
        getHeadingStateByTextInputId,
        isSelectedColumnEmpty,
        setIsSelectedColumnEmpty
    }


    useEffect(() => {
        // confirmPageUnload();

        hidePopUp(appContext.setPopupContent);

        $(".App").css("backgroundColor", "white");

        // TODO: confirm url change
    }, []);


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


    function getSelectedColumnId(): string {

        return getColumnIdByTextInputId(appContext.selectedTextInputId);
    }


    function getColumnIdByTextInputId(textInputId: string): string {

        // case: no text input selected yet
        if (isBlank(textInputId)) 
            return "";

        // find first three text inputs
        const pageIndex = getPartFromDocumentId(textInputId, 1);
        const columnIndex = getPartFromDocumentId(textInputId, 2);

        return getDocumentId("Column", stringToNumber(pageIndex), "", stringToNumber(columnIndex));
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
                if (!isBlank(columnHeading1FontSize))
                    return [columnHeading1FontSize, setColumnHeading1FontSize];
                break;

            case 1: 
                if (!isBlank(columnHeading2FontSize))
                    return [columnHeading2FontSize, setColumnHeading2FontSize];
                break;

            case 2: 
                if (!isBlank(columnHeading3FontSize))
                    return [columnHeading3FontSize, setColumnHeading3FontSize];
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

        const columnId = getColumnIdByTextInputId(textInputId);
        const columnTextInputs = $("#" + columnId + " .TextInput")

        return Array.from(columnTextInputs).indexOf(textInput.get(0)!);
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
    getPrevTextInput: (inputId: string): JQuery | null => {return null},
    getSelectedColumnId: (): string => {return ""},
    getColumnIdByTextInputId: (textInputId: string): string => {return ""},

    columnFontSize: "-1px",
    setColumnFontSize: (columnFontSize: string) => {},
    isSelectedColumnEmpty: true,
    setIsSelectedColumnEmpty: (isEmpty: boolean) => {},

    renderColumn: false,
    setRenderColumn: (renderColumn: boolean) => {},

    columnHeading1FontSize: "",
    setColumnHeading1FontSize: (headingFontSize: string) => {},
    columnHeading2FontSize: "",
    setColumnHeading2FontSize: (headingFontSize: string) => {},
    columnHeading3FontSize: "",
    setColumnHeading3FontSize: (headingFontSize: string) => {},

    getHeadingStateByTextInputId: (textInputId: string): [string, (fontSize: string) => void] | null => {return null}
})