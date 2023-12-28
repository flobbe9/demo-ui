import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Column.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getDocumentId, getNumLinesPerPage, isBlank, log, togglePopup } from "../../utils/Utils";
import Paragraph from "./Paragraph";
import { AppContext } from "../App";
import { DocumentContext } from "./Document";
import { NUM_HEADINGS_PER_COLUMN, getNumLinesPerColumn } from "../../utils/GlobalVariables";
import { Orientation } from "../../enums/Orientation";
import TextInput from "./TextInput";


export default function Column(props: {
    pageIndex: number,
    columnIndex: number,
    key?: string | number,
    id?: string,
    className?: string
}) {

    const id = getDocumentId("Column", props.pageIndex, props.id, props.columnIndex);
    const className = props.className ? "Column " + props.className : "Column";

    const appContext = useContext(AppContext);
    
    const [numLinesPerParagraph, setNumLinesPerParagraph] = useState(1);
    const [paragraphs, setParagraphs] = useState<React.JSX.Element[]>();
    
    const context = {
        numLinesPerParagraph,
        setNumLinesPerParagraph
    }


    useEffect(() => {
        setParagraphs(initParagraphs(appContext.selectedTextInputStyle.fontSize));

    }, []);


    function initParagraphs(fontSize: string | number): React.JSX.Element[] {

        const paragraphs: React.JSX.Element[] = [];
        const numParagraphs = getNumParagraphs(appContext.orientation, getCSSValueAsNumber(fontSize, 2));

        for (let i = 0; i < numParagraphs; i++) 
            paragraphs.push(<Paragraph key={crypto.randomUUID()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex} 
                                        paragraphIndex={i} />)

        return paragraphs;
    }


    /**
     * @param orientation of the document
     * @param fontSize of all lines in this column
     * @returns number of paragraphs considering the orientation and fontSize
     */
    function getNumParagraphs(orientation: Orientation, fontSize: number): number {

        const numLinesPerColumn = getNumLinesPerColumn(orientation, fontSize)
        const numParagraphs = numLinesPerColumn / numLinesPerParagraph;

        return Math.floor(numParagraphs);
    }


    return (
        <div id={id} className={className}>
            <ColumnContext.Provider value={context}>
                <div className={"paragraphContainer"}>
                    {paragraphs}
                </div>
            </ColumnContext.Provider>
        </div>
    )
}


export const ColumnContext = createContext({
    numLinesPerParagraph: 1,
    setNumLinesPerParagraph: (numLines: number) => {}
});