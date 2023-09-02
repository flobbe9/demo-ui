import React, { createContext, useState } from "react";
import BasicParagraph from "./BasicParagraph";
import "../styles/PageColumn.css";


/** Context holding neccessary information for PageColumn component */
export const BasicParagraphContext = createContext({basicParagraphs: [<></>], 
                                                    setBasicParagraphs: (basicParagraphs) => {}, 
                                                    pageNumber: 1,
                                                    basicParagraphCount: 1, 
                                                    setBasicParagraphCount: (basicParagraphCount) => {}});

/**
 * "textInput" refers to any text input on a page. <p>
 * "basicParagraph" refers to a normal text input from the array, thus not beeing a header, footer, style or table text input.
 * @param props 
 * @returns 
*/
export default function PageColumn(props: {
    pageNumber: number,
    columnPosition: string,
}) {

    const [basicParagraphCount, setBasicParagraphCount] = useState(1);

    const pageNumber = props.pageNumber;

    const columnPosition: string = props.columnPosition;

    const initialKey = crypto.randomUUID();
    
    /** Initial basicParagraph array */
    const [basicParagraphs, setBasicParagraphs] = useState([<BasicParagraph id={"BasicParagraph-" + props.pageNumber + "-" + columnPosition + "-" + basicParagraphCount} key={initialKey} propsKey={initialKey} columnPosition={columnPosition}/>]);
    

    return (
        <div className="PageColumn">
            <div className={"pageColumn-" + columnPosition}>
                <BasicParagraphContext.Provider value={{basicParagraphs, setBasicParagraphs, pageNumber, basicParagraphCount, setBasicParagraphCount}}>

                    {basicParagraphs}

                </BasicParagraphContext.Provider>
            </div>
        </div>
    );
}