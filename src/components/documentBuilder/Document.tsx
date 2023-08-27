import React, { createContext } from "react";
import "../styles/Document.css";
import { downloadWordDocument } from "./DocumentBuilder";
import Page from "./Page";


/** Context holding array with all {@link BasicParagraph}s */
export const BasicParagraphContext = createContext({basicParagraphs: [<></>], setBasicParagraphs: (basicParagraphs) => {}})

/** Count of all {@link BasicParagraph}s in {@link Document} plus 2 {@link HeaderFooter}s  */
export let textInputCount = 3;


export function setTextInputCount(newTextInputCount: number): void {

    textInputCount = newTextInputCount;
}


export default function Document(props) {
    
    return (
        <div className="Document">
                <Page pageNumber={1} />

                <Page pageNumber={2} />
            
            <div style={{textAlign: "right"}}>
                {/* TODO: add some kind of "pending" button */}
                <button onClick={downloadWordDocument}>Download</button>
            </div>
        </div>
    );
}