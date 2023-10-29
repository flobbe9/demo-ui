import React, { createContext, useEffect, useState } from "react";
import "../assets/styles/Document.css";
import StylePanel from "./StylePanel";
import Page from "./Page";
import { getDocumentId, getPartFromDocumentId, log, logError, stringToNumber } from "../utils/Utils";
import { v4 as uuid} from "uuid";
import $ from "jquery";
import {Orientation} from "../enums/Orientation";


export default function Document(props: {
    initialPages?: React.JSX.Element[],
    className?: string,
    style?,
    children?
}) {

    const [currentTextInputId, setCurrentTextInputId] = useState(getDocumentId("TextInput", -1, 0, "pageColumnLineKey", "textInputKey"));
    const [pages, setPages] = useState(initPages());
    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);

    const thisClassName = "Document " + props.className;
    const thisContext = {
        currentTextInputId: currentTextInputId, 
        setCurrentTextInputId: setCurrentTextInputId,
        selectTextInput: selectTextInput,

        createPage: createPage,
        addPage: addPage,
        removePage: removePage,
        getCurrentPageIndex: getCurrentPageIndex,
        getNumPages: getNumPages,

        orientation: orientation,
        setOrientation: setOrientation
    }


    function initPages(): React.JSX.Element[] {

        return props.initialPages || [createPage(null, true)];
    }


    function createPage(initialPageColumns?: React.JSX.Element[] | null, 
                        focusOnRender = false, 
                        cursorAtLastChar = false, 
                        index = getCurrentPageIndex() + 1): React.JSX.Element {

        const key = uuid();

        return <Page key={key} 
                     pageIndex={index}
                     initialPageColumns={initialPageColumns}
                     focusOnRender={focusOnRender}
                     cursorAtLastChar={cursorAtLastChar} />
    }


    function addPage(initialPageColumns?: React.JSX.Element[],
                     focusOnRender = false, 
                     cursorAtLastChar = false, 
                     index = getCurrentPageIndex() + 1): void {

        pages.splice(index, 0, createPage(initialPageColumns, focusOnRender, cursorAtLastChar, index));

        setPages([...pages]);
    }
    

    /** 
     * @param index 
     * @returns 
     */
    function removePage(index = getCurrentPageIndex() + 1) {

        pages.splice(index, 1);

        setPages([...pages]);
    }


    function getCurrentPageIndex(): number {

        const currentPageIndex = getPartFromDocumentId(currentTextInputId, 1);

        if (typeof currentPageIndex === "string")
            return stringToNumber(currentPageIndex);

        return currentPageIndex;
    }


    function getNumPages(): number {

        return pages.length;
    }
    

    function selectTextInput(textInputId: string): void {

        const textInput = $("#" + textInputId);

        if (!textInput.length) {
            logError("Failed to select text input. No element with id: " + textInputId);
            return;
        }

        setCurrentTextInputId(textInputId);

        textInput.trigger("focus");
    }

    
    // state with current style, use current text input

    return (
        <div id="Document"
             className={thisClassName}
             style={props.style}
             >
            <DocumentContext.Provider value={thisContext}>
                <StylePanel />

                {pages}

                {props.children}
            </DocumentContext.Provider>
        </div>
    )
}


export const DocumentContext = createContext({
    currentTextInputId: "",
    setCurrentTextInputId: Object(),
    selectTextInput: (str: string) => {},

    createPage: (initialPagesColumns?: React.JSX.Element[] | null, 
                 focusOnRender?: boolean, 
                 cursorAtLastChar?: boolean, 
                 index?: number) => {},
    addPage: (initialPageColumns?: React.JSX.Element[], 
              focusOnRender?: boolean, 
              cursorAtLastChar?: boolean,
              index?: number) => {},
    removePage: (index?: number) => {},
    getCurrentPageIndex: () => {},
    getNumPages: Object(),

    orientation: Orientation.PORTRAIT,
    setOrientation: Object()
});