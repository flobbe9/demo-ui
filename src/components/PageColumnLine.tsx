import React, { createContext, useContext, useEffect, useState } from "react";
import "../assets/styles/PageColumnLine.css"; 
import TextInput from "./TextInput";
import { DocumentContext } from "./Document";
import { getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, getWidthRelativeToWindow, isNumberFalsy, log, logError, stringToNumber } from "../utils/Utils";
import $ from "jquery";
import {v4 as uuid} from "uuid";
import { PageColumnContext } from "./PageColumn";
import { PageContext } from "./Page";


export default function PageColumnLine(props: {
    /** index of <Page /> insede <Document /> */
    pageIndex: number,
    /** index of <PageColumn /> insied a <Page /> */
    pageColumnIndex: number,
    /** key of <PageColumnLine /> */
    pageColumnLineKey: string, 
    initialTextInputs?: React.JSX.Element[],
    defaultValue?: string,
    focusOnRender?: boolean,
    cursorAtLastChar?: boolean,
    className?: string,
    style?,
    children?
}) {

    const thisId = getDocumentId("PageColumnLine", props.pageIndex, props.pageColumnIndex, props.pageColumnLineKey);
    const thisClassName = props.className ? "PageColumnLine " + props.className : "PageColumnLine";
    
    const [textInputs, setTextInputs] = useState(initComponent());

    const thisContext = {
        addTextInput: addTextInput,
        removeTextInput: removeTextInput,
        getCurrentTextInputIndex: getCurrentTextInputIndex,

        numTextInputsInLine: textInputs.length,
        getPageColumnLineWidth: getPageColumnLineWidth,

        getTextInputElementByIndex: getTextInputElementByIndex,
        getTextInputElementByKey: getTextInputElementByKey,
        getTextInputComponentByIndex: getTextInputComponentByIndex,
        getTextInputByIndex: getTextInputByIndex
    }
    
    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);
    const pageColumnContext = useContext(PageColumnContext);


    // TODO: continue here, this gets called twice on handle tab on second page (not on first)
    useEffect(() => {
        // case: end of line reached
        if (textInputs.length > pageContext.maxNumTextInputsPerLine) {
            log(thisId)
            const lastTextInput = getTextInputByKey(textInputs[textInputs.length - 1].key!.toString());
            if (!lastTextInput) {
                logError("Failed to add last text input to new line. 'lastTextInput' is false");
                return;
            }
            // remove overhead text input
            removeTextInput(textInputs.length - 1);
            
            // add new line with old value
            // TODO: pass style as well
            const lastTextInputValue = lastTextInput.prop("value");
            pageColumnContext.addPageColumnLine(lastTextInputValue, false, props.cursorAtLastChar);
        }
        
        // case: init with existing inputs
        if (props.initialTextInputs && props.initialTextInputs.length) 
            setTextInputs(props.initialTextInputs);

    }, [textInputs]);


    function initComponent(): React.JSX.Element[] {

        return props.initialTextInputs || [createTextInput(props.focusOnRender, props.cursorAtLastChar, props.defaultValue)];
    }


    function createTextInput(focusOnRender = false, cursorAtLastChar = false, defaultValue = ""): React.JSX.Element {

        const key = uuid();

        return <TextInput key={key} 
                            pageIndex={props.pageIndex} 
                            pageColumnIndex={props.pageColumnIndex} 
                            pageColumnLineKey={props.pageColumnLineKey} 
                            textInputKey={key}
                            focusOnRender={focusOnRender}
                            cursorAtLastChar={cursorAtLastChar}
                            defaultValue={defaultValue}
                            />
    }


    function addTextInput(focusOnRender: boolean, cursorAtLastChar = false, index = getCurrentTextInputIndex() + 1, defaultValue = ""): React.JSX.Element {

        const newTextInput = createTextInput(focusOnRender, cursorAtLastChar, defaultValue);

        textInputs.splice(index, 0, newTextInput);
        setTextInputs([...textInputs]);

        return newTextInput;
    }

    
    function removeTextInput(index = getCurrentTextInputIndex() + 1) {

        textInputs.splice(index, 1);

        setTextInputs([...textInputs]);
    }


    function getCurrentTextInputIndex(): number {

        const currentTextInputKey = getPartFromDocumentId(documentContext.currentTextInputId, 4);

        return textInputs.findIndex(textInput => textInput.key === currentTextInputKey);
    }


    /**
     * @param index of the {@link TextInput} inside {@link textInputs} state
     * @returns the {@link TextInput} as {@link HTMLInputElement} at given index in current {@link PageColumnLine} or null
     */
    function getTextInputElementByIndex(index: number): HTMLInputElement | null {

        const textInput = getTextInputComponentByIndex(index);

        if (!textInput)
            return null;

        const key = textInput.key!.toString();

        return getTextInputElementByKey(key);
    }


    /**
     * @param index of the {@link TextInput} inside {@link textInputs} state
     * @returns the {@link TextInput} as {@link React.JSX.Element} at given index in current {@link PageColumnLine} or null
     */
    function getTextInputComponentByIndex(index: number): React.JSX.Element | null {

        if (isNumberFalsy(index))
            return null;

        return textInputs[index];
    }


    /**
     * @param key of the {@link TextInput} to look for
     * @returns the {@link TextInput} as {@link HTMLInputElement}
     */
    function getTextInputElementByKey(key: string): HTMLInputElement | null {

        const textInputId = getDocumentId("TextInput", props.pageIndex, props.pageColumnIndex, props.pageColumnLineKey, key);
        const textInput = $("#" + textInputId);

        if (!textInput.length)
            return null;

        return textInput.get(0) as HTMLInputElement;
    }


    /**
     * 
     * @param index of the {@link TextInput} inside {@link textInputs} state
     * @returns the {@link TextInput} as {@link JQuery} at given index in current {@link PageColumnLine} or null
     */
    function getTextInputByIndex(index: number): JQuery | null {

        const textInputElement = getTextInputElementByIndex(index);
        if (!textInputElement)
            return null;

        const textInput = $("#" + textInputElement.id);

        return textInput.length === 0 ? null :  textInput;
    }
    

    /**
     * @param key of the {@link TextInput} to look for
     * @returns the {@link TextInput} as {@link JQuery}
     */
    function getTextInputByKey(key: string): JQuery | null {

        const textInputId = getDocumentId("TextInput", props.pageIndex, props.pageColumnIndex, props.pageColumnLineKey, key);
        const textInput = $("#" + textInputId);

        if (!textInput.length)
            return null;

        return textInput;
    }


    function getPageColumnLineWidth(): number {

        let lineWidth = 0;

        // add up text input widths
        textInputs.forEach(textInputComponent => {
            const textInput = getTextInputByKey(textInputComponent.key!.toString());
            if(textInput && textInput.length)
                lineWidth += getCSSValueAsNumber(textInput.css("width"), 2);
        });

        return getCSSValueAsNumber(getWidthRelativeToWindow(lineWidth, 0), 1);
    }
    

    return (
        <div id={thisId}
             className={thisClassName}
             style={props.style}
             >
            <PageColumnLineContext.Provider value={thisContext}>
                {textInputs}
            </PageColumnLineContext.Provider>
            
            {props.children}
        </div>
    )
}


export const PageColumnLineContext = createContext({
    addTextInput: (focusOnRender: boolean, cursorAtLastChar?: boolean, index?: number, defaultValue = ""): React.JSX.Element => {return <></>},
    removeTextInput: (index?) => {},
    getCurrentTextInputIndex: (): number => {return 0},

    numTextInputsInLine: 1,
    getPageColumnLineWidth: (): number => {return 0},

    getTextInputElementByIndex: (index: number): HTMLInputElement | null => {return null},
    getTextInputElementByKey: (key: string): HTMLInputElement | null => {return null},
    getTextInputComponentByIndex: (index: number): React.JSX.Element | null => {return null},
    getTextInputByIndex: (index: number): JQuery | null => {return null}
})