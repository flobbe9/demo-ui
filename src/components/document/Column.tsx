import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Column.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getDocumentId, isBlank, log, togglePopup } from "../../utils/Utils";
import Paragraph from "./Paragraph";
import { AppContext } from "../App";
import { DocumentContext } from "./Document";
import { NUM_LINES_LANDSCAPE, NUM_LINES_PROTRAIT } from "../../utils/GlobalVariables";
import { Orientation } from "../../enums/Orientation";


// TODO: add some margin between columns
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
    const documentContext = useContext(DocumentContext);
    
    const [numLinesPerParagraph, setNumLinesPerParagraph] = useState(1);
    const [paragraphs, setParagraphs] = useState<React.JSX.Element[]>();
    
    const context = {
        numLinesPerParagraph,
        setNumLinesPerParagraph
    }


    useEffect(() => {
        setParagraphs(initParagraphs());

    }, []);


    function initParagraphs(): React.JSX.Element[] {

        const paragraphs: React.JSX.Element[] = [];
        const numParagraphs = getInitialNumParagraphs(appContext.orientation);

        for (let i = 0; i < numParagraphs; i++) 
            paragraphs.push(<Paragraph key={crypto.randomUUID()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex} 
                                        paragraphIndex={i} />)

        return paragraphs;
    }


    /**
     * @param orientation of the document
     * @returns number of paragraphs considering the orientation of the document
     */
    function getInitialNumParagraphs(orientation: Orientation): number {

        const numLinesPerColumn = orientation === Orientation.PORTRAIT ? NUM_LINES_PROTRAIT : NUM_LINES_LANDSCAPE;
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


export const ColumnContext = createContext();