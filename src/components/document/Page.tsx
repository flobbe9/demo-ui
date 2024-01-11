import React, { useContext, useEffect, useState, createContext } from "react";
import "../../assets/styles/Page.css";
import Column from "./Column";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getRandomString, includesIgnoreCase, log, logWarn } from "../../utils/basicUtils";
import { MAX_NUM_COLUMNS, SINGLE_COLUMN_LINE_CLASS_NAME } from "../../globalVariables";
import { DocumentContext } from "./Document";
import Paragraph from "./Paragraph";
import { getDocumentId } from "../../utils/documentBuilderUtils";


export default function Page(props: {
    pageIndex: number,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = getDocumentId("Page", props.pageIndex, props.id);
    let className = props.className ? "Page " + props.className : "Page";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [columns, setColumns] = useState(initColumns());
    const [linesAsSingleColumn, setLinesAsSingleColumn] = useState<React.JSX.Element[]>([]);
    const [orientationClassName, setOrientationClassName] = useState(documentContext.orientation === "portrait" ? "pagePortrait" : "pageLandscape");

    const context = {
        connectColumnLines,
        disconnectColumnLine,
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


    function connectColumnLines(lineIndex: number): void {

        // case: no columns to connect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        // hide column text inputs 
        const textInputsToBeConnected = getNthTextInputOfAllColumnsOfPage(lineIndex, 0); // only works because there's one text input per paragraph
        textInputsToBeConnected.forEach((textInput, i) => 
            disableTextInput(textInput, i, lineIndex));
        
        documentContext.setNumLinesAsSingleColumn(documentContext.numLinesAsSingleColumn + 1);

        // add singleColumnLine
        setLinesAsSingleColumn([...linesAsSingleColumn, createSingleColumnLine(lineIndex)]);

        refreshSingleColumnLines();
    }


    function disconnectColumnLine(lineIndex: number): void {

        // case: no columns to connect
        if (documentContext.numColumns === 1 && props.pageIndex !== 0)
            return;

        for (let i = 0; i < documentContext.numColumns; i++)
            // only works because there's one text input per paragraph
            enableTextInput(i, lineIndex, 0);

        documentContext.setNumLinesAsSingleColumn(documentContext.numLinesAsSingleColumn - 1);

        // remove last singleColumn line
        linesAsSingleColumn.pop();
        setLinesAsSingleColumn([...linesAsSingleColumn]);

        refreshSingleColumnLines();
    }


    /**
     * Set refreshSingleColumnLines state in order for all ```<TextInput />``` components to check their isHedingCandidate state
     * @returns the new state of refreshSingleColumnLines (technically irrelevant)
     */
    function refreshSingleColumnLines(): boolean {

        documentContext.setRefreshSingleColumnLines(!documentContext.refreshSingleColumnLines);

        return !documentContext.refreshSingleColumnLines;
    }


    // TODO
    function toggleConnectWarnPopup(): void {

        // const warnPopup = 
            // <Popup id={warnPopupId} className="warnPopupContainer" height="small" width="medium" style={{display: "none"}}>
            //     <PopupWarnConfirm handleConfirm={handleSubmit} 
            //                         handleDecline={() => hideGlobalPopup(appContext.setPopupContent)}
            //                         hideThis={toggleWarnPopup}
            //                         >
            //         <p className="textCenter">Der Inhalt dieser Zeile wird <strong>gelöscht</strong> werden.</p>
            //         <p className="textCenter">Fortfahren?</p>
            //     </PopupWarnConfirm>
            // </Popup>
        
    }


    function disableTextInput(textInput: JQuery, columnIndex: number, paragraphIndex = 0): JQuery {

        if (!textInput.length) {
            logWarn("'sortOutTextInput()' failed. 'textInput' is falsy");
            return textInput;
        }

        // set invalid id
        textInput.prop("id", getDocumentId("TextInput", props.pageIndex, "", columnIndex, paragraphIndex, -1));

        // classes
        textInput.addClass("hidden");
        textInput.removeClass("TextInput");
        textInput.removeClass("textInputFocus");

        return textInput;
    }


    // TODO: 
    function enableTextInput(columnIndex: number, paragraphIndex: number, textInputIndex: number): JQuery {

        // find the hidden text input in same paragraph
        const hiddenTextInputId = getDocumentId("TextInput", props.pageIndex, "", columnIndex, paragraphIndex, -1);
        const hiddenTextInput = $("#" + hiddenTextInputId);

        // case: no hidden text input in this paragraph
        if (!hiddenTextInput.length) {
            logWarn("'enableTextInput()' failed. Did not find hidden textInput with id " + hiddenTextInputId);
            return hiddenTextInput;
        }

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

        // hide connect icon of text inputs
        if (!includesIgnoreCase(targetClassName, "dontHideConnectIcon"))
            $(".connectIcon").fadeOut(100);
    }


    return (
        <div id={id} 
             className={className + " " + orientationClassName} 
             style={props.style}
             onMouseMove={handleMouseMove}
             >
            <PageContext.Provider value={context}>
                <div className="headingContainer">
                    {linesAsSingleColumn}
                </div>

                <div className="columnContainer">
                    {columns}
                </div>
            </PageContext.Provider>
        </div>
    )
}

export const PageContext = createContext();