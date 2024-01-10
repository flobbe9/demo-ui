import React, { useContext, useEffect, useState, createContext, useRef } from "react";
import "../../assets/styles/Document.css";
import { confirmPageUnload, flashClass, getCSSValueAsNumber, getDocumentId, getFontSizeDiffInWord, getPartFromDocumentId, getRandomString, getTabSpaces, insertString, isBlank, isTextLongerThanInput, log, logError, logWarn, moveCursor, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";
import { API_ENV, DEFAULT_FONT_SIZE, SINGLE_COLUMN_LINE_CLASS_NAME, MAX_FONT_SIZE_SUM_LANDSCAPE, MAX_FONT_SIZE_SUM_PORTRAIT, SELECT_COLOR, TAB_UNICODE_ESCAPED } from "../../globalVariables";
import ControlPanel from "../ControlPanel";
import TextInput from "./TextInput";
import { Orientation } from "../../enums/Orientation";
import Popup from "../helpers/popups/Popup";
import PopupWarnConfirm from "../helpers/popups/PopupWarnConfirm";
import Button from "../helpers/Button";
import { getJQueryElementById } from "../../utils/documentUtils";
import PopupContainer from "../helpers/popups/PopupContainer";


// TODO: add some kind of "back" button
// TODO: update to bootstrap 5
// TODO: fix console errors

// TODO: reduce jquery calls
    // replace ids with refs if possible
    // somehow cache elements (especially collections) or save them as variables somewhere
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);

    const [escapePopup, setEscapePopup] = useState(true);
    const [popupContent, setPopupContent] = useState<React.JSX.Element>();

    const [textInputBorderFlashing, setTextInputBorderFlashing] = useState(false);

    /** <Paragraph /> component listens to changes of these states and attempts to append or remove a <TextInput /> at the end */
    const [paragraphIdAppendTextInput, setParagraphIdAppendTextInput] = useState<[string[], number]>(); // [paragraphIds, numTextInputsToAppend]
    const [paragraphIdRemoveTextInput, setParagraphIdRemoveTextInput] = useState<[string[], number]>(); // [paragraphIds, numTextInputsToRemove]
    
    /** serves as notification for the singleColumnLines state in ```<Page />``` component to refresh */
    const [refreshSingleColumnLines, setRefreshSingleColumnLines] = useState(false);

    const windowScrollY = useRef(0);
    const documentPopupRef = useRef(null);
    const documentOverlayRef = useRef(null);

    const context = {
        refreshSingleColumnLines, 
        setRefreshSingleColumnLines,

        handleTab,
        handleTextLongerThanLine,
        getTextInputOverhead,
        getNextTextInput,
        getPrevTextInput,
        getColumnTextInputs,
        
        isFontSizeTooLarge,
        handleFontSizeTooLarge,
        getNumLinesOverhead,
        appendTextInput,
        removeTextInput,
        paragraphIdAppendTextInput,
        setParagraphIdAppendTextInput,
        paragraphIdRemoveTextInput,
        setParagraphIdRemoveTextInput,
        getParagraphIdByDocumentId,
        getParagraphIdsForFontSizeChange,

        checkIsColumnEmptyById,
        getColumnFontSizesSum,
        getLastTextInputOfColumn,

        isTextInputHeading,

        togglePopup,
        hidePopup,
        setPopupContent
    };


    useEffect(() => {
        if (API_ENV !== "dev")
            confirmPageUnload();

        appContext.hidePopup();
        hidePopup();
        
        window.addEventListener('scroll', handleScroll);

        setCssVariable("selectedColor", SELECT_COLOR);
        setCssVariable("appBackgroundColor", "white");

        if (appContext.isWindowWidthTooSmall())
            handleWindowTooSmall();
    }, []);


    function handleDocumentClick(event): void {

        const targetClassName = event.target.className;

        // hide popup
        if (targetClassName.includes("hideDocumentPopup") && escapePopup)
            hidePopup();
    }


    /**
     * @returns true if no chars are found in any text input of selected column, else false (Tabs and spaces don't count as chars here)
     */
    function checkIsColumnEmptyById(columnId: string): boolean {

        if (isBlank(columnId))
            return true;

        const columnTextInputs = getColumnTextInputs(columnId);
        if (!columnTextInputs) 
            return false;

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
     * Add {@link TAB_UNICODE_ESCAPED} to ```selectedTextInput```. Prevent default event.
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
        moveCursor(appContext.selectedTextInputId, cursorIndex + 2, cursorIndex + 2);
    }


    /**
     * Flash border bottom color of text input and go back to border color from before. Use ```textInputborderFlashing``` state to
     * prevent flashing after event action.
     *
     * @param textInputId id of text input where text is too long
     */
    async function handleTextLongerThanLine(textInputId: string): Promise<void> {

        // case: border still flashing
        if (textInputBorderFlashing)
            return;

        setTextInputBorderFlashing(true);
        await flashClass(textInputId, "textInputFlash", "textInputFocus", 200);
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

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return null;

        const allTextInputs = $(".TextInput");
        const index = allTextInputs.index(textInput);

        // case: has no next text input
        if (allTextInputs.length - 1 === index)
            return null;

        return $(allTextInputs.get(index + 1)!);
    }


    /**
     * @param textInputId id of the current text input
     * @param debug if true, some more warn messages will be logged in case of falsy varaibles
     * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
     */
    function getPrevTextInput(textInputId: string, debug = true): JQuery | null {

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return null;

        const allTextInputs = $(".TextInput");
        const index = allTextInputs.index(textInput);

        // case: has no prev text input
        if (index === 0)
            return null;

        return $(allTextInputs.get(index - 1)!);
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns jquery of all ```<TextInput />``` components inside given column or ```null``` if column was not found.
     *          Also include ```<TextInput />```components in page with className {@link SINGLE_COLUMN_LINE_CLASS_NAME}.
     */
    function getColumnTextInputs(documentId = appContext.selectedTextInputId): JQuery | null {

        const docxElement = getJQueryElementById(documentId);
        if (!docxElement)
            return null;
        
        // get .TextInput
        const columnId = appContext.getColumnIdByDocumentId(documentId);
        let columnTextInputs = $("#" + columnId + " .TextInput");
        
        // get .SingleColumnLine
        const pageId = appContext.getPageIdByTextInputId(documentId);
        const singleColumnLines = $("#" + pageId + " .TextInput." + SINGLE_COLUMN_LINE_CLASS_NAME);
        columnTextInputs = columnTextInputs.add(singleColumnLines);

        return columnTextInputs;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns jquery of all ```<TextInput />``` components inside given paragraph or ```null``` if paragraph was not found
     */
    function getColumnParagraphs(documentId = appContext.selectedTextInputId): JQuery | null {

        const docxElement = getJQueryElementById(documentId);
        if (!docxElement)
            return null;

        const columnId = appContext.getColumnIdByDocumentId(documentId);

        return $("#" + columnId + " .Paragraph");
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns sum of font sizes of all text inputs in column (in px) or -1 if column was not found
     * 
     * @see getFontSizeDiffInWord
     */
    function getColumnFontSizesSum(documentId = appContext.selectedTextInputId): number {

        const columnTextInputs = getColumnTextInputs(documentId);

        if (!columnTextInputs || !columnTextInputs.length)
            return -1;

        let sum = 0;
        columnTextInputs.each((i, textInputElement) => {
            const textInput = $("#" + textInputElement.id);
            const fontSize = textInput.css("fontSize");

            if (fontSize) {
                const fontSizeNumber = getCSSValueAsNumber(fontSize, 2);
                sum += fontSizeNumber - getFontSizeDiffInWord(fontSizeNumber)
            }
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
            newTextInputs.push(<TextInput key={getRandomString()}
                                            pageIndex={pageIndex}
                                            columnIndex={columnIndex}
                                            paragraphIndex={paragraphIndex}
                                            textInputIndex={textInputs.length + i}
                                            isSingleColumnLine={false}
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
     * Try to remove text inputs at the end of the column of given textInputId. Don't remove any text input if at least 
     * one is not blank and try to flash text input border instead.
     * 
     * @param flash if true, the given text input will flash if no text input can be removed, default is true
     * @param deleteCount number of lines to remove if blank, default is 1
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns false if the fontSize should not be changed, else true
     */
    // TODO: handle value too large
    function handleFontSizeTooLarge(flash = true, deleteCount = 1, documentId = appContext.selectedTextInputId): boolean {

        const columnTextInputs = getColumnTextInputs(documentId);
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
            const paragraphIndex = getParagraphIndexOfLastTextInputInColumn(documentId);
            const paragraphIds = getParagraphIdsForFontSizeChange(documentId, paragraphIndex);
            setParagraphIdRemoveTextInput([paragraphIds, deleteCount]);

        // case: last input not blank
        } else {
            if (flash)
                flashClass(appContext.selectedTextInputId, "textInputFlash", "textInputFocus");

            return false;
        }

        // TODO: add some subtle popup saying something like "fontsize too large. clear the last line in column"
        return true;
    }


    /**
     * @param textInputId to check
     * @returns true if ```<TextInput />``` has {@link SINGLE_COLUMN_LINE_CLASS_NAME}
     */
    function isTextInputHeading(textInputId = appContext.selectedTextInputId): boolean {

        if (isBlank(textInputId)) {
            logWarn("'isTextInputHeading()' failed. 'textInputId' is blank")
            return false;
        }

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            logWarn("'isTextInputHeading()' failed. 'textInput' is falsy")
            return false;
        }

        return textInput.prop("className").includes(SINGLE_COLUMN_LINE_CLASS_NAME);
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param paragraphIndex index of paragraph in column, relevant if only one column is changed
     * @param isSingleColumnLine true if text input component is heading
     * @returns array of paragraph ids that should be considered for font size change
     */
    function getParagraphIdsForFontSizeChange(documentId = appContext.selectedTextInputId, paragraphIndex?: number, isSingleColumnLine = isTextInputHeading()): string[] {

        const paragraphIds: string[] = [];

        // case: is heading
        if (isSingleColumnLine) {
            const pageIndex = stringToNumber(getPartFromDocumentId(documentId, 1));
            
            // add lines to all columns
            for (let i = 0; i < appContext.numColumns; i++)
                paragraphIds.push(getParagraphIdByDocumentId(getDocumentId("Column", pageIndex, "", i), paragraphIndex));

        // case: normal line
        } else 
            paragraphIds.push(getParagraphIdByDocumentId(documentId, paragraphIndex));

        return paragraphIds;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param diff amount of px to consider when comparing ```columnFontSizesSum``` to ```maxSum```. Will be added to ```columnFontSizesSum```. 
     * @returns a touple formatted like: ```[isFontSizeTooLarge, numLinesOverhead]``` where numLinesOverhead is the number
     *          of lines that should be removed to match the MAX_NUM_LINES.
     */
    function isFontSizeTooLarge(documentId = appContext.selectedTextInputId, diff = 0): [boolean, number] {

        const columnFontSizesSum = getColumnFontSizesSum(documentId);
        
        if (columnFontSizesSum === -1)
            return [false, -1];

        const numLinesOverhead = Math.abs(getNumLinesOverhead(documentId, diff, columnFontSizesSum));

        const maxSum = appContext.orientation === Orientation.PORTRAIT ? MAX_FONT_SIZE_SUM_PORTRAIT : MAX_FONT_SIZE_SUM_LANDSCAPE;

        // case: adding numLinesOverhead would exceed max value
        if (columnFontSizesSum + numLinesOverhead > maxSum)
            return [true, numLinesOverhead];

        return [false, numLinesOverhead];
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param diff amount of px to consider when comparing ```columnFontSizesSum``` to ```maxSum```. Will be added to ```columnFontSizesSum```.
     * @param columnFontSizesSum sum of fontSizes of all text inputs in this column. If present it wont be calculated again to increase performance 
     * @returns number of lines with fontSize {@link DEFAULT_FONT_SIZE} by which the number of lines in the given ```<Column />``` differes from max num lines.
     *          Return -1 if no column is selected yet.
     */
    function getNumLinesOverhead(documentId = appContext.selectedTextInputId, diff = 0, columnFontSizesSum?: number): number {

        // case: no sum in param
        if (!columnFontSizesSum)
            columnFontSizesSum = getColumnFontSizesSum(documentId);

        // case: invalid document id
        if (columnFontSizesSum === -1)
            return -1;

        columnFontSizesSum += diff;
        
        const maxSum = appContext.orientation === Orientation.PORTRAIT ? MAX_FONT_SIZE_SUM_PORTRAIT : MAX_FONT_SIZE_SUM_LANDSCAPE;
        
        const totalDiff = maxSum - columnFontSizesSum;

        return Math.floor(totalDiff / DEFAULT_FONT_SIZE);
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param paragraphIndex index of the paragraph inside the column, will be set to last paragraph in column if not present
     * @returns id of the paragraph found with given params. Contains -1 as paragraphIndex if paragraph wasn't found
     */
    function getParagraphIdByDocumentId(documentId = appContext.selectedTextInputId, paragraphIndex?: number): string {

        // set default paragraph index to last paragraph in column
        if (!paragraphIndex) {
            const columnParagraphs = getColumnParagraphs(documentId);

            if (!columnParagraphs) 
                paragraphIndex = -1;
                
            else 
                paragraphIndex = columnParagraphs.length - 1;
        }

        const pageIndex = getPartFromDocumentId(documentId, 1);
        const columnIndex = getPartFromDocumentId(documentId, 2);

        const paragraphId = getDocumentId("Paragraph", stringToNumber(pageIndex), "", stringToNumber(columnIndex), paragraphIndex);

        return paragraphId;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @return index of last ```<Paragraph />``` with a ```<TextInput />``` in it in given ```<Column />``` or -1
     */
    function getParagraphIndexOfLastTextInputInColumn(documentId = appContext.selectedTextInputId): number {

        const lastTextInputOfColumn = getLastTextInputOfColumn(documentId);
        if (!lastTextInputOfColumn)
            return -1;

        const paragraph = lastTextInputOfColumn.parents(".Paragraph");
        if (!paragraph.length)
            return -1;

        return stringToNumber(getPartFromDocumentId(paragraph.prop("id"), 3));
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns a JQuery of the last ```<TextInput />``` in given column or null if not found
     */
    function getLastTextInputOfColumn(documentId: string): JQuery | null {

        const columnTextInputs = getColumnTextInputs(documentId);
        if (!columnTextInputs || !columnTextInputs.length)
            return null;

        return $(columnTextInputs.get(columnTextInputs.length - 1)!);
    }


    function handleScroll(event): void {

        const currentScrollY = window.scrollY;

        const controlPanelHeight = $(".ControlPanel").css("height");
        const isScrollUp = windowScrollY.current > currentScrollY;

        // move controlPanel in view
        $(".StylePanel").css("top", isScrollUp ? controlPanelHeight : 0);
        
        // update ref
        windowScrollY.current = currentScrollY;
    }


    function handleWindowTooSmall(): void {

        // warn about width
        setPopupContent((
            <Popup id={id} height="medium" width="medium">
                <PopupWarnConfirm hideThis={() => hidePopup()} dontConfirm={true}>
                    <div className="textCenter">
                        Die Breite Ihres Gerätes ist kleiner als eine Zeile im Dokument lang ist. Zeilen werden deshalb in Word
                        nicht identisch dargestellt werden.
                    </div>

                    <div className="flexCenter mt-5">
                        <Button id={id + "Ok"}
                                className="blackButton blackButtonContained"
                                hoverBackgroundColor="rgb(100, 100, 100)"
                                clickBackgroundColor="rgb(130, 130, 130)"
                                handleClick={() => hidePopup()}
                                >
                            Alles klar
                        </Button>
                    </div>
                </PopupWarnConfirm>
            </Popup>
        )); 

        togglePopup();
    }


    // TODO: replace all popup ups
    function togglePopup(duration = 100): void {

        const documentPopup = $(documentPopupRef.current);
        documentPopup.fadeToggle(duration);
        $(documentOverlayRef.current).fadeToggle(duration);

        // case: is hidden now
        if (!documentPopup.is(":visible"))
            resetDocumentPopup(setPopupContent);
    }


    function hidePopup(duration = 100): void {

        $(documentPopupRef.current).fadeOut(duration);
        $(documentOverlayRef.current).fadeOut(duration);

        resetDocumentPopup(duration);
    }


    function resetDocumentPopup(duration = 100): void {

        setTimeout(() => {
            setPopupContent(<></>);
            
        }, duration + 100);
    }


    // TODO: use forwardRef?
    return (
        <div id={id} className={className} onClick={handleDocumentClick}>
            <DocumentContext.Provider value={context}>
                <div className="documentOverlay hideDocumentPopup" ref={documentOverlayRef}></div>

                <div className="flexCenter" ref={documentPopupRef}>
                    <PopupContainer id={"Document"} className="hideDocumentPopup"></PopupContainer>
                </div>
                
                <ControlPanel />

                <StylePanel />

                <div className="pageContainer">
                    {appContext.pages}
                </div>
            </DocumentContext.Provider>
        </div>
    );
}


export const DocumentContext = createContext();