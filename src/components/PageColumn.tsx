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
    cursorAtLastChar?: boolean,
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


    // TODO: cover case of new column
    useEffect(() => {
        const currentPageHeight = getCurrentPageHeight();
        if (!isNumberFalsy(currentPageHeight) && currentPageHeight! > PAGE_HEIGHT) 
            handlePageColumnLineChange();
        
    }, [pageColumnLines]);


    function initPageColumnLines(): React.JSX.Element[] {

        return props.initPageColumnLines || [createPageColumnLine("", props.focusOnRender, props.cursorAtLastChar)];
    }


    function createPageColumnLine(defaultValue = "",
                                  focusOnRender = false,
                                  cursorAtLastChar = false,
                                  nextPage = false, 
                                  initialTextInputs?: React.JSX.Element[],
                                  key = uuid()): React.JSX.Element {

                                    log(props.pageIndex)
        return <PageColumnLine key={key}
                                pageIndex={nextPage ? props.pageIndex + 1 : props.pageIndex} 
                                pageColumnIndex={props.pageColumnIndex} 
                                pageColumnLineKey={key}
                                focusOnRender={focusOnRender}
                                cursorAtLastChar={cursorAtLastChar}
                                defaultValue={defaultValue}
                                initialTextInputs={initialTextInputs} />;
    }


    // TODO pass default style as well?
    function addPageColumnLine(defaultValue = "",
                                focusOnRender = props.focusOnRender,
                                cursorAtLastChar = false,
                                nextPage = false,
                                index = getCurrentPageColumnLineIndex() + 1,
                                initPageColumnLines?: React.JSX.Element[]): void {

        pageColumnLines.splice(index, 0, createPageColumnLine(defaultValue, focusOnRender, cursorAtLastChar, nextPage, initPageColumnLines));

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

    
    function copyPageColumn(oldPageColumn: JQuery, 
                            firstPageColumnLine?: React.JSX.Element, 
                            focusOnRender = false, 
                            cursorAtLastChar = false,
                            nextPage = false): React.JSX.Element | null {

        if (!oldPageColumn.length) {
            logError("Failed to copy column line. 'oldPageColumn' is falsy");
            return null;
        }

        const newPageColumnLines: React.JSX.Element[] = [];
        if (firstPageColumnLine)
            newPageColumnLines.push(firstPageColumnLine);

        Array.from(oldPageColumn.children()).forEach(oldPageColumnLine => {
            const pageColumnLineCopy = copyPageColumnLine($("#" + oldPageColumnLine.id), focusOnRender, cursorAtLastChar, nextPage);

            if (pageColumnLineCopy) 
                newPageColumnLines.push(pageColumnLineCopy);

            else 
                logWarn("Failed to copy page column. 'pageColumnLineCopy' is falsy");
        });

        const pageColumnCopy = pageContext.createPageColumn(false, cursorAtLastChar, newPageColumnLines, nextPage);

        return pageColumnCopy || null;
    }


    function copyPageColumnLine(oldPageColumnLine: JQuery, 
                                focusOnRender = false, 
                                cursorAtLastChar = false, 
                                nextPage = false): React.JSX.Element | null {

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
                                            focusOnRender={focusOnRender}
                                            cursorAtLastChar={cursorAtLastChar}
                                            />;
                newTextInputs.push(textInputCopy);
            }
        });

        const pageColumnLineCopy = createPageColumnLine("", false, cursorAtLastChar, true, newTextInputs, pageColumnLineKey);

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


    /**
     * Handles change of {@code pageColumnLine} state, in other words, adding or removing a new line.
     */
    function handlePageColumnLineChange(): void {

        const lastPageColumnLineComponent = pageColumnLines[pageColumnLines.length - 1];
        const lastPageColumnLine = $("#" + getDocumentId("PageColumnLine", props.pageIndex, props.pageColumnIndex, lastPageColumnLineComponent.key!.toString()));
        
        // focus on new page if is last line
        const focusOnNewPage = getCurrentPageColumnLineIndex() + 1 === pageColumnLines.length - 1;
       
        // copy this line
        const lastPageColumnLineComponentCopy = copyPageColumnLine(lastPageColumnLine, focusOnNewPage, true, true);
        if (!lastPageColumnLineComponentCopy) 
            return;

        // remove this line
        removePageColumnLine(pageColumnLines.length - 1);
        
        // case: is last page
        if (props.pageIndex === documentContext.getNumPages() - 1) {
            // add new page with copied line
            const newPageColumn = pageContext.createPageColumn(focusOnNewPage, props.cursorAtLastChar, [lastPageColumnLineComponentCopy], true);
            documentContext.addPage([newPageColumn]);
            
        // case: is not last page
        } else {
            // replace next page with cpied line as first element
            const nextPageColumn = $("#" + getDocumentId("PageColumn", props.pageIndex + 1, props.pageColumnIndex));
            const nextPageColumnComponentCopy = copyPageColumn(nextPageColumn, lastPageColumnLineComponentCopy, false, props.cursorAtLastChar, false);
            if (nextPageColumnComponentCopy) {
                documentContext.removePage(props.pageIndex + 1);
                documentContext.addPage([nextPageColumnComponentCopy]);
            }
        }
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
    addPageColumnLine: (defaultValue?: string, 
                        focusOnRender?: boolean, 
                        cursorAtLastChar?: boolean, 
                        nextPage?: boolean,
                        index?: number, 
                        initialPageColumnLines?: React.JSX.Element[]) => {},
    removePageColumnLine: (index?: number) => {},
    getCurrentPageColumnLineIndex: () => {}
})