import React, { useContext, useEffect, useState, createContext, useRef } from "react";
import "../../assets/styles/Document.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, flashClass, getCssVariable, getJQueryElementByClassName, getJQueryElementById, getRandomString, insertString, isBlank, log, logError, logWarn, moveCursor, removeConfirmPageUnloadEvent, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";
import { API_ENV, DEFAULT_FONT_SIZE, SINGLE_COLUMN_LINE_CLASS_NAME, MAX_FONT_SIZE_SUM_LANDSCAPE, MAX_FONT_SIZE_SUM_PORTRAIT, SELECT_COLOR, NUM_PAGES, PAGE_WIDTH_PORTRAIT, PAGE_WIDTH_LANDSCAPE } from "../../globalVariables";
import ControlPanel from "./ControlPanel";
import TextInput from "./TextInput";
import { Orientation } from "../../enums/Orientation";
import { getCSSValueAsNumber, getColumnIdByDocumentId, getDocumentId, getMSWordFontSizeByBrowserFontSize, getPageIdByDocumentId, getPartFromDocumentId, isTextInputIdValid } from "../../utils/documentBuilderUtils";
import PopupContainer from "../popups/PopupContainer";
import Style, { StyleProp, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "../../abstract/Style";
import Page from "./Page";
import { buildDocument, downloadDocument } from "../../builder/builder";
import { SubtlePopupType } from "../../abstract/SubtlePopupType";
import ControlPanelMenu from "./ControlPanelMenu";
import WarnIcon from "../helpers/WarnIcon";


// TODO: add some kind of "back" button

// TODO: configure ssl?
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);

    // document popup
    const [popupContent, setPopupContent] = useState(<></>);
    const [matchPopupDimensions, setMatchPopupDimensions] = useState(!appContext.isMobileView);
    const [escapePopup, setEscapePopup] = useState(true);
    
    // subtle popup (in StylePanel)
    const [subtlePopupContent, setSubtlePopupContent] = useState(<></>);
    const [subtlePopupTitle, setSubtlePopupTitle] = useState("");
    const [subtlePopupMessage, setSubtlePopupMessage] = useState("");
    const [subtlePopupType, setSubtlePopupType] = useState<SubtlePopupType>("Info");
    const [subtlePopupTimeout, setSubtlePopupTimeout] = useState<NodeJS.Timeout | null>();

    const [pages, setPages] = useState<React.JSX.Element[]>(initPages());
    const [selectedTextInputId, setSelectedTextInputId] = useState("");
    const [selectedTextInputStyle, setSelectedTextInputStyleState] = useState(getDefaultStyle());

    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);
    const [numColumns, setNumColumns] = useState(1);
    const [numSingleColumnLines, setNumSingleColumnLines] = useState(0);
    const [documentFileName, setDocumentFileName] = useState("Dokument1.docx");

    /** <Paragraph /> component listens to changes of these states and attempts to append or remove a <TextInput /> at the end */
    const [paragraphIdAppendTextInput, setParagraphIdAppendTextInput] = useState<[string[], number]>([[""], 0]); // [paragraphIds, numTextInputsToAppend]
    const [paragraphIdRemoveTextInput, setParagraphIdRemoveTextInput] = useState<[string[], number]>([[""], 0]); // [paragraphIds, numTextInputsToRemove]
    
    /** serves as notification for the singleColumnLines state in ```<Page />``` component to refresh */
    const [refreshSingleColumnLines, setRefreshSingleColumnLines] = useState(false);


    const windowScrollY = useRef(0);
    const documentPopupRef = useRef(null);
    const documentOverlayRef = useRef(null);
    const subtlePopupRef = useRef<HTMLDivElement>(null);


    const context = {
        isTextInputHeading,
        refreshSingleColumnLines, 
        setRefreshSingleColumnLines,

        handleFontSizeTooLarge,
        handleFontSizeTooSmall,
        getNumLinesDeviation,
        subtractMSWordFontSizes,
        appendTextInput,
        removeTextInput,
        paragraphIdAppendTextInput,
        setParagraphIdAppendTextInput,
        paragraphIdRemoveTextInput,
        setParagraphIdRemoveTextInput,
        getParagraphIdByDocumentId,
        getParagraphIdsForFontSizeChange,

        getColumnTextInputs,
        getColumnFontSizesSum,
        getLastTextInputOfColumn,
        checkIsColumnEmptyById,

        togglePopup,
        hidePopup,
        popupContent,
        setPopupContent,
        matchPopupDimensions,
        setMatchPopupDimensions,

        subtlePopupTitle,
        subtlePopupMessage,
        subtlePopupType,
        showSubtlePopup,
        subtlePopupContent,
        setSubtlePopupContent,

        hideSelectOptions,

        focusTextInput,
        unFocusTextInput,

        setSelectedTextInputStyle,
        setPages,
        initPages,
        orientation,
        setOrientation,
        numColumns,
        setNumColumns,
        numSingleColumnLines, 
        setNumSingleColumnLines,
        selectedTextInputId,
        setSelectedTextInputId,
        selectedTextInputStyle,
        documentFileName,
        setDocumentFileName,

        buildAndDownloadDocument,
    };


    useEffect(() => {
        if (API_ENV !== "dev")
            confirmPageUnload();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKeyDown);

        setCssVariable("selectedColor", SELECT_COLOR);
        setCssVariable("appBackgroundColor", "white");
        setCssVariable("pageWidthPortrait", PAGE_WIDTH_PORTRAIT);
        setCssVariable("pageWidthLandscape", PAGE_WIDTH_LANDSCAPE);
        setCssVariable("controlPanelMenuTop", getCSSValueAsNumber($(".ControlPanel").css("height"), 2) + 5 + "px");

        // clean up
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
            
            if (API_ENV !== "dev")
                removeConfirmPageUnloadEvent();
        }

    }, []);


    useEffect(() => {
        setMatchPopupDimensions(!appContext.isMobileView);

    }, [appContext.isMobileView])


    function handleDocumentClick(event): void {

        const targetClassName = event.target.className;

        // hide popup
        if (targetClassName.includes("hideDocumentPopup") && escapePopup)
            hidePopup();
                
        if (!targetClassName.includes("dontHideSelect")) 
            hideSelectOptions();
    }


    /**
     * @param style to update selectedTextInputStyle with
     * @param stylePropsToOverride style props to override in ```style``` param
     */
    function setSelectedTextInputStyle(style: Style, stylePropsToOverride?: [StyleProp, string | number][]): void {

        // set specific props
        if (stylePropsToOverride) 
            stylePropsToOverride.forEach(([styleProp, value]) => style[styleProp.toString()] = value);
        
        setSelectedTextInputStyleState(style);
    }


    /**
     * @param textInputId id of valid ```<TextInput />``` to focus
     * @param updateSelectedTextInputStyle if true, the ```selectedTextInputStyle``` state will be updated with focused text input style
     * @param updateSelectedTextInputStyle if true, the ```selectedTextInputStyle``` will be applied to text input with ```selectedTextInputId```
     * @param stylePropsToOverride list of style properties to override when copying styles 
     */
    function focusTextInput(textInputId: string, 
                            updateSelectedTextInputStyle = true, 
                            applySelectedTextInputStyle = true,
                            stylePropsToOverride?: [StyleProp, string | number][]): void {

        if (!isTextInputIdValid(textInputId))
            return;

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return;

        textInput.addClass("textInputFocus");

        // id state
        setSelectedTextInputId(textInputId);

        // style state
        if (updateSelectedTextInputStyle) 
            setSelectedTextInputStyle(getTextInputStyle(textInput), stylePropsToOverride);

        // style text input
        if (applySelectedTextInputStyle)
            applyTextInputStyle(textInputId, selectedTextInputStyle);

        textInput.trigger("focus");
    }


    function unFocusTextInput(textInputId: string, debug = true): void {

        const textInput = getJQueryElementById(textInputId, debug);
        if (!textInput)
            return;

        textInput.removeClass("textInputFocus");
    }
        

    function initPages(): React.JSX.Element[] {

        const pages: React.JSX.Element[] = [];

        for (let i = 0; i < NUM_PAGES; i++)
            pages.push((
                <div className="flexCenter" key={i}>
                    <Page pageIndex={i} className="boxShadowGrey"/>
                </div>
            ));

        return pages;
    }
    

    /**
     * @returns true if no chars are found in any text input of selected column, else false (Tabs and spaces don't count as chars here)
     */
    function checkIsColumnEmptyById(documentId: string): boolean {

        const columnTextInputs = getColumnTextInputs(documentId);
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
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns jquery of all ```<TextInput />``` components inside given column or ```null``` if column was not found.
     *          Also include ```<TextInput />```components in page with className {@link SINGLE_COLUMN_LINE_CLASS_NAME}.
     */
    function getColumnTextInputs(documentId = selectedTextInputId): JQuery | null {

        const docxElement = getJQueryElementById(documentId);
        if (!docxElement)
            return null;
        
        // get .TextInput
        const columnId = getColumnIdByDocumentId(documentId);
        let columnTextInputs = $("#" + columnId + " .TextInput");
        
        // get .SingleColumnLine
        const pageId = getPageIdByDocumentId(documentId);
        if (!pageId)
            return null;

        const singleColumnLines = $("#" + pageId + " .TextInput." + SINGLE_COLUMN_LINE_CLASS_NAME);
        columnTextInputs = columnTextInputs.add(singleColumnLines);

        return columnTextInputs;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns jquery of all ```<TextInput />``` components inside given paragraph or ```null``` if paragraph was not found
     */
    function getColumnParagraphs(documentId = selectedTextInputId): JQuery | null {

        const docxElement = getJQueryElementById(documentId);
        if (!docxElement)
            return null;

        const columnId = getColumnIdByDocumentId(documentId);

        return $("#" + columnId + " .Paragraph");
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
     * @param checkNextTextInputFocused if true, one more text input will be checked for "is focused" than it normally would to prevent
     *                                  focusing a text input that will be deleted
     * @returns false if the fontSize should not be changed, else true
     */
    function handleFontSizeTooLarge(flash = true, deleteCount = 1, documentId = selectedTextInputId, checkNextTextInputFocused = false): boolean {

        const columnTextInputs = getColumnTextInputs(documentId);
        if (!columnTextInputs) {
            logError("'handleFontSizeTooLarge()' failed. 'columnTextInputs' is falsy.");
            return false;
        }

        // get last textinputs
        let areTextInputsBlank = true;
        let areTextInputsToDeleteFocused = false;
        const columnTextInputsToDelete = Array.from(columnTextInputs).slice(columnTextInputs.length - deleteCount - (checkNextTextInputFocused ? 1 : 0));

        // check for non blank textInputs
        columnTextInputsToDelete.forEach(textInput => {
            // case: is not blank
            if (areTextInputsBlank && !isBlank((textInput as HTMLInputElement).value))
                areTextInputsBlank = false;

            // case: is focused
            if (!areTextInputsToDeleteFocused && textInput.id === selectedTextInputId)
                areTextInputsToDeleteFocused = true;
        });

        // case: last input blank
        if (areTextInputsBlank && !areTextInputsToDeleteFocused) {
            const paragraphIndex = getParagraphIndexOfLastTextInputInColumn(documentId);
            const paragraphIds = getParagraphIdsForFontSizeChange(documentId, paragraphIndex);
            setParagraphIdRemoveTextInput([paragraphIds, deleteCount]);

        // case: last input not blank
        } else {
            // case: warn user
            if (flash) {
                flashClass(selectedTextInputId, "textInputFlash", "textInputFocus");
                showSubtlePopup("Kann Schriftgröße nicht ändern", "Lösche den Text in ein paar der unteren Zeilen auf dieser Seite und versuche es dann erneut.", "Warn");
            }

            return false;
        }

        return true;
    }

    
    /**
     * Set weird "paragraph append" state for some paragraphs to be added.
     * 
     * @param numLinesToAdd number of lines of {@link DEFAULT_FONT_SIZE} that could fit at the bottom of selected column
     */
    function handleFontSizeTooSmall(numLinesToAdd: number): void {

        // case: some lines to add
        if (Math.abs(numLinesToAdd) !== 0) {
            // case: is last text input
            const lastTextInputInColumn = getLastTextInputOfColumn();
            if (lastTextInputInColumn && lastTextInputInColumn.prop("id") === selectedTextInputId)
                return;
            
            // get all paragraphs to 
            const paragraphIds = getParagraphIdsForFontSizeChange();
            setParagraphIdAppendTextInput([paragraphIds, Math.abs(numLinesToAdd)]);
        }
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @returns sum of font sizes of all text inputs in column (in px) or -1 if column was not found. Uses msWord font size.
     */
    function getColumnFontSizesSum(documentId = selectedTextInputId): number {

        const columnTextInputs = getColumnTextInputs(documentId);

        if (!columnTextInputs || !columnTextInputs.length)
            return -1;

        let sum = 0;
        columnTextInputs.each((i, textInputElement) => {
            const fontSize = $("#" + textInputElement.id).css("fontSize");
            if (fontSize) 
                sum += getMSWordFontSizeByBrowserFontSize(getCSSValueAsNumber(fontSize, 2));
        });

        return sum;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param diff amount of px to consider when comparing ```columnFontSizesSum``` to ```maxFontSizeSum```. Will be added to ```columnFontSizesSum``` and should be
     *             stated as msWord font size. 
     * @param columnFontSizesSum sum of fontSizes of all text inputs in this column. If present it wont be calculated again to increase performance 
     * @returns number of lines with fontSize {@link DEFAULT_FONT_SIZE} by which the number of lines in the given ```<Column />``` differes from max num lines.
     *          Return -1 if no column is selected yet.
     */
    function getNumLinesDeviation(documentId = selectedTextInputId, diff = 0, columnFontSizesSum?: number): number {

        // case: no sum in param
        if (!columnFontSizesSum)
            columnFontSizesSum = getColumnFontSizesSum(documentId);

        // case: invalid document id
        if (columnFontSizesSum === -1)
            return -1;

        columnFontSizesSum += diff;
        
        const maxSum = orientation === Orientation.PORTRAIT ? MAX_FONT_SIZE_SUM_PORTRAIT : MAX_FONT_SIZE_SUM_LANDSCAPE;
        
        const totalDiff = columnFontSizesSum - maxSum;

        return Math.floor(totalDiff / DEFAULT_FONT_SIZE);
    }


    /**
     * Calculate ```fontSize - fontSize2``` but convert to msWord font size first.
     * 
     * @param fontSize browser font size
     * @param fontSize2 browser font size
     * @returns deviation of two given font sizes, but converted to msWord font size first
     */
    function subtractMSWordFontSizes(fontSize: number | string, fontSize2: number | string): number {

        fontSize = getCSSValueAsNumber(fontSize, 2);
        fontSize = getMSWordFontSizeByBrowserFontSize(fontSize);
        
        fontSize2 = getCSSValueAsNumber(fontSize2, 2);
        fontSize2 = getMSWordFontSizeByBrowserFontSize(fontSize2);

        return fontSize - fontSize2;
    }


    /**
     * @param textInputId to check
     * @returns true if ```<TextInput />``` has {@link SINGLE_COLUMN_LINE_CLASS_NAME}
     */
    function isTextInputHeading(textInputId = selectedTextInputId): boolean {

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
    function getParagraphIdsForFontSizeChange(documentId = selectedTextInputId, paragraphIndex?: number, isSingleColumnLine = isTextInputHeading()): string[] {

        const paragraphIds: string[] = [];

        // case: is heading
        if (isSingleColumnLine) {
            const pageIndex = stringToNumber(getPartFromDocumentId(documentId, 1));
            
            // add lines to all columns
            for (let i = 0; i < numColumns; i++)
                paragraphIds.push(getParagraphIdByDocumentId(getDocumentId("Column", pageIndex, "", i), paragraphIndex));

        // case: normal line
        } else 
            paragraphIds.push(getParagraphIdByDocumentId(documentId, paragraphIndex));

        return paragraphIds;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
     * @param paragraphIndex index of the paragraph inside the column, will be set to last paragraph in column if not present
     * @returns id of the paragraph found with given params. Contains -1 as paragraphIndex if paragraph wasn't found
     */
    function getParagraphIdByDocumentId(documentId = selectedTextInputId, paragraphIndex?: number): string {

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
    function getParagraphIndexOfLastTextInputInColumn(documentId = selectedTextInputId): number {

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
    function getLastTextInputOfColumn(documentId = selectedTextInputId): JQuery | null {

        const columnTextInputs = getColumnTextInputs(documentId);
        if (!columnTextInputs || !columnTextInputs.length)
            return null;

        return $(columnTextInputs.get(columnTextInputs.length - 1)!);
    }


    function handleDocumentMouseMove(event): void {

        handleSubtlePopupMouseMove(event);
    }


    /**
     * Display subtle popup, set content and set timeout to fade out.
     * 
     * @param title heading to display inside popup, may be a plain string
     * @param message message to display inside popup, may be a plain string
     * @param duration time in ms that the popup should fade in, default is 100
     * @param holdTime time in ms that the popup should stay displayed and should fade out, default is 3000
     */
    function showSubtlePopup(title: string, message: string, type = "Info" as SubtlePopupType, duration = 100, holdTime = 3000): void {

        const subtlePopup = $(subtlePopupRef.current!);

        clearSubtlePopupTimeout();

        setSubtlePopupType(type);
        setSubtlePopupTitle(title);
        setSubtlePopupMessage(message);

        // fadeIn
        subtlePopup.fadeIn(duration);

        // fade out after time out
        setSubtlePopupTimeout(setTimeout(() => subtlePopup.fadeOut(holdTime), holdTime));
    }


    /**
     * Stop subtle popup animations on mouseover and display it instead. Fade it out on mouseout. 
     */
    function handleSubtlePopupMouseMove(event): void {

        const subtlePopup = $(subtlePopupRef.current!);

        // case: popup hidden already
        if (!subtlePopup.is(":visible"))
            return;
    
        // mouseover
        if (event.target.className.includes("dontHideSubtlePopup")) {
            clearSubtlePopupTimeout();
            subtlePopup.css("opacity", 1);

        // mouseout
        } else
            startSubtlePopupTimeout();
    }


    /**
     * Set timeout to fade out SubtlePopup.
     * 
     * @param holdeTime time in ms that the popup waits until starting to fade out AND also the time that the popup takes to fade out
     */
    function startSubtlePopupTimeout(holdeTime = 3000): void {

        const subtlePopup = $(subtlePopupRef.current!);

        // case: already started
        if (subtlePopupTimeout !== null)
            return;

        setSubtlePopupTimeout(setTimeout(() => subtlePopup.fadeOut(holdeTime), holdeTime));
    }


    /**
     * Clear timeout that started fade out of SubtlePopup, stop any animation on SubtlePopup and set timout state of
     * SubtlePopup to null.
     */
    function clearSubtlePopupTimeout(): void {
        
        // case: already cleared
        if (subtlePopupTimeout === null) 
            return;

        const subtlePopup = $(subtlePopupRef.current!);

        clearTimeout(subtlePopupTimeout);
        subtlePopup.stop(true);
        setSubtlePopupTimeout(null);
    }


    function handleScroll(event): void {

        // hide controlpanel menu
        $(".ControlPanelMenu").slideUp(0);

        const currentScrollY = window.scrollY;

        const controlPanelHeight = $(".ControlPanel").css("height");
        const navBarHeight = $(".NavBar").css("height");
        const controlPanelHeightNumber = getCSSValueAsNumber(controlPanelHeight, 2);
        const navBarHeightNumber = getCSSValueAsNumber(navBarHeight, 2);

        const isScrollUp = windowScrollY.current > currentScrollY;

        // move StylePanel a bit lower to pull ControlPanel in view
        $(".StylePanel").css("top", isScrollUp ? controlPanelHeight : 0);

        // move ControlPanelMenu along with ControlPanel
        let controlPanelMenuTop = currentScrollY < navBarHeightNumber ? controlPanelHeightNumber : currentScrollY - navBarHeightNumber + controlPanelHeightNumber;
        // add some space for boxShadow
        controlPanelMenuTop += 5;
        setCssVariable("controlPanelMenuTop", controlPanelMenuTop + "px");
        
        // update ref
        windowScrollY.current = currentScrollY;
    }


    function handleKeyDown(event): void {

        if (event.key === "Escape")
            hideSelectOptions();
    }


    /**
     * Combine build and download document methods and handle errors.
     * 
     * @param pdf if true, the api will return document as .pdf
     */
    async function buildAndDownloadDocument(pdf = false): Promise<void> {

        // remove confirm unload event
        if (API_ENV !== "dev") {
            log(API_ENV)
            removeConfirmPageUnloadEvent();
        }

        // build
        const buildResponse = await buildDocument(orientation, numColumns, documentFileName, numSingleColumnLines);

        // case: build failed
        if (buildResponse.status !== 200)
            showSubtlePopup("Kann Dokument nicht erstellen", "Da ist etwas beim Erstellen des Dokumentes schiefgelaufen. Versche es erneut oder lade die Seite neu.", "Error");

        // case: build successful
        else {
            // download
            const downloadResponse = await downloadDocument(pdf, documentFileName);

            // case: download failed
            if (downloadResponse && downloadResponse.status !== 200)
                showSubtlePopup("Kann Dokument nicht herunterladen", "Da ist etwas beim Herunterladen des Dokumentes schiefgelaufen. Versche es erneut oder lade die Seite neu.", "Error");
        }

        // add back confirm unload event
        if (API_ENV !== "dev")
            confirmPageUnload();
    }


    function togglePopup(duration = 100): void {

        const documentPopup = $(documentPopupRef.current!);
        documentPopup.fadeToggle(duration);
        documentPopup.css("display", "flex");

        $(documentOverlayRef.current!).fadeToggle(duration);

        // case: is hidden now
        if (!documentPopup.is(":visible"))
            resetDocumentPopup();
    }


    function hidePopup(duration = 100): void {

        const documentPopup = $(documentPopupRef.current!);
        documentPopup.fadeOut(duration);

        $(documentOverlayRef.current!).fadeOut(duration);

        resetDocumentPopup(duration);
    }


    function resetDocumentPopup(duration = 100): void {

        setTimeout(() => {
            setPopupContent(<></>);
            
        }, duration + 100);
    }

    
    function hideSelectOptions(selectComponentId?: string): void {

        const selectOptionsBoxes = selectComponentId ? getJQueryElementById(selectComponentId + " .selectOptionsBox") : 
                                                       getJQueryElementByClassName("selectOptionsBox");
        if (!selectOptionsBoxes)
            return;

        // iterate all select option boxes
        Array.from(selectOptionsBoxes).forEach(selectOptionsBoxElement => {
            // hide if not hidden already
            const selectOptionsBox = $(selectOptionsBoxElement);
            if (selectOptionsBox.css("display") !== "none")
                selectOptionsBox.slideUp(100, "linear");
        })
    }


    return (
        <div id={id} className={className} onClick={handleDocumentClick} onMouseMove={handleDocumentMouseMove}>
            <DocumentContext.Provider value={context}>
                <div className="documentOverlay hideDocumentPopup" ref={documentOverlayRef}></div>

                {/* document popup */}
                <div className="flexCenter">
                    <PopupContainer id={"Document"} className="hideDocumentPopup" ref={documentPopupRef}>
                        {popupContent}
                    </PopupContainer>
                </div>
                
                <ControlPanel />
                <ControlPanelMenu className="boxShadowDark" />
                
                <StylePanel ref={subtlePopupRef}/>

                <div className={"pageContainer " + (appContext.isMobileView ? "flexLeft" : "flexCenter")}>
                    <div style={{width: orientation === Orientation.PORTRAIT ? PAGE_WIDTH_PORTRAIT : PAGE_WIDTH_LANDSCAPE}}>
                        {pages}
                    </div>
                </div>
            </DocumentContext.Provider>
        </div>
    );
}

const paragraphIdAppendExample: [string[], number] = [[""], 0];
export const DocumentContext = createContext({
    isTextInputHeading: (textInputId?: string): boolean => {return false},
    refreshSingleColumnLines: false, 
    setRefreshSingleColumnLines: (bool: boolean) => {},

    handleFontSizeTooLarge: (flash?: boolean, deleteCount?: number, documentId?: string, checkNextTextInputFocused?: boolean): boolean => {return false},
    handleFontSizeTooSmall: (numLinesToAdd: number) => {},
    getNumLinesDeviation: (documentId?: string, diff?: number, columnFontSizeSum?: number): number => {return 0},
    subtractMSWordFontSizes: (fontSize: number | string, fontSize2: number | string): number => {return 0},
    appendTextInput: (textInputs: React.JSX.Element[], setTextInputs: (textInputs: React.JSX.Element[]) => void, pageIndex: number, columnIndex: number, paragraphIndex: number, numTextInputs?: number): React.JSX.Element[] => {return []},
    removeTextInput: (textInputs: React.JSX.Element[], setTextInputs: (textInputs: React.JSX.Element[]) => void, index?: number, deleteCount?: number): React.JSX.Element[] => {return []},
    paragraphIdAppendTextInput: paragraphIdAppendExample,
    setParagraphIdAppendTextInput: (paragraphIdAppendTextInput: [string[], number]) => {},
    paragraphIdRemoveTextInput: paragraphIdAppendExample,
    setParagraphIdRemoveTextInput: (paragraphIdAppendTextInput: [string[], number]) => {},
    getParagraphIdByDocumentId: (documentId?: string, paragraphIndex?: number): string => {return ""},
    getParagraphIdsForFontSizeChange: (documentId?: string, paragraphIndex?: number, isSingleColumnLine?: boolean): string[] => {return []},

    getColumnTextInputs: (documentId?: string): JQuery | null => {return null},
    getColumnFontSizesSum: (documentId?: string): number => {return 0},
    getLastTextInputOfColumn: (documentId?: string): JQuery | null => {return null},
    checkIsColumnEmptyById: (documentId?: string): boolean => {return false},

    togglePopup: (duration?: number) => {},
    hidePopup: (duration?: number) => {},
    popupContent: <></>,
    setPopupContent: (popupContent: React.JSX.Element) => {},
    subtlePopupTitle: "",
    subtlePopupMessage: "",
    subtlePopupType: "Warn" as SubtlePopupType,
    showSubtlePopup: (summary: string, content: string, type?: SubtlePopupType, duration?: number, holdTime?: number) => {},
    subtlePopupContent: <></>,
    setSubtlePopupContent: (popupContent: React.JSX.Element) => {},
    matchPopupDimensions: false,
    setMatchPopupDimensions: (matchPopupDimenstions: boolean) => {},

    hideSelectOptions: (selectComponentId?: string) => {},

    focusTextInput: (textInputId: string, updateSelectedTextInputStyle?: boolean, applySelectedTextInputStyle?: boolean, stylePropsToOverride?: [StyleProp, string | number][]) => {},
    unFocusTextInput: (textInputId: string, debug?: boolean) => {},

    setPages: (pages: React.JSX.Element[]) => {},
    initPages: (): React.JSX.Element[] => {return []},
    orientation: Orientation.PORTRAIT,
    setOrientation: (orientation: Orientation) => {},
    numColumns: 1,
    setNumColumns: (numColumns: number) => {},
    numSingleColumnLines: 0, 
    setNumSingleColumnLines: (numSingleColumnLines: number) => {},
    selectedTextInputId: "",
    setSelectedTextInputId: (id: string) => {},
    selectedTextInputStyle: getDefaultStyle(),
    setSelectedTextInputStyle: (style: Style, stylePropsToOverride?: [StyleProp, string | number][]) => {},
    documentFileName: "",
    setDocumentFileName: (fileName: string) => {},

    buildAndDownloadDocument: async (pdf?: boolean) => {}, 
});