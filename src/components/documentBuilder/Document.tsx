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
    
    // TODO: reconsider page order, back first is confusing
    return (
        <div className="Document">
            <h3>Back</h3>
            <Page pageType="back" />

            <h3>Front page</h3>
            <Page pageType="front" />

            <h3>Page2</h3>
            <Page pageType="page2" />

            <h3>Page1</h3>
            <Page pageType="page1" />
            
            <div style={{textAlign: "right"}}>
                {/* TODO: add some kind of "pending" button */}
                <button onClick={downloadWordDocument}>Download</button>
            </div>
        </div>
    );
}