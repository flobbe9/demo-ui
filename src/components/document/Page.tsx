import React, { useContext, useEffect, useState, createContext, useRef } from "react";
import useCookie from "react-use-cookie";
import "../../assets/styles/Page.css";
import Column from "./Column";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getJQueryElementById, getRandomString, includesIgnoreCase, log, logWarn, stringToNumber } from "../../utils/basicUtils";
import { DONT_SHOW_AGAIN_COOKIE_NAME, MAX_NUM_COLUMNS, PAGE_WIDTH_LANDSCAPE, PAGE_WIDTH_PORTRAIT, SINGLE_COLUMN_LINE_CLASS_NAME } from "../../globalVariables";
import { DocumentContext } from "./Document";
import Paragraph from "./Paragraph";
import { getCSSValueAsNumber, getDocumentId, isTextInputIdValid } from "../../utils/documentBuilderUtils";
import { Orientation } from "../../enums/Orientation";
import Popup from "../helpers/popups/Popup";
import PopupWarnConfirm from "../helpers/popups/PopupWarnConfirm";


export default function Page(props: {
    pageIndex: number,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = getDocumentId("Page", props.pageIndex, props.id);
    let className = props.className ? "Page " + props.className : "Page";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [columns, setColumns] = useState(initColumns());
    const [linesAsSingleColumn, setLinesAsSingleColumn] = useState<React.JSX.Element[]>([]);
    const [orientationClassName, setOrientationClassName] = useState(documentContext.orientation === "portrait" ? "pagePortrait" : "pageLandscape");

    const dontShowAgainConnectWarningCookieId = useRef("ConnectLinesWarning");
    const [dontShowAgainConnectWarningCookie, setDontShowAgainConnectWarningCookie] = useCookie(DONT_SHOW_AGAIN_COOKIE_NAME + dontShowAgainConnectWarningCookieId.current, "false");

    const pageRef = useRef(null);

    const context = {
        toggleConnectWarnPopup,
    }


    function initColumns(): React.JSX.Element[] {

        // case: invalid num columns
        if (documentContext.numColumns > MAX_NUM_COLUMNS || documentContext.numColumns < 1)
            return [<Column key={0} pageIndex={props.pageIndex} columnIndex={0}/>];

        const columns: React.JSX.Element[] = [];

        for (let i = 0; i < documentContext.numColumns; i++) 
            columns.push(<Column key={i} pageIndex={props.pageIndex} columnIndex={i}/>);

        return columns;
    }


    /**
     * Disable (and hide) lines with given lineIndex in all columns of page and add a singleColunnLine in Document component instead. <p>
     * 
     * Currently only possible on first page.
     * 
     * @param lineIndex index of lines to connect on a page
     */
    function connectColumnLines(lineIndex: number): void {

        // case: no columns to connect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        // hide column text inputs 
        const textInputsToBeConnected = getNthTextInputOfAllColumnsOfPage(lineIndex, 0); // only works because there's one text input per paragraph
        textInputsToBeConnected.forEach((textInput, i) => 
            disableTextInput(textInput, i, lineIndex));
        
        documentContext.setNumSingleColumnLines(documentContext.numSingleColumnLines + 1);

        // add singleColumnLine
        setLinesAsSingleColumn([...linesAsSingleColumn, createSingleColumnLine(lineIndex)]);

        // set state in order for singleColumnLines to render
        refreshSingleColumnLines();
    }


    /**
     * Remove a singleColumnLine from state in Document component and enable all TextInputs with given lineIndex that were disabled.
     * 
     * @param lineIndex index of line to split into separate text inputs 
     */
    function disconnectColumnLine(lineIndex: number): void {

        // case: no columns to connect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        for (let i = 0; i < documentContext.numColumns; i++)
            // only works because there's one text input per paragraph
            enableTextInput(i, lineIndex, 0);

        documentContext.setNumSingleColumnLines(documentContext.numSingleColumnLines - 1);

        // remove last singleColumn line
        linesAsSingleColumn.pop();
        setLinesAsSingleColumn([...linesAsSingleColumn]);

        // set state in order for singleColumnLines to render
        refreshSingleColumnLines();
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


    function toggleConnectWarnPopup(lineIndex: number, disconnect = false): void {  
        
        // define confirm callback
        const handleConfirm = () => {
            disconnect ? disconnectColumnLine(lineIndex) : connectColumnLines(lineIndex);
            documentContext.hidePopup()
        }

        // dont show popup
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
                    <p className="textCenter">Der Inhalt dieser Zeile wird <strong>gelöscht</strong> werden.</p>
                    <p className="textCenter">Fortfahren?</p>
                </PopupWarnConfirm>
            </Popup>
        );
    }


    /**
     * Remove 'TextInput' class from given ```<TextInput />``` and hide it, sothat it is not considered by any other 
     * code as 'TextInput' (see also: {@link enableTextInput()}).
     * 
     * @param textInput to disable
     * @param columnIndex of new invalid id
     * @param paragraphIndex of new invalid id
     * @returns the disabled text input or null if textInput param not present
     */
    function disableTextInput(textInput: JQuery, columnIndex: number, paragraphIndex = 0): JQuery | null {

        if (!isTextInputIdValid(textInput.prop("id"))) {
            logWarn("'sortOutTextInput()' failed. 'textInput' is invalid");
            return null;
        }

        // set invalid id
        textInput.prop("id", getDocumentId("TextInput", props.pageIndex, "", columnIndex, paragraphIndex, -1));

        // classes
        textInput.addClass("hidden");
        textInput.removeClass("TextInput");
        textInput.removeClass("textInputFocus");

        return textInput;
    }


    /**
     * Finds ```<TextInput />``` component on this page with id of given params that is hidden and adds/removes neccessary
     * classes for the text input to become valid again (see also {@link disableTextInput()}).
     * 
     * @param columnIndex of column with the disabled text input
     * @param paragraphIndex of paragraph with the disabled text input
     * @param textInputIndex of the disabled text input
     * @returns the enabled text input that was disabled before or null if not found
     */
    function enableTextInput(columnIndex: number, paragraphIndex: number, textInputIndex: number): JQuery | null {

        // find the hidden text input in same paragraph
        const hiddenTextInputId = getDocumentId("TextInput", props.pageIndex, "", columnIndex, paragraphIndex, -1);
        const hiddenTextInput = getJQueryElementById(hiddenTextInputId);
        if (!hiddenTextInput)
            return null;

        // set valid id
        const textInputId = getDocumentId("TextInput", props.pageIndex, "", columnIndex, paragraphIndex, textInputIndex);
        hiddenTextInput.prop("id", textInputId);

        // restore classes
        hiddenTextInput.addClass("TextInput");
        hiddenTextInput.removeClass(SINGLE_COLUMN_LINE_CLASS_NAME)
        hiddenTextInput.removeClass("hidden");

        return hiddenTextInput;
    }


    function createSingleColumnLine(paragraphIndex: number): React.JSX.Element {

        return (
            <Paragraph pageIndex={props.pageIndex} 
                       columnIndex={0} 
                       // only works because there's one text input per paragraph
                       paragraphIndex={paragraphIndex} 
                       key={getRandomString()}
                       textInputClassName={SINGLE_COLUMN_LINE_CLASS_NAME}
                       isTextInputSingleLineColumn={true}
            />
        )
    }


    /**
     * @returns jquery of the first ```<TextInput />``` of each ```<Column />``` on this page.
     */
    function getNthTextInputOfAllColumnsOfPage(paragraphIndex = 0, textInputIndex = 0): JQuery[] {

        const textInputsToBeConnected: JQuery[] = [];

        for (let i = 0; i < documentContext.numColumns; i++) {
            const textInput = $("#" + getDocumentId("TextInput", props.pageIndex, "", i, paragraphIndex, textInputIndex));
            if (textInput.length)
                textInputsToBeConnected.push(textInput);
        }

        return textInputsToBeConnected;
    }


    function handleMouseMove(event): void {

        const targetClassName = event.target.className;

        // hide connect / disconnect icon of text inputs
        if (!includesIgnoreCase(targetClassName, "dontHideConnectIcon"))
            $(".connectOrDisconnectButton.dontHideConnectIcon").hide();

        if (!includesIgnoreCase(targetClassName, "dontHideDisConnectIcon"))
            $(".connectOrDisconnectButton.dontHideDisConnectIcon").hide();
    }


    return (
        <div id={id} 
             className={className + " " + orientationClassName} 
             ref={pageRef}
             style={props.style}
             onMouseMove={handleMouseMove}
             >
            <PageContext.Provider value={context}>
                <div style={{width: "100%"}}>
                    <div className="headingContainer">
                        {linesAsSingleColumn}
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
    toggleConnectWarnPopup: (lineIndex: number, disconnect?: boolean) => {}
});