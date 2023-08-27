import React, { useState } from "react";
import { BasicParagraphContext } from "./Document";
import BasicParagraph from "./BasicParagraph";
import "../styles/PageColumn.css";

/**
 * "textInput" refers to any text input on a page. <p>
 * "basicParagraph" refers to a normal text input from the array, thus not beeing a header, footer, style or table text input.
 * @param props 
 * @returns 
*/
export default function PageColumn(props: {
    columnPosition: string,
}) {

    const columnPosition: string = props.columnPosition;

    const initialKey = crypto.randomUUID();
    
    /** Initial basicParagraph array */
    const [basicParagraphs, setBasicParagraphs] = useState([<BasicParagraph id={"BasicParagraph-" + columnPosition + "-" + 1} key={initialKey} propsKey={initialKey} columnPosition={columnPosition}/>]);
    

    return (
        <div className="PageColumn">
            <div className={"pageColumn-" + columnPosition}>
                <BasicParagraphContext.Provider value={{basicParagraphs, setBasicParagraphs}}>

                    {basicParagraphs}

                </BasicParagraphContext.Provider>
            </div>
        </div>
    );
}