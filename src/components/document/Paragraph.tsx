import React, { useContext, useState, useEffect, createContext } from "react";
import "../../assets/styles/Paragraph.css";
import TextInput from "./TextInput";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, getPartFromDocumentId, log, stringToNumber } from "../../utils/Utils";
import { ColumnContext } from "./Column";
import { NUM_HEADINGS_PER_COLUMN } from "../../utils/GlobalVariables";
import { DocumentContext } from "./Document";


export default function Paragraph(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    key: string | number,
    id?: string,
    className?: string
}) {
    
    const id = getDocumentId("Paragraph", props.pageIndex, props.id, props.columnIndex, props.paragraphIndex);
    const className = props.className ? "Paragraph " + props.className : "Paragraph";
    
    const documentContext = useContext(DocumentContext);
    const columnContext = useContext(ColumnContext);

    const [textInputs, setTextInputs] = useState<React.JSX.Element[]>();


    useEffect(() => {
        setTextInputs(initTextInputs());

    }, []);


    useEffect(() => {
        if (documentContext.paragraphIdAppendTextInput) {
            const paragraphId = documentContext.paragraphIdAppendTextInput[0];
            const numTextInputsToAppend = documentContext.paragraphIdAppendTextInput[1];
            
            // case: append text inputs to this paragraph
            if (paragraphId === id) {
                documentContext.appendTextInput(textInputs, setTextInputs, props.pageIndex, props.columnIndex, props.paragraphIndex, numTextInputsToAppend);
            }
        }

    }, [documentContext.paragraphIdAppendTextInput]);


    useEffect(() => {
        if (documentContext.paragraphIdRemoveTextInput)
            handleRemoveTextInput();
        
    }, [documentContext.paragraphIdRemoveTextInput]);


    function initTextInputs(): React.JSX.Element[] {

        const initTextInputs: React.JSX.Element[] = [];
        const numLinesPerParagraph = columnContext.numLinesPerParagraph;

        for (let i = 0; i < numLinesPerParagraph; i++) 
            initTextInputs.push(<TextInput key={crypto.randomUUID()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex}
                                        paragraphIndex={props.paragraphIndex}
                                        textInputIndex={i} 
                                        // only works because there's one text input per paragraph
                                        isHeading={props.paragraphIndex < NUM_HEADINGS_PER_COLUMN}
                                />)

        return initTextInputs;
    }


    /**
     * If ```documentContext.paragraphIdRemoveTextInput``` references ```this``` id, remove as many text inputs as needed 
     * from this paragraph. 
     * If this paragraph has less textInputs than there are to remove, set state to prev textInput or (if
     * there is no prev text input) do nothing.
     */
    function handleRemoveTextInput(): void {

        const paragraphId = documentContext.paragraphIdRemoveTextInput[0];
        const numTextInputsToRemove = documentContext.paragraphIdRemoveTextInput[1];
            
        // case: remove text inputs from this paragraph
        if (paragraphId === id) {
            const textInputsRemoved = documentContext.removeTextInput(textInputs, setTextInputs, textInputs.length - 1, numTextInputsToRemove);

            // case: not enough text inputs inside this paragraph
            if (numTextInputsToRemove > textInputsRemoved.length) {
                const prevParagraphId = getPrevParagraphId();

                // case: is first paragraph in column (shouldn't happen)
                if (!prevParagraphId)
                    return;

                documentContext.setParagraphIdRemoveTextInput([prevParagraphId, numTextInputsToRemove - textInputsRemoved.length])
            }
        }
    }


    /**
     * @returns the id of the previous paragraph in the current column or null if ```this``` paragraph has ```index === 0```
     */
    function getPrevParagraphId(): string | null {

        const thisParagraphIndex = stringToNumber(getPartFromDocumentId(id, 3));

        const prevParagraphId = getDocumentId("Paragraph", props.pageIndex, "", props.columnIndex, thisParagraphIndex -1);

        // find element
        const prefParagraph = $("#" + prevParagraphId);

        return prefParagraph.length ? prevParagraphId : null;
    }


    return (
        <div id={id} className={className}>
            {textInputs}
        </div>
    )
}