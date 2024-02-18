import React, { useContext, useEffect, useState, createContext, useRef } from "react";
import "../../assets/styles/Document.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, flashClass, getCssVariable, getJQueryElementByClassName, getJQueryElementById, getRandomString, insertString, isBlank, log, logError, logWarn, moveCursor, removeConfirmPageUnloadEvent, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";
import { API_ENV, DEFAULT_FONT_SIZE, SINGLE_COLUMN_LINE_CLASS_NAME, MAX_FONT_SIZE_SUM_LANDSCAPE, MAX_FONT_SIZE_SUM_PORTRAIT, SELECT_COLOR, NUM_PAGES, PAGE_WIDTH_PORTRAIT, PAGE_WIDTH_LANDSCAPE, DEFAULT_DOCUMENT_FILE_NAME } from "../../globalVariables";
import ControlPanel from "./ControlPanel";
import { Orientation } from "../../enums/Orientation";
import { documentIdToColumnId, getCSSValueAsNumber, getColumnIdByDocumentId, getDocumentId, getMSWordFontSizeByBrowserFontSize, getNextTextInput, getPageIdByDocumentId, getPartFromDocumentId, isTextInputIdValid } from "../../utils/documentBuilderUtils";
import PopupContainer from "../popups/PopupContainer";
import Style, { StyleProp, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "../../abstract/Style";
import Page from "./Page";
import { buildDocument, downloadDocument } from "../../builder/builder";
import { SubtlePopupType } from "../../abstract/SubtlePopupType";
import ControlPanelMenu from "./ControlPanelMenu";
import { AppendRemoveTextInputWrapper, getDefaultAppendRemoveTextInputWrapper } from "../../abstract/AppendRemoveTextInputWrapper";


// TODO: add some kind of "back" button
// TODO: num lines calculation is wrong, if not all lines are filled with text
// TODO: text input margin not accurate at all, last line should always be on bottom even with larger font sizes
// TODO: font size of bottom lines of pages should be changable if empty
// TODO: about page, link github and stuff
// TODO: test barrier usability (alt, title etc.)ne
// TODO: handle tab navigation correctly (Popups, stylepanel etc.)
// TODO: check some seo criteria
// TODO: lookup portainer

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
    const [documentFileName, setDocumentFileName] = useState(DEFAULT_DOCUMENT_FILE_NAME);

    /** ```<Column />``` component listens to this state and appends or removes given text inputs.*/
    const [appendTextInputWrapper, setAppendTextInputWrapper] = useState<AppendRemoveTextInputWrapper>(getDefaultAppendRemoveTextInputWrapper());
    const [removeTextInputWrapper, setRemoveTextInputWrapper] = useState<AppendRemoveTextInputWrapper>(getDefaultAppendRemoveTextInputWrapper());
    
    /** serves as notification for the singleColumnLines state in ```<Page />``` component to refresh */
    const [refreshSingleColumnLines, setRefreshSingleColumnLines] = useState(false);

    const [isWindowWidthFitLandscape, setIsWindowWidthFitLandscape] = useState(checkIsWindowWidthFitLandscape());
    const [isWindowWidthFitPortrait, setIsWindowWidthFitPortrait] = useState(checkIsWindowWidthFitPortrait());

    const windowScrollY = useRef(0);
    const documentPopupRef = useRef(null);
    const documentOverlayRef = useRef(null);
    const subtlePopupRef = useRef<HTMLDivElement>(null);


    const context = {
        isTextInputSingleColumnLine,
        refreshSingleColumnLines, 
        setRefreshSingleColumnLines,

        handleFontSizeChange,
        getNumLinesDeviation,
        subtractMSWordFontSizes,
        appendTextInputWrapper,
        setAppendTextInputWrapper,
        removeTextInputWrapper,
        setRemoveTextInputWrapper,

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

    }, [appContext.isMobileView]);


    useEffect(() => {
        setIsWindowWidthFitLandscape(checkIsWindowWidthFitLandscape());
        setIsWindowWidthFitPortrait(checkIsWindowWidthFitPortrait());

    }, [appContext.windowSize]);


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
     * @param debug if false, no logs will be printed in case of falsy textInputId, default is ```true```
     */
    function focusTextInput(textInputId: string, 
                            updateSelectedTextInputStyle = true, 
                            applySelectedTextInputStyle = true,
                            stylePropsToOverride?: [StyleProp, string | number][], 
                            debug = true): void {

        if (!isTextInputIdValid(textInputId, debug))
            return;

        const textInput = getJQueryElementById(textInputId, debug);
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
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. textInputId). Default is selectedTextInputId
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
     * Calculate number of lines deviation in column of given ```documentId``` and append or remove some lines to even out the difference.
     *  
     * @param fontSizeDiff amount of px to consider when comparing ```columnFontSizesSum``` to ```maxFontSizeSum```. Will be added to ```columnFontSizesSum``` and should be
     *                     stated as msWord font size. 
     * @param textInputId id of text input where the font size has changed, default is ```selectedTextInputId```
     * @returns false if the fontSize should not be changed, else true
     */
    function handleFontSizeChange(fontSizeDiff: number, textInputId = selectedTextInputId): boolean {

        const textInput = getJQueryElementById(textInputId);

        // case: falsy id
        if (!textInput)
            return false;
        
        const numLinesDiff = getNumLinesDeviation(textInputId, fontSizeDiff);
        const isSingleColumnLine = isTextInputSingleColumnLine(textInputId);
        let isAbleToHandleFontSizeChange = true;

        // case: font size too large
        if (numLinesDiff > 0) {
            isAbleToHandleFontSizeChange = handleFontSizeTooLarge(false, numLinesDiff, textInputId, true, isSingleColumnLine)

        // case: font size too small
        } else if (numLinesDiff < 0)
            handleFontSizeTooSmall(numLinesDiff, textInputId, isSingleColumnLine);

        return isAbleToHandleFontSizeChange;
    }


    /**
     * Try to remove text inputs at the end of the column of given textInputId. Don't remove any text input if at least 
     * one is not blank and try to flash text input border instead.
     * 
     * @param flash if true, the given text input will flash if no text input can be removed, default is true
     * @param deleteCount number of lines to remove if blank, default is 1
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. textInputId). Default is selectedTextInputId
     * @param checkNextTextInputFocused if true, next text input will be checked for "is focused" too (i.e. if this function was triggered by "Enter" handler)
     * @param isTextInputSingleColumnLine if true, the text input that has it's font size changed is a single column line, default is false
     * @returns false if the fontSize should not be changed, else true
     */
    function handleFontSizeTooLarge(flash = true, deleteCount = 1, documentId = selectedTextInputId, checkNextTextInputFocused = false, isTextInputSingleColumnLine = false): boolean {

        const lastTextInputsInColumn = getNLastTextInputs(documentId, deleteCount);
        const columnIds = new Set<string>();
        let numTextInputsToRemove = 0;

        let areTextInputsBlank = true;
        let areTextInputsToRemoveFocused = false;

        // validate text inputs to be removed
        lastTextInputsInColumn.forEach(textInput => {
            // case: is not blank
            if (areTextInputsBlank && !isBlank((textInput as HTMLInputElement).value)) {
                areTextInputsBlank = false;
                return;
            }

            // case: is focused
            if (!areTextInputsToRemoveFocused) {
                if (textInput.id === selectedTextInputId || (checkNextTextInputFocused && selectedTextInputId === getNextTextInput(textInput.id)?.prop("id"))) {
                    areTextInputsToRemoveFocused = true;
                    return;
                }
            }

            // case: is single column line
            if (isTextInputSingleColumnLine) {
                // consider aligned columns as well
                const nonSingleColumnLineTextInputId = getNonSingleLineColumnTextInputIdInSameColumn(textInput.id);
                const alignedTextInputIds = getAlignedTextInputIds(nonSingleColumnLineTextInputId);

                // add column ids
                if (columnIds.size < 3)
                    alignedTextInputIds.forEach(textInputId => columnIds.add(documentIdToColumnId(textInputId)));
            
            } else
                if (columnIds.size < 1)
                    columnIds.add(documentIdToColumnId(documentId));
            
            numTextInputsToRemove++;
        });

        // case: text inputs to remove are valid
        if (areTextInputsBlank && !areTextInputsToRemoveFocused) {
            setRemoveTextInputWrapper({
                columnIds: columnIds, 
                num: numTextInputsToRemove
            });

        // case: text inputs to remove are not valid
        } else {
            // case: warn user
            if (flash) {
                flashClass(selectedTextInputId, "textInputFlash", "textInputFocus");
                showSubtlePopup("Kann Schriftgröße nicht ändern", "Lösche den Text in ein paar der unteren Zeilen auf dieser Seite und wähle diese Zeilen nicht aus, dann versuche es erneut.", "Warn");
            }

            return false;
        }

        return true;
    }

    
    /**
     * Set weird "textInput append" state for some text inputs to be added.
     * 
     * @param numLinesToAppend number of lines of {@link DEFAULT_FONT_SIZE} that could fit at the bottom of selected column
     * @param textInputId in order to get aligned text inputs and to determine
     * @param isTextInputSingleColumnLine if true, the text input that has it's font size changed is a single column line, default is false
     */
    function handleFontSizeTooSmall(numLinesToAppend: number, textInputId = selectedTextInputId, isTextInputSingleColumnLine = false): void {

        const columnIds = new Set<string>();

        // case: single column line
        if (isTextInputSingleColumnLine) {
            const nonSingleColumnLineTextInputId = getNonSingleLineColumnTextInputIdInSameColumn(textInputId);
            getAlignedTextInputIds(nonSingleColumnLineTextInputId).forEach(textInputId => columnIds.add(documentIdToColumnId(textInputId)));
        
        // case: normal line
        } else
            columnIds.add(documentIdToColumnId(textInputId));

        setAppendTextInputWrapper({
            columnIds: columnIds,
            num: Math.abs(numLinesToAppend)
        });
    }


    /**
     * @param documentId to identify the column of the text inputs
     * @param n number of text inputs to get from column
     * @returns ```n``` to last ```<TextInput />```s
     */
    function getNLastTextInputs(documentId: string, n: number): HTMLElement[] {

        const columnTextInputs = getColumnTextInputs(documentId);
        if (!columnTextInputs)
            return [];

        return Array.from(columnTextInputs).slice(columnTextInputs.length - n);
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. textInputId). Default is selectedTextInputId
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
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. textInputId). Default is selectedTextInputId
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
    function isTextInputSingleColumnLine(textInputId = selectedTextInputId): boolean {

        if (isBlank(textInputId)) {
            logWarn("'isTextInputSingleColumnLine()' failed. 'textInputId' is blank")
            return false;
        }

        const textInput = $("#" + textInputId);
        if (!textInput.length) {
            logWarn("'isTextInputSingleColumnLine()' failed. 'textInput' is falsy")
            return false;
        }

        return textInput.prop("className").includes(SINGLE_COLUMN_LINE_CLASS_NAME);
    }


    /**
     * @param textInputId id of text input to align
     * @returns string array of valid text input ids with same text input index on same page accross all columns of page.
     *          Return ```[]``` if given id invalid
     */
    function getAlignedTextInputIds(textInputId: string): string[] {

        // get text input
        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return [];
        
        const textInputIds: string[] = [];

        const pageIndex = getPartFromDocumentId(textInputId, 1);
        const textInputIndex = getPartFromDocumentId(textInputId, 3);

        // iterate columns
        for (let i = 0; i < numColumns; i++) {
            const alignedTextInputId = getDocumentId("TextInput", stringToNumber(pageIndex), i, stringToNumber(textInputIndex));
            
            if (isTextInputIdValid(alignedTextInputId))
                textInputIds.push(alignedTextInputId);
        }

        return textInputIds;
    }


    /**
     * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. textInputId). Default is selectedTextInputId
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
     * @param title singleColumnLine to display inside popup, may be a plain string
     * @param message message to display inside popup, may be a plain string
     * @param type reflects sevirity of popup and will define the style. Defualt is "Info". See {@link SubtlePopupType}.
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
        if (API_ENV !== "dev")
            removeConfirmPageUnloadEvent();

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


    /**
     * @returns false if width of window is smaller than the page width in landscape mode. See also: {@link PAGE_WIDTH_LANDSCAPE}.
     */
    function checkIsWindowWidthFitLandscape(): boolean {

        return appContext.windowSize[0] >= stringToNumber(getCSSValueAsNumber(PAGE_WIDTH_LANDSCAPE, 2));
    }


    /**
     * @returns false if width of window is smaller than the page width in landscape mode. See also: {@link PAGE_WIDTH_LANDSCAPE}.
     */
    function checkIsWindowWidthFitPortrait(): boolean {

        return appContext.windowSize[0] >= stringToNumber(getCSSValueAsNumber(PAGE_WIDTH_PORTRAIT, 2));
    }


    /**
     * @returns true if window is wide enough for page width of current orientation
     * @see {@link checkIsWindowWidthFitLandscape}
     * @see {@link checkIsWindowWidthFitPortrait}
     */
    function isWindowWidthFit(): boolean {

        if (orientation === Orientation.PORTRAIT)
            return isWindowWidthFitPortrait;

        return isWindowWidthFitLandscape;
    }


    /**
     * @param documentId to get page index and column index
     * @returns a text input id of a text input on the same page in the same column that is not a signle column line
     */
    function getNonSingleLineColumnTextInputIdInSameColumn(documentId: string): string {

        const pageIndex = stringToNumber(getPartFromDocumentId(documentId, 1));
        const columnIndex = stringToNumber(getPartFromDocumentId(documentId, 2));

        const textInputId = getDocumentId("TextInput", pageIndex, columnIndex, numSingleColumnLines);

        // case: only lingle column lines on page
        if (isTextInputSingleColumnLine(textInputId))
            return documentId;

        return textInputId;
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

                <div className={"pageContainer " + (isWindowWidthFit() ? "flexCenter" : "flexLeft") + " "}>
                    <div style={{width: orientation === Orientation.PORTRAIT ? PAGE_WIDTH_PORTRAIT : PAGE_WIDTH_LANDSCAPE}}>
                        {pages}
                    </div>
                </div>
            </DocumentContext.Provider>
        </div>
    );
}

export const DocumentContext = createContext({
    isTextInputSingleColumnLine: (textInputId?: string): boolean => {return false},
    refreshSingleColumnLines: false, 
    setRefreshSingleColumnLines: (bool: boolean) => {},

    handleFontSizeChange: (fontSizeDiff: number, textInputId?: string): boolean => {return false},
    getNumLinesDeviation: (documentId?: string, diff?: number, columnFontSizeSum?: number): number => {return 0},
    subtractMSWordFontSizes: (fontSize: number | string, fontSize2: number | string): number => {return 0},
    appendTextInputWrapper: getDefaultAppendRemoveTextInputWrapper(),
    setAppendTextInputWrapper: (appendTextInputWrapper: AppendRemoveTextInputWrapper) => {},
    removeTextInputWrapper: getDefaultAppendRemoveTextInputWrapper(),
    setRemoveTextInputWrapper: (appendTextInputWrapper: AppendRemoveTextInputWrapper) => {},

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

    focusTextInput: (textInputId: string, updateSelectedTextInputStyle?: boolean, applySelectedTextInputStyle?: boolean, stylePropsToOverride?: [StyleProp, string | number][], debug?: boolean) => {},

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