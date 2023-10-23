import React, { createContext, useContext, useEffect, useState } from "react";
import PageColumnLine from "./PageColumnLine";
import { getDocumentId, getPartFromDocumentId, isNumberFalsy, log, logError, logWarn, stringToNumber } from "../utils/Utils";
import { DocumentContext } from "./Document";
import { v4 as uuid } from "uuid";
import $ from "jquery";
import { PAGE_HEIGHT } from "../utils/GlobalVariables";
import TextInput from "./TextInput";
import { PageContext } from "./Page";


// TODO: add initialPageColumnLines[] prop
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


    useEffect(() => {
        const currentPageHeight = getCurrentPageHeight();
        if (!isNumberFalsy(currentPageHeight) && currentPageHeight! > PAGE_HEIGHT) {
            // TODO: cover case of new column
            const lastPageColumnLineComponent = pageColumnLines[pageColumnLines.length - 1];
            const lastPageColumnLine = $("#" + getDocumentId("PageColumnLine", props.pageIndex, props.pageColumnIndex, lastPageColumnLineComponent.key!.toString()));
            
            // case: is last page
            if (props.pageIndex === documentContext.getNumPages() - 1) {
                removePageColumnLine(pageColumnLines.length - 1);

                const initPageColumnLine = copyPageColumnLine(lastPageColumnLine, true);
                if (initPageColumnLine) {
                    const newPageColumn = pageContext.createPageColumn(false, [initPageColumnLine], true);
                    documentContext.addPage([newPageColumn]);
                }

            } else {
                // get next pagecolumn
                const nextPageColumn = $("#" + getDocumentId("PageColumn", props.pageIndex + 1, props.pageColumnIndex + 1));
                // copy
                const nextPageColumnCopy = copyPageColumn(nextPageColumn);
                // remove next page from pageState
                // TODO: continue here, adjust removePage() and make addPage add pages in between
                // documentContext.removePage()
                // create new page with copied pagecolumns

                // move last line to next page (should cascade a render to all other pages, should work)
            }
        }
    }, [pageColumnLines]);


    function initPageColumnLines(): React.JSX.Element[] {

        return props.initPageColumnLines || [createPageColumnLine("", props.focusOnRender)];
    }


    function createPageColumnLine(defaultValue = "",
                                  focusOnRender = false,
                                  nextPage = false, 
                                  initialTextInputs?: React.JSX.Element[]): React.JSX.Element {

        const key = uuid();

        return <PageColumnLine key={key}
                                pageIndex={nextPage ? props.pageIndex + 1 : props.pageIndex} 
                                pageColumnIndex={nextPage ? props.pageColumnIndex + 1 : props.pageColumnIndex} 
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

    
    function copyPageColumn(oldPageColumn: JQuery, nextPage = false): React.JSX.Element | null {

        if (!oldPageColumn.length) {
            logError("Failed to copy column line. 'oldPageColumn' is falsy");
            return null;
        }

        const newPageColumnLines: React.JSX.Element[] = [];
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

        const newTextInputs: React.JSX.Element[] = [];
        Array.from(oldPageColumnLine.children()).forEach(input => {
            const oldTextInput = input as HTMLInputElement;
            let textInputCopy: React.JSX.Element;

            if (oldTextInput.className.includes("TextInput")) {
                const textInputValue = oldTextInput.value;
                // TODO: get style
                const key = uuid();
                const textInputKey = uuid();

                textInputCopy = <TextInput key={key}
                                            pageIndex={nextPage ? props.pageIndex + 1 : props.pageIndex} 
                                            pageColumnIndex={nextPage ? props.pageColumnIndex + 1 : props.pageColumnIndex} 
                                            pageColumnLineKey={key} 
                                            textInputKey={textInputKey} 
                                            defaultValue={textInputValue}
                                            />;
                newTextInputs.push(textInputCopy);
            }
        });

        const pageColumnLineCopy = createPageColumnLine("", false, true, newTextInputs);

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