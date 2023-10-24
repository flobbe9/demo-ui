import React, { createContext, useContext, useEffect, useState } from "react";
import PageColumnLine from "./PageColumnLine";
import { getDocumentId, getPartFromDocumentId, isNumberFalsy, log, logError, logWarn, stringToNumber } from "../utils/Utils";
import { DocumentContext } from "./Document";
import { v4 as uuid } from "uuid";
import $ from "jquery";
import { PAGE_HEIGHT } from "../utils/GlobalVariables";
import TextInput from "./TextInput";
import { PageContext } from "./Page";


export default function PageColumn(props: {
    pageIndex: number;
    pageColumnIndex: number;
    initPageColumnLines?: React.JSX.Element[],
    focusOnRender?: boolean;
    className?: string;
    style?;
    children?;
}) {

    const thisId = getDocumentId("PageColumn", props.pageIndex, props.pageColumnIndex);
    const thisClassName = props.className ? "PageColumn " + props.className : "PageColumn";
    const thisContext = {
        addPageColumnLine: addPageColumnLine,
        removePageColumnLine: removePageColumnLine,
        getCurrentPageColumnLineIndex: getCurrentPageColumnLineIndex
    };

    const [pageColumnLines, setPageColumnLines] = useState(initPageColumnLines());

    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);


    // TODO: put this into a helper
    // TODO: cover case of new column
    useEffect(() => {
        const currentPageHeight = getCurrentPageHeight();
        if (!isNumberFalsy(currentPageHeight) && currentPageHeight! > PAGE_HEIGHT) {
            const lastPageColumnLineComponent = pageColumnLines[pageColumnLines.length - 1];
            const lastPageColumnLine = $("#" + getDocumentId("PageColumnLine", props.pageIndex, props.pageColumnIndex, lastPageColumnLineComponent.key!.toString()));
           
            const lastPageColumnLineComponentCopy = copyPageColumnLine(lastPageColumnLine, true);
            if (!lastPageColumnLineComponentCopy) 
                return;

            removePageColumnLine(pageColumnLines.length - 1);
            
            // case: is last page
            if (props.pageIndex === documentContext.getNumPages() - 1) {
                log("is last " + props.pageIndex)
                const newPageColumn = pageContext.createPageColumn(false, [lastPageColumnLineComponentCopy], true);
                documentContext.addPage([newPageColumn], props.pageIndex + 1);
                
            // case: is not last page
            } else {
                log("is not last " + props.pageIndex)
                const nextPageColumn = $("#" + getDocumentId("PageColumn", props.pageIndex + 1, props.pageColumnIndex));
                const nextPageColumnComponentCopy = copyPageColumn(nextPageColumn, lastPageColumnLineComponentCopy, true);
                if (nextPageColumnComponentCopy) {
                    documentContext.removePage(props.pageIndex + 1);
                    documentContext.addPage([nextPageColumnComponentCopy], props.pageIndex + 1);
                }
            }
        }
    }, [pageColumnLines]);


    function initPageColumnLines(): React.JSX.Element[] {

        return props.initPageColumnLines || [createPageColumnLine("", props.focusOnRender)];
    }


    function createPageColumnLine(defaultValue = "",
                                  focusOnRender = false,
                                  nextPage = false, 
                                  initialTextInputs?: React.JSX.Element[],
                                  key = uuid()): React.JSX.Element {

        return <PageColumnLine key={key}
                                pageIndex={nextPage ? props.pageIndex + 1 : props.pageIndex} 
                                pageColumnIndex={props.pageColumnIndex} 
                                pageColumnLineKey={key}
                                focusOnRender={focusOnRender}
                                defaultValue={defaultValue}
                                initialTextInputs={initialTextInputs} />;
    }


    // TODO pass default style as well?
    function addPageColumnLine(defaultValue = "",
                                focusOnRender = props.focusOnRender,
                                index = getCurrentPageColumnLineIndex() + 1,
                                initPageColumnLines?: React.JSX.Element[]): void {

        pageColumnLines.splice(index, 0, createPageColumnLine(defaultValue, focusOnRender, false, initPageColumnLines));

        setPageColumnLines([...pageColumnLines]);
    }


    // TODO: where to focus after remove?
    function removePageColumnLine(index = getCurrentPageColumnLineIndex()): void {

        if (index === 0)
            return;

        pageColumnLines.splice(index, 1);

        setPageColumnLines([...pageColumnLines]);
    }
    
    
    function getCurrentPageColumnLineIndex(): number {

        const currentPageColumnLineKey = getPartFromDocumentId(documentContext.currentTextInputId, 3);

        return pageColumnLines.findIndex(pageColumnLine => pageColumnLine.key === currentPageColumnLineKey);
    }

    
    function copyPageColumn(oldPageColumn: JQuery, firstPageColumnLine?: React.JSX.Element, nextPage = false): React.JSX.Element | null {

        if (!oldPageColumn.length) {
            logError("Failed to copy column line. 'oldPageColumn' is falsy");
            return null;
        }

        const newPageColumnLines: React.JSX.Element[] = [];
        if (firstPageColumnLine)
            newPageColumnLines.push(firstPageColumnLine);

        Array.from(oldPageColumn.children()).forEach(oldPageColumnLine => {
            const pageColumnLineCopy = copyPageColumnLine($("#" + oldPageColumnLine.id), nextPage);

            if (pageColumnLineCopy) 
                newPageColumnLines.push(pageColumnLineCopy);

            else 
                logWarn("Failed to copy page column. 'pageColumnLineCopy' is falsy");
        });

        const pageColumnCopy = pageContext.createPageColumn(false, newPageColumnLines, nextPage);

        return pageColumnCopy || null;
    }


    function copyPageColumnLine(oldPageColumnLine: JQuery, nextPage = false): React.JSX.Element | null {

        if (!oldPageColumnLine.length) {
            logError("Failed to copy column line. 'oldPageColumnLine' is falsy");
            return null;
        }

        const pageColumnLineKey = uuid();
        const newTextInputs: React.JSX.Element[] = [];

        Array.from(oldPageColumnLine.children()).forEach(input => {
            const oldTextInput = input as HTMLInputElement;
            let textInputCopy: React.JSX.Element;

            if (oldTextInput.className.includes("TextInput")) {
                // TODO: get style
                const textInputValue = oldTextInput.value;
                const textInputKey = uuid();

                textInputCopy = <TextInput key={textInputKey}
                                            pageIndex={nextPage ? props.pageIndex + 1 : props.pageIndex} 
                                            pageColumnIndex={props.pageColumnIndex} 
                                            pageColumnLineKey={pageColumnLineKey} 
                                            textInputKey={textInputKey} 
                                            defaultValue={textInputValue}
                                            />;
                newTextInputs.push(textInputCopy);
            }
        });

        const pageColumnLineCopy = createPageColumnLine("", false, true, newTextInputs, pageColumnLineKey);

        return pageColumnLineCopy || null;
    }


    function getPageColumnLineByKey(key: string): JQuery | null {

        const pageColumnLineId = getDocumentId("PageColumnLine", props.pageIndex, props.pageColumnIndex, key);
        const pageColumnLine = $("#" + pageColumnLineId);

        if (!pageColumnLine.length)
            return null;

        return pageColumnLine;
    }


    function getCurrentPageHeight(): number | null {

        let currentPageHeight = 0;

        pageColumnLines.forEach(pageColumnLineComponent => {
            const pageColumnLine = getPageColumnLineByKey(pageColumnLineComponent.key!.toString());
            if (!pageColumnLine)
                return null;

            const pageColumnLineElement = $("#" + pageColumnLine.prop("id"))!;
            const pageColumnLineHeight = stringToNumber(pageColumnLineElement.css("height"));

            currentPageHeight += pageColumnLineHeight;
        });

        return currentPageHeight;
    }


    function movePageColumnLineToNewPage(pageColumnLineComponent: React.JSX.Element): void {
        // get by key
        // pageColumneLine.prop("id", )
        // get id
        // get element
        // set id
        // add new page with default
    }


    return (
        <div id={thisId}
            className={thisClassName}
            style={props.style}
        >
            <PageColumnContext.Provider value={thisContext}>
                {pageColumnLines}
            </PageColumnContext.Provider>

            {props.children}
        </div>
    );
}

export const PageColumnContext = createContext({
    addPageColumnLine: (defaultValue?: string, focusOnRender?: boolean, index?: number, initialPageColumnLines?: React.JSX.Element[]) => {},
    removePageColumnLine: (index?: number) => {},
    getCurrentPageColumnLineIndex: () => {}
})