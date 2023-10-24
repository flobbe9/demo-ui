import React, { createContext, useContext, useEffect, useState } from "react";
import "../assets/styles/Page.css";
import { DocumentContext } from "./Document";
import PageColumn from "./PageColumn";
import {v4 as uuid} from "uuid";
import { getPartFromDocumentId, log, logError, stringToNumber } from "../utils/Utils";
import { MAX_NUM_TEXTINPUTS_LADNSCAPE, MAX_NUM_TEXTINPUTS_PORTRAIT, getTextInputWidth, setTextInputWidth } from "../utils/GlobalVariables";
import { Orientation } from "../enums/Orientation";
import $ from "jquery";


// TODO: add initialPageColumns[] prop
// TODO: add initPageColumns method (for all others too) and either create new component or set init array
export default function Page(props: {
    pageIndex: number,
    initialPageColumns?: React.JSX.Element[],
    focusOnRender: boolean,
    className?: string,
    style?,
    children?
}) {

    const thisId = "Page_" + props.pageIndex;
    const thisClassName = "Page " + props.className;
    
    const documentContext = useContext(DocumentContext);
    
    const [pageColumns, setPageColumns] = useState(initPageColumns());
    const [maxNumTextInputsPerLine, setMaxNumTextInputsPerLine] = useState(MAX_NUM_TEXTINPUTS_PORTRAIT);
    
    const thisContext = {
        createPageColumn: createPageColumn,
        maxNumTextInputsPerLine: maxNumTextInputsPerLine
    }


    useEffect(() => {
        // TODO: add condition for num page columns, currently assuming 1 PageColumn
        let maxNumTextInputs = documentContext.orientation === Orientation.PORTRAIT ? MAX_NUM_TEXTINPUTS_PORTRAIT : MAX_NUM_TEXTINPUTS_LADNSCAPE;
        setMaxNumTextInputsPerLine(maxNumTextInputs);
        setTextInputWidth(100 / maxNumTextInputs);

        // set css variables
        $(":root").attr("style", `--textInputWidth: ${getTextInputWidth()}%`);
        
    }, [documentContext.orientation, pageColumns]);


    function initPageColumns(): React.JSX.Element[] {

        return props.initialPageColumns || [createPageColumn(props.focusOnRender)]
    }

    
    function createPageColumn(focusOnRender = false, 
                              initPageColumnLines?: React.JSX.Element[], 
                              nextPage = false, 
                              index = getCurrentPageColumnIndex()): React.JSX.Element {

        const key = uuid();

        return <PageColumn key={key}
                           pageIndex={nextPage? props.pageIndex + 1 : props.pageIndex}
                           pageColumnIndex={index}
                           focusOnRender={focusOnRender} 
                           initPageColumnLines={initPageColumnLines}/>;
    }


    function addPageColumn(index = getCurrentPageColumnIndex(), 
                           focusOnRender = false,
                           initialPageColumnLines?: React.JSX.Element[]): void {

        pageColumns.splice(index, 0, createPageColumn(focusOnRender, initialPageColumnLines));

        setPageColumns([...pageColumns]);
    }


    function removePageColumn(index = getCurrentPageColumnIndex()): void {
        // TODO: what to do with content?

        pageColumns.splice(index, 1);

        setPageColumns([...pageColumns]);
    }


    function getCurrentPageColumnIndex(): number {

        const currentPageColumnIndex = getPartFromDocumentId(documentContext.currentTextInputId, 2);

        if (typeof currentPageColumnIndex === "string")
            return stringToNumber(currentPageColumnIndex);

        return currentPageColumnIndex;
    }


    return (
        <div id={thisId}
             className={thisClassName}
             style={props.style}
             >
            <PageContext.Provider value={thisContext}>
                {pageColumns}
            </PageContext.Provider>

            {props.children}
        </div>
    )
}


export const PageContext = createContext({
    createPageColumn: (focusOnRender?: boolean, initialPageColumnLines?: React.JSX.Element[], nextPage?: boolean, index?: number): React.JSX.Element => {return <></>},
    maxNumTextInputsPerLine: MAX_NUM_TEXTINPUTS_PORTRAIT
});