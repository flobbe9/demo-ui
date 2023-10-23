import React, { createContext, useContext, useEffect, useState } from "react";
import "../assets/styles/PageColumnLine.css"; 
import TextInput from "./TextInput";
import { DocumentContext } from "./Document";
import { getDocumentId, getPartFromDocumentId, isNumberFalsy, log, logError } from "../utils/Utils";
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
        getTextInputElementByIndex: getTextInputElementByIndex,
        getTextInputElementByKey: getTextInputElementByKey,
        getTextInputComponentByIndex: getTextInputComponentByIndex,
        getTextInputByIndex: getTextInputByIndex
    }
    
    const documentContext = useContext(DocumentContext);
    const pageContext = useContext(PageContext);
    const pageColumnContext = useContext(PageColumnContext);


    useEffect(() => {
        // case: end of line reached
        if (textInputs.length > pageContext.maxNumTextInputsPerLine) {
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
            pageColumnContext.addPageColumnLine(lastTextInputValue, false);
        }
        
        // case: init with existing inputs
        if (props.initialTextInputs && props.initialTextInputs.length) 
            setTextInputs(props.initialTextInputs);

    }, [textInputs]);


    function initComponent(): React.JSX.Element[] {

        return props.initialTextInputs || [createTextInput(props.focusOnRender, props.defaultValue)];
    }


    function createTextInput(focusOnRender = false, defaultValue = ""): React.JSX.Element {

        const key = uuid();

        return <TextInput key={key} 
                            pageIndex={props.pageIndex} 
                            pageColumnIndex={props.pageColumnIndex} 
                            pageColumnLineKey={props.pageColumnLineKey} 
                            textInputKey={key}
                            focusOnRender={focusOnRender}
                            defaultValue={defaultValue}
                            />
    }


    function addTextInput(focusOnRender: boolean, index = getCurrentTextInputIndex() + 1, defaultValue = ""): React.JSX.Element {

        const newTextInput = createTextInput(focusOnRender, defaultValue);

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
    addTextInput: (focusOnRender: boolean, index?: number, defaultValue = ""): React.JSX.Element => {return <></>},
    removeTextInput: (index?) => {},
    getCurrentTextInputIndex: (): number => {return 0},
    numTextInputsInLine: 1,
    getTextInputElementByIndex: (index: number): HTMLInputElement | null => {return null},
    getTextInputElementByKey: (key: string): HTMLInputElement | null => {return null},
    getTextInputComponentByIndex: (index: number): React.JSX.Element | null => {return null},
    getTextInputByIndex: (index: number): JQuery | null => {return null}
})