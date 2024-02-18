import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import "../../assets/styles/Column.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getRandomString, isBlank, log } from "../../utils/basicUtils";
import { AppContext } from "../App";
import { DocumentContext } from "./Document";
import { NUM_LINES_LANDSCAPE, NUM_LINES_PROTRAIT } from "../../globalVariables";
import { Orientation } from "../../enums/Orientation";
import { getDocumentId } from "../../utils/documentBuilderUtils";
import TextInput from "./TextInput";


/**
 * @since 0.0.1
 */
export default function Column(props: {
    pageIndex: number,
    columnIndex: number,
    key?: string | number,
    id?: string,
    className?: string
}) {

    const id = getDocumentId("Column", props.pageIndex, props.columnIndex, NaN, props.id);
    const className = props.className ? "Column " + props.className : "Column";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);
    
    const [textInputs, setTextInputs] = useState<React.JSX.Element[]>([]);

    const componentRef = useRef(null);
    
    const context = {}


    useEffect(() => {
        setTextInputs(initTextInputs());
        addSpaceBetweenColumns();

    }, []);

    
    useEffect(() => {
        if (documentContext.appendTextInputWrapper.columnIds.has(id))
            appendTextInputs(documentContext.appendTextInputWrapper.num);

    }, [documentContext.appendTextInputWrapper]);
    

    useEffect(() => {
        // TODO: delete singlce column lines too
        // if column index === 0 && textinputs.length === 0
            // pagecontext.removelastsinglecolumnline
        if (documentContext.removeTextInputWrapper.columnIds.has(id))
            removeTextInputs(documentContext.removeTextInputWrapper.num);

    }, [documentContext.removeTextInputWrapper]);


    function initTextInputs(): React.JSX.Element[] {

        const initTextInputs: React.JSX.Element[] = [];
        const initNumTextInputs = getInitialNumTextInputs(documentContext.orientation);

        for (let i = 0; i < initNumTextInputs; i++)
            initTextInputs.push(<TextInput key={getRandomString()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex}
                                        textInputIndex={i} 
                                        isSingleColumnLine={false}
                                />)

        return initTextInputs;
    }


    /**
     * Remove given number of ```<TextInput />```s starting at given ```startIndex```.
     *
     * @param startIndex index of text input position in given ```textInputs``` array to start removing text inputs from
     * @param deleteCount  number of elements to remove
     * @returns array with the removed ```<TextInput />```s
     */
    function removeTextInputs(deleteCount = 1, startIndex: number = textInputs.length - deleteCount): React.JSX.Element[] {

        const removedTextInputs = textInputs.splice(startIndex, deleteCount);

        setTextInputs([...textInputs]);

        return removedTextInputs;
    }


    function addSpaceBetweenColumns(): void {

        if (documentContext.numColumns > 1) {
            // case: is first column
            if (props.columnIndex === 0)
                $(componentRef.current!).addClass("halfSpaceRightBetweenColumns")

            // case: is last column
            else if (props.columnIndex === documentContext.numColumns - 1)
                $(componentRef.current!).addClass("halfSpaceLeftBetweenColumns")
            
            // case: is middle column
            else 
                $(componentRef.current!).addClass("spaceBetweenColumns")
        }
    }


    /**
     * Append new ```<TextInput />```s to ```textInputs``` state
     *
     * @param numTextInputs number of text inputs to append
     * @returns array with the appended ```<TextInput />```s
     */
    function appendTextInputs(numTextInputs = 1): React.JSX.Element[] {

        // if is single column line
            // append in all columns of this page
        // else
            // append only here

        let newTextInputs: React.JSX.Element[] = [];

        for (let i = 0; i < numTextInputs; i++) {
            newTextInputs.push(<TextInput key={getRandomString()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex}
                                        textInputIndex={textInputs.length + i}
                                        isSingleColumnLine={false}
                                        />);
        }

        setTextInputs([...textInputs, ...newTextInputs]);

        return newTextInputs;
    }


    /**
     * @param orientation of the document
     * @returns number of ```<Textinput />```s considering the orientation of the document
     */
    function getInitialNumTextInputs(orientation: Orientation): number {

        return orientation === Orientation.PORTRAIT ? NUM_LINES_PROTRAIT : NUM_LINES_LANDSCAPE;
    }


    return (
        <div id={id} className={className} ref={componentRef}>
            <ColumnContext.Provider value={context}>
                {textInputs}
            </ColumnContext.Provider>
        </div>
    )
}


export const ColumnContext = createContext({});