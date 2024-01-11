import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import "../../assets/styles/Column.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getDocumentId, getRandomString, isBlank, log } from "../../utils/basicUtils";
import Paragraph from "./Paragraph";
import { AppContext } from "../App";
import { DocumentContext } from "./Document";
import { NUM_LINES_LANDSCAPE, NUM_LINES_PROTRAIT } from "../../globalVariables";
import { Orientation } from "../../enums/Orientation";
import { PageContext } from "./Page";


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
    const pageContext = useContext(PageContext);
    
    const [numLinesPerParagraph, setNumLinesPerParagraph] = useState(1);
    const [paragraphs, setParagraphs] = useState<React.JSX.Element[]>();

    const componentRef = useRef(null);
    
    const context = {
        numLinesPerParagraph,
        setNumLinesPerParagraph
    }


    useEffect(() => {
        setParagraphs(initParagraphs());

        addSpaceBetweenColumns();

    }, []);


    function initParagraphs(): React.JSX.Element[] {

        const paragraphs: React.JSX.Element[] = [];
        const numParagraphs = getInitialNumParagraphs(documentContext.orientation);

        for (let i = 0; i < numParagraphs; i++) 
            paragraphs.push(<Paragraph key={getRandomString()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex} 
                                        paragraphIndex={i} />)

        return paragraphs;
    }


    function addSpaceBetweenColumns(): void {

        if (documentContext.numColumns > 1) {
            // case: is first column
            if (props.columnIndex === 0)
                $(componentRef.current).addClass("halfSpaceRightBetweenColumns")

            // case: is last column
            else if (props.columnIndex === documentContext.numColumns - 1)
                $(componentRef.current).addClass("halfSpaceLeftBetweenColumns")
            
            // case: is middle column
            else 
                $(componentRef.current).addClass("spaceBetweenColumns")
        }
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
        <div id={id} className={className} ref={componentRef}>
            <ColumnContext.Provider value={context}>
                <div className={"paragraphContainer"}>
                    {paragraphs}
                </div>
            </ColumnContext.Provider>
        </div>
    )
}


export const ColumnContext = createContext();