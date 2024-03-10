import React, { useContext, useState, createContext, useRef, useEffect } from "react";
import useCookie from "react-use-cookie";
import "../../assets/styles/Page.css";
import Column from "./Column";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getJQueryElementById, getRandomString, includesIgnoreCaseTrim, log, logWarn, stringToNumber } from "../../utils/basicUtils";
import { DEFAULT_FONT_SIZE, DONT_SHOW_AGAIN_COOKIE_NAME, MAX_NUM_COLUMNS, MAX_NUM_SINGLE_COLUMN_LINES, SINGLE_COLUMN_LINE_CLASS_NAME } from "../../globalVariables";
import { DocumentContext } from "./Document";
import { appendCustumIdToDocumentId, getBrowserFontSizeByMSWordFontSize, getDocumentId, getPartFromDocumentId, isTextInputIdValid } from "../../utils/documentBuilderUtils";
import Popup from "../popups/Popup";
import PopupWarnConfirm from "../popups/PopupWarnConfirm";
import { applyTextInputStyle, getDefaultStyle } from "../../abstract/Style";
import TextInput from "./TextInput";


/**
 * @since 0.0.1
 */
export default function Page(props: {
    pageIndex: number,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = getDocumentId("Page", props.pageIndex, NaN, NaN, props.id);
    let className = props.className ? "Page " + props.className : "Page";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [columns, setColumns] = useState<React.JSX.Element[]>([]);
    const [singleColumnLines, setSingleColumnLines] = useState<React.JSX.Element[]>([]);

    const dontShowAgainConnectWarningCookieId = useRef("ConnectLinesWarning");
    const [dontShowAgainConnectWarningCookie, setDontShowAgainConnectWarningCookie] = useCookie(DONT_SHOW_AGAIN_COOKIE_NAME + dontShowAgainConnectWarningCookieId.current, "false");

    const pageRef = useRef(null);

    const context = {
        handleConnectDisconnectTextInput,
    }


    useEffect(() => {
        setColumns(initColumns());

    }, [])


    useEffect(() => {
        // reset columns
        resetColumns();
        resetSingleColumnLines();
            
    }, [documentContext.refreshColumns])


    function initColumns(): React.JSX.Element[] {

        // case: invalid num columns
        if (documentContext.numColumns > MAX_NUM_COLUMNS || documentContext.numColumns < 1)
            return [<Column key={0} pageIndex={props.pageIndex} columnIndex={0}/>];

        const columns: React.JSX.Element[] = [];

        for (let i = 0; i < documentContext.numColumns; i++) 
            columns.push(<Column key={i} pageIndex={props.pageIndex} columnIndex={i}/>);

        return columns;
    }

    
    function resetSingleColumnLines(): void {

        setSingleColumnLines([]);
        documentContext.setNumSingleColumnLines(0);
    }


    function resetColumns(): void {

        setColumns([...initColumns()]);
    }

    
    /**
     * Toggle warn popup (if 'dontShowAgain' is not selected) and connect or disconnect text input with given id.
     * 
     * @param textInputId of the single column line in case of disconnect (in case of connect it doesn't matter)
     * @param disconnect if true, disconnect handler will be called with given text input id, else the connect handler is called
     */
    function handleConnectDisconnectTextInput(textInputId: string, disconnect = false): void {

        const textInputIndex = stringToNumber(getPartFromDocumentId(textInputId, 3));
        
        // define confirm callback
        const handleConfirm = () => {
            disconnect ? disconnectColumnLine(textInputIndex, textInputId) : connectColumnLines(textInputIndex);
            documentContext.hidePopup()
        }

        // case: dont show again was selected
        if (dontShowAgainConnectWarningCookie === "true") {
            handleConfirm();
            return;
        }

        documentContext.togglePopup();

        documentContext.setPopupContent(
            <Popup id={dontShowAgainConnectWarningCookieId.current} height={appContext.isMobileView ? "350px" : "medium"} width="medium">
                <PopupWarnConfirm id={dontShowAgainConnectWarningCookieId.current}
                                    handleConfirm={handleConfirm} 
                                    handleDecline={documentContext.hidePopup}
                                    hideThis={documentContext.hidePopup}
                                    displayDontShowAgainCheckbox={true}
                                    checkboxContainerClassname="flexCenter mt-5"
                                    setDontShowAgainCookie={setDontShowAgainConnectWarningCookie}
                                    >
                    <p className="textCenter">Der Inhalt dieser Zeile wird in allen Spalten <strong>gelöscht</strong> werden.</p>
                    <p className="textCenter">Fortfahren?</p>
                </PopupWarnConfirm>
            </Popup>
        );
    }


    /**
     * Disable (and hide) lines with given textInputIndex in all columns of page and add a singleColunnLine in Document component instead. <p>
     * 
     * Currently only possible on first page.
     * 
     * @param textInputIndex index of lines to connect on a page
     */
    function connectColumnLines(textInputIndex: number): void {

        // case: no columns to connect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        // case: max num single column lines reached
        if (documentContext.numSingleColumnLines === MAX_NUM_SINGLE_COLUMN_LINES)
            return;
        
        const textInputsToBeConnected = getNthTextInputsInAllColumnsOfPage(textInputIndex);
        let focusedTextInputId: string | undefined;
        
        // disable text inputs
        textInputsToBeConnected.forEach((textInput, i) => {
            const textInputId = textInput.prop("id");
            // case: was focused
            if (documentContext.selectedTextInputId === textInputId) {
                focusedTextInputId = textInputId;
                // reset selected style
                documentContext.setSelectedTextInputStyle(getDefaultStyle());
            }

            // handle possible font size change
            const fontSizeDiff = documentContext.subtractMSWordFontSizes(getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE), $("#" + textInputId).css("fontSize"));
            documentContext.handleFontSizeChange(fontSizeDiff, textInputId);

            disableTextInput(textInput);
        });

        documentContext.setNumSingleColumnLines(documentContext.numSingleColumnLines + 1);

        // add singleColumnLine
        setSingleColumnLines([...singleColumnLines, createSingleColumnLine(textInputIndex, Boolean(focusedTextInputId))]);

        // set state in order for singleColumnLines to render
        refreshSingleColumnLines();
    }
    

    /**
     * Remove 'TextInput' class from given ```<TextInput />``` and hide it, sothat it is not considered by any other 
     * code as 'TextInput' (see also: {@link enableTextInput()}).
     * 
     * Set selected textinput id from document context to ```""```.
     * Also reset styles and value of hidden text input.
     * 
     * @param textInputToDisable to disable
     * @returns the disabled text input or null if textInputToDisable param not present
     */
    function disableTextInput(textInputToDisable: JQuery): JQuery | null {

        if (!isTextInputIdValid(textInputToDisable.prop("id"))) {
            logWarn("'sortOutTextInput()' failed. 'textInputToDisable' is invalid");
            return null;
        }

        const textInputToDisableId = textInputToDisable.prop("id");

        // disable text input
        textInputToDisable.prop("id", appendCustumIdToDocumentId(textInputToDisableId, "disabled"));
        textInputToDisable.addClass("hidden");
        textInputToDisable.removeClass("TextInput");
        textInputToDisable.removeClass("textInputFocus");
        textInputToDisable.removeClass("textInputLeftColumnConnect");
        textInputToDisable.removeClass("textInputMiddleColumnConnect");
        textInputToDisable.removeClass("textInputRightColumnConnect");

        textInputToDisable.val("");

        applyTextInputStyle(textInputToDisableId, getDefaultStyle());

        return textInputToDisable;
    }


    /**
     * Remove a singleColumnLine from state in Document component and enable all TextInputs with given textInputIndex that were disabled.
     * 
     * @param textInputIndex index of line to split into separate text inputs 
     * @param singleColumnLineId id of the single column line text input
     */
    function disconnectColumnLine(textInputIndex: number, singleColumnLineId: string): void {

        // case: no columns to disconnect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        const fontSizeDiff = documentContext.subtractMSWordFontSizes(getBrowserFontSizeByMSWordFontSize(DEFAULT_FONT_SIZE), $("#" + singleColumnLineId).css("fontSize"));
        documentContext.handleFontSizeChange(fontSizeDiff, singleColumnLineId);

        const lastSingleColumnLineWasFocused = getLastSingleColumnLine()?.className.includes("textInputFocus");
        for (let i = 0; i < documentContext.numColumns; i++) {
            enableTextInput(i, textInputIndex);

            // case: singleColumnLine was focused
            if (lastSingleColumnLineWasFocused && i === 0) {
                // focus enabled text input in first column
                documentContext.focusTextInput(getDocumentId("TextInput", props.pageIndex, i, textInputIndex))
                // reset selected text input style
                documentContext.setSelectedTextInputStyle(getDefaultStyle());
            }
        }

        documentContext.setNumSingleColumnLines(documentContext.numSingleColumnLines - 1);

        // remove last singleColumn line
        singleColumnLines.pop();
        setSingleColumnLines([...singleColumnLines]);

        // set state in order for singleColumnLines to render
        refreshSingleColumnLines();
    }


    /**
     * Finds ```<TextInput />``` component on this page with id of given params that is hidden and adds/removes neccessary
     * classes for the text input to become valid again (see also {@link disableTextInput()}).
     * Also reset styles of hidden text input.
     * 
     * @param columnIndex of column with the disabled text input
     * @param textInputIndex of the disabled text input
     * @returns the enabled text input that was disabled before or null if not found
     */
    function enableTextInput(columnIndex: number, textInputIndex: number): JQuery | null {

        // find the hidden text input
        const hiddenTextInputId = getDocumentId("TextInput", props.pageIndex, columnIndex, textInputIndex, "disabled");
        const hiddenTextInput = getJQueryElementById(hiddenTextInputId);
        if (!hiddenTextInput)
            return null;

        applyTextInputStyle(hiddenTextInputId, getDefaultStyle());

        // enable text input
        const textInputId = getDocumentId("TextInput", props.pageIndex, columnIndex, textInputIndex);
        hiddenTextInput.prop("id", textInputId);
        hiddenTextInput.addClass("TextInput");
        hiddenTextInput.removeClass("hidden");
        hiddenTextInput.removeClass(SINGLE_COLUMN_LINE_CLASS_NAME);

        return hiddenTextInput;
    }


    /**
     * Set refreshSingleColumnLines state in order for all ```<TextInput />``` components to check their isHedingCandidate state.
     * 
     * @returns the new state of refreshSingleColumnLines (technically irrelevant)
     */
    function refreshSingleColumnLines(): boolean {

        documentContext.setRefreshSingleColumnLines(!documentContext.refreshSingleColumnLines);

        return !documentContext.refreshSingleColumnLines;
    }

    
    function getLastSingleColumnLine(): HTMLElement | null {

        const singleColumnLines = $("." + SINGLE_COLUMN_LINE_CLASS_NAME);

        // case: no singleColumnLines at all
        if (!singleColumnLines.length)
            return null;

        return singleColumnLines.get(singleColumnLines.length - 1) || null;
    }


    function createSingleColumnLine(textInputIndex: number, focusFirstTextInputOnRender = false): React.JSX.Element {

        return (
            <TextInput key={getRandomString()}
                       pageIndex={props.pageIndex} 
                       columnIndex={0} 
                       textInputIndex={textInputIndex} 
                       isSingleColumnLine={true}
                       className={SINGLE_COLUMN_LINE_CLASS_NAME + " lastSingleColumnLine "}
                       focusOnRender={focusFirstTextInputOnRender} />
        )
    }


    /**
     * @param n index of the text input inside it's ```<Column />```
     * @returns list of jquerys of ```<TextInput />```s on this page with same text input index for each ```<Column />```.
     */
    function getNthTextInputsInAllColumnsOfPage(n = 0): JQuery[] {

        const textInputsToBeConnected: JQuery[] = [];

        for (let i = 0; i < documentContext.numColumns; i++) {
            const textInput = $("#" + getDocumentId("TextInput", props.pageIndex, i, n));
            if (textInput.length)
                textInputsToBeConnected.push(textInput);
        }

        return textInputsToBeConnected;
    }


    function handleMouseMove(event): void {

        const targetClassName = event.target.className;

        // hide connect icon
        if (!includesIgnoreCaseTrim(targetClassName, "dontHideConnectIcon"))
            $(".connectOrDisconnectButton.dontHideConnectIcon").hide(100);

        // hide disconnect icon
        if (!includesIgnoreCaseTrim(targetClassName, "dontHideDisConnectIcon"))
            $(".connectOrDisconnectButton.dontHideDisConnectIcon").hide(100);
    }


    return (
        <div id={id} 
             className={className + " " + (documentContext.orientation === "portrait" ? "pagePortrait" : "pageLandscape")} 
             ref={pageRef}
             style={props.style}
             onMouseMove={handleMouseMove}
             >
            <PageContext.Provider value={context}>
                <div style={{width: "100%"}}>
                    <div className="headingContainer">
                        {singleColumnLines}
                    </div>

                    <div className="columnContainer">
                        {columns}
                    </div>
                </div>
            </PageContext.Provider>
        </div>
    )
}

export const PageContext = createContext({
    handleConnectDisconnectTextInput: (textInputId: string, disconnect?: boolean) => {}
});