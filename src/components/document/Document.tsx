import React, { useContext, useEffect, useState, createContext } from "react";
import "../../assets/styles/Document.css";
import Page from "./Page";
import { confirmPageUnload, flashClass, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, getTabSpaces, hidePopup, insertString, isBlank, isTextLongerThanInput, log, logError, logWarn, moveCursor, stringToNumber } from "../../utils/Utils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";
import { API_ENV, FILLER_LINE_FONT_SIZE, MAX_FONT_SIZE_SUM_LANDSCAPE, MAX_FONT_SIZE_SUM_PORTRAIT, NUM_HEADINGS_PER_COLUMN, SELECTED_COLOR, TAB_UNICODE_ESCAPED } from "../../utils/GlobalVariables";
import ControlPanel from "../ControlPanel";
import { buildDocument, downloadDocument } from "../../builder/Builder";
import TextInput from "./TextInput";
import { Orientation } from "../../enums/Orientation";


// TODO: how to cache document?
// TODO: add some kind of "back" button
// TODO: fontsize looks smaller in frontend
// TODO: update to bootstrap 5

// TODO: landscape mode interferes with controlpanel on small width screens 
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);

    const [isSelectedColumnEmpty, setIsSelectedColumnEmpty] = useState(true);
    const [textInputBorderFlashing, setTextInputBorderFlashing] = useState(false);

    /** <Paragraph /> component listens to changes of these states and attempts to append or remove a <TextInput /> at the end */
    const [paragraphIdAppendTextInput, setParagraphIdAppendTextInput] = useState<[string, number]>(); // [paragraphId, numTextInputsToAppend]
    const [paragraphIdRemoveTextInput, setParagraphIdRemoveTextInput] = useState<[string, number]>(); // [paragraphId, numTextInputsToRemove]

    const context = {
        handleTab,
        handleTextLongerThanLine,
        getTextInputOverhead,
        getNextTextInput,
        getPrevTextInput,
        getColumnTextInputs,
        
        isFontSizeTooLarge,
        handleFontSizeTooLarge,
        getNumLinesToAdd,
        appendTextInput,
        removeTextInput,
        paragraphIdAppendTextInput,
        setParagraphIdAppendTextInput,
        paragraphIdRemoveTextInput,
        setParagraphIdRemoveTextInput,
        getParagraphIdByColumnId,

        isSelectedColumnEmpty,
        setIsSelectedColumnEmpty,
        checkIsSelectedColumnEmpty,
        checkIsColumnEmptyById,
        getColumnFontSizesSum
    };


    useEffect(() => {
        if (API_ENV !== "dev")
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
            handleTextLongerThanLine(appContext.selectedTextInputId, SELECTED_COLOR);
            return;
        }

        // add tab after cursor
        const selectedTextInput = $("#" + appContext.selectedTextInputId);
        const cursorIndex = selectedTextInput.prop("selectionStart");
        const newInputValue = insertString(selectedTextInput.prop("value"), TAB_UNICODE_ESCAPED, cursorIndex);
        selectedTextInput.prop("value", newInputValue);

        // move cursor to end of tab
        moveCursor(appContext.selectedTextInputId, cursorIndex + 2, cursorIndex + 2);
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
        await flashClass($("#" + textInputId), "textInputFlash", "textInputFocus", 200);
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


    function getTextInputIndex(textInputId: string): number {

        const columnTextInputs = getColumnTextInputs(textInputId);

        if (!columnTextInputs || !columnTextInputs.length)
            return -1;

        const textInput = $("#" + textInputId);
        if (!textInput || !textInput.length)
            return -1;

        return Array.from(columnTextInputs).indexOf(textInput.get(0)!);
    }


    /**
     * @param textInputId in order to identify the column, default is selected column
     * @returns jquery of all ```<TextInput />``` components inside given column or ```null``` if column was not found
     */
    function getColumnTextInputs(textInputId = appContext.selectedTextInputId): JQuery | null {

        if (isBlank(textInputId))
            return null;
        

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            logWarn("'getColumnTextInputs' failed. 'textInput' length is 0");
            return null;
        }

        const columnId = appContext.getColumnIdByTextInputId(textInputId);
        return $("#" + columnId + " .TextInput");
    }


    /**
     * @param textInputId in order to identify the paragraph, default is selected text input
     * @returns jquery of all ```<TextInput />``` components inside given paragraph or ```null``` if paragraph was not found
     */
    function getColumnParagraphs(textInputId = appContext.selectedTextInputId): JQuery | null {

        if (isBlank(textInputId))
            return null;

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            logWarn("'getColumnParagraphs()' failed. 'textInput' length is 0");
            return null;
        }

        const columnId = appContext.getColumnIdByTextInputId(textInputId);
        return $("#" + columnId + " .Paragraph");
    }


    async function buildAndDownloadDocument(): Promise<void> {

        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns);

        if (buildResponse.status === 200)
            downloadDocument(false, appContext.documentFileName);
    }


    /**
     * @param textInputId in order to identify the column, default is selected column
     * @returns sum of font sizes of all text inputs in column (in px) or -1 if column was not found
     */
    function getColumnFontSizesSum(textInputId = appContext.selectedTextInputId): number {

        const columnTextInputs = getColumnTextInputs(textInputId);

        if (!columnTextInputs || !columnTextInputs.length)
            return -1;

        let sum = 0;
        columnTextInputs.each((i, textInputElement) => {
            const textInput = $("#" + textInputElement.id);
            const fontSize = textInput.css("fontSize");

            if (fontSize)
                sum += getCSSValueAsNumber(fontSize, 2);
        });

        return sum;
    }


    /**
     * Append new ```<TextInput />``` to ```textInputs``` state (passed as param).
     *
     * @param textInputs array of ```<TextInput />``` (state) to add new text input to
     * @param setTextInputs state setter to use
     * @param pageIndex index of page to append the text input to
     * @param columnIndex index of column to append the text input to
     * @param paragraphIndex index of paragraph to append the text input to
     * @param numTextInputs number of text inputs to append
     * @returns array with the appended ```<TextInput />```s
     */
    function appendTextInput(textInputs: React.JSX.Element[],
                            setTextInputs: (textInputs: React.JSX.Element[]) => void,
                            pageIndex: number,
                            columnIndex: number,
                            paragraphIndex: number,
                            numTextInputs = 1): React.JSX.Element[] {

        let newTextInputs: React.JSX.Element[] = [];

        for (let i = 0; i < numTextInputs; i++) {
            newTextInputs.push(<TextInput key={crypto.randomUUID()}
                                            pageIndex={pageIndex}
                                            columnIndex={columnIndex}
                                            paragraphIndex={paragraphIndex}
                                            textInputIndex={textInputs.length + i}
                                            // only works because there's one text input per paragraph
                                            isHeading={paragraphIndex < NUM_HEADINGS_PER_COLUMN} 
                                            />);
        }

        setTextInputs([...textInputs, ...newTextInputs]);

        return newTextInputs;
    }


    /**
     * Remove ```<TextInput />``` from given ```textInputs``` array at given ```index```.
     *
     * @param textInputs array of ```<TextInput />``` (state) to add new text input to
     * @param setTextInputs state setter to use
     * @param index of text input position in given ```textInputs``` array to remove the text input at
     * @param deleteCount  number of elements to remove
     * @returns array with the removed ```<TextInput />```s
     */
    function removeTextInput(textInputs: React.JSX.Element[],
                            setTextInputs: (textInputs: React.JSX.Element[]) => void,
                            index: number = textInputs.length - 1,
                            deleteCount = 1): React.JSX.Element[] {

        const removedTextInput = textInputs.splice(index, deleteCount);

        setTextInputs([...textInputs]);

        return removedTextInput;
    }


    /**
     * TODO
     * @returns false if fontSize shouldn't be changed because no line can be added or removed, else false
     */
    function handleFontSizeTooLarge(flash = true, deleteCount = 1, textInputId = appContext.selectedTextInputId): boolean {

        const columnTextInputs = getColumnTextInputs(textInputId);
        if (!columnTextInputs) {
            logError("'handleFontSizeTooLarge()' failed. 'columnTextInputs' is falsy.");
            return false;
        }

        // get last textinputs
        let areTextInputsBlank = true;
        let areTextInputsToDeleteFocused = false;
        const columnTextInputsToDelete = Array.from(columnTextInputs).slice(columnTextInputs.length - deleteCount);

        // check for non blank textInputs
        columnTextInputsToDelete.forEach(textInput => {
            // case: is not blank
            if (areTextInputsBlank && !isBlank((textInput as HTMLInputElement).value))
                areTextInputsBlank = false;

            // case: is focused
            if (!areTextInputsToDeleteFocused && textInput.id === appContext.selectedTextInputId)
                areTextInputsToDeleteFocused = true;
        });

        // case: last input blank
        if (areTextInputsBlank && !areTextInputsToDeleteFocused) {
            const paragraphIndex = getParagraphIndexOfLastTextInputInColumn(textInputId);
            const paragraphId = getParagraphIdByColumnId(textInputId, paragraphIndex);
            setParagraphIdRemoveTextInput([paragraphId, deleteCount]);

        // case: last input not blank
        } else {
            if (flash)
                flashClass($("#" + appContext.selectedTextInputId), "textInputFlash", "textInputFocus");

            return false;
        }

        // TODO: add some subtle popup saying something like "fontsize too large. clear the last line in column"
        return true;
    }


    /**
     * TODO:
     * @param selectedFontSize font size that has been selected for the text input
     * @param oldFontSize font size the text input had before
     * @returns true if applying the ```selectedFontSize``` would exceed the value of MAX_ALLOWED_FONT_SIZE_SUM
     */
    function isFontSizeTooLarge(selectedFontSize: number | string, oldFontSize?: number | string): [boolean, number] {

        if (!oldFontSize)
            // use selected text input
            oldFontSize = $("#" + appContext.selectedTextInputId).css("fontSize");

        oldFontSize = getCSSValueAsNumber(oldFontSize, 2);
        selectedFontSize = getCSSValueAsNumber(selectedFontSize, 2);

        // get difference in case of font size apply
        const diff = selectedFontSize - oldFontSize;
        const numLinesToRemove = Math.floor(diff / FILLER_LINE_FONT_SIZE);

        const columnFontSizesSum = getColumnFontSizesSum();
        if (columnFontSizesSum === -1)
            return [false, numLinesToRemove];

        const maxSum = appContext.orientation === Orientation.PORTRAIT ? MAX_FONT_SIZE_SUM_PORTRAIT : MAX_FONT_SIZE_SUM_LANDSCAPE;

        // case: adding difference would exceed max value
        if (columnFontSizesSum + diff > maxSum)
            return [true, numLinesToRemove];

        return [false, numLinesToRemove];
    }


    /**
     * @param textInputId of any textInput inside the column
     * @returns number of lines with fontSize {@link FILLER_LINE_FONT_SIZE} that could fit in selected ```<Column />```. Return -1 if
     *          no column is selected yet.
     */
    function getNumLinesToAdd(textInputId = appContext.selectedTextInputId): number {

        const columnFontSizesSum = getColumnFontSizesSum(textInputId);
        if (columnFontSizesSum === -1)
            return -1;

        const maxSum = appContext.orientation === Orientation.PORTRAIT ? MAX_FONT_SIZE_SUM_PORTRAIT : MAX_FONT_SIZE_SUM_LANDSCAPE;
        
        const diff = maxSum - columnFontSizesSum;
        
        return Math.floor(diff / FILLER_LINE_FONT_SIZE);
    }


    /**
     * @param textInputId of any textInput inside the column
     * @param paragraphIndex index of the paragraph inside the column
     * @returns id of the paragraph found with given params. Contains -1 as paragraphIndex if paragraph wasn't found
     */
    function getParagraphIdByColumnId(textInputId = appContext.selectedTextInputId, paragraphIndex?: number): string {

        // set default paragraph index to last paragraph in column
        if (!paragraphIndex) {
            const columnParagraphs = getColumnParagraphs(textInputId);

            if (!columnParagraphs) {
                logWarn("'getParagraphIdByColumnId()' failed. 'columnParagraphs' is falsy.");
                paragraphIndex = -1;
                
            } else 
                paragraphIndex = columnParagraphs.length - 1;
        }

        const pageIndex = getPartFromDocumentId(textInputId, 1);
        const columnIndex = getPartFromDocumentId(textInputId, 2);

        const paragraphId = getDocumentId("Paragraph", stringToNumber(pageIndex), "", stringToNumber(columnIndex), paragraphIndex);

        return paragraphId;
    }


    function getParagraphIndexOfLastTextInputInColumn(textInputId = appContext.selectedTextInputId): number {

        const columnParagraphs = getColumnParagraphs(textInputId);
        if (!columnParagraphs) {
            logWarn("'getParagraphIndexOfLastTextInputInColumn()' failed. 'columnParagraphs' is falsy.");
            return -1;
        }

        // iterate in reverse
        for (let i = columnParagraphs.length - 1; i >= 0; i--) {
            const paragraphElement = columnParagraphs.get(i);
            if (!paragraphElement)
                continue;

            const paragraph = $("#" + paragraphElement.id);
            const childTextInput = paragraph.find(".TextInput");

            if (childTextInput.length)
                return stringToNumber(getPartFromDocumentId(paragraphElement.id, 3));
        }

        return -1;
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
                            <Page pageIndex={1} />
                        </div>
                    </div>

                    <div className="controlPanelContainer flexRight mr-2">
                        <ControlPanel />
                    </div>
                </div>

            </DocumentContext.Provider>
        </div>
    );
}


export const DocumentContext = createContext();