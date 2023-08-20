import React, { useEffect } from "react";
import sendHttpRequest from "../../utils/fetch/fetch";
import "../styles/DocumentBuilder.css";
import Document from "./Document";
import FileSaver from "file-saver"
import { BACKEND_BASE_URL } from "../../utils/GlobalVariables";
import StylePanel from "./style/StylePanel";


/** id of BasicParagraphs text input currently selected */
export let currentBasicParagraphId = "";


// TODO: add default or required props to all components
// TODO: consider error throwing and handling, alert?
export default function DocumentBuilder(props) {
    
    useEffect(() => {
        // confirm page refresh / tab close / window close
        // window.addEventListener("beforeunload", (event) => {
        //     event.preventDefault();
        //     event.returnValue = "";
        // });
    }, [])

    return (
        <div className="DocumentBuilder">
            <div style={{textAlign: "center"}}>
                <h1>Document builder</h1><br />
            </div>

            <div className="container">
                <Document />

                <StylePanel />
            </div>   
        </div>
    )
}


/**
 * Setter for id of the text input currently focused in {@link Document}.
 * 
 * @param newBasicParagraphId 
 */
export function setCurrentBasicParagraphId(newBasicParagraphId: string) {
    
    currentBasicParagraphId = newBasicParagraphId;
};


/**
 * Gets the text input currently selected in {@link Document} using the {@link currentBasicParagraphId}.
 * 
 * @returns the text input currently focused in {@link Document}
 */
export function getCurrentTextInput(): HTMLInputElement | null {
    
    const currentBasicParagraph = document.getElementById(currentBasicParagraphId);

    if (!currentBasicParagraph) 
        return null;
            
    return currentBasicParagraph.querySelector("input");
}



// TODO: has to be session scoped somehow
/** The final document that will be processed. */
export const wordDocument: DocumentWrapper = {
    content: [],
    tableConfig: null,
}


// TODO: clean this up
function setUpWordDocument(): void {

    const Document = document.getElementsByClassName("Document")[0];

    // iterate all inputs inside "Document"
    const textInputs = Document.getElementsByTagName("input");
    Array.from(textInputs).forEach(async (input, i) => {
        // add break at the top of first page to even out COLUMN break bug
        if (i === 1)
            wordDocument.content.push(null);

        const inputClassName = input.className;
        const inputType = input.type;

        // get text and style
        const basicParagraph = getBasicParagraph(input);

        // case: go to next column
        if (isAddColumnBreak(textInputs, i)) {
            basicParagraph.style.breakType = "COLUMN";

            // case: no text but column break
            if (basicParagraph.text === "")
                // prevent setting bp to null
                basicParagraph.text = " ";
        }

        // only use one header and one footer
        if (inputClassName === "header" && i !== 0)
            return;
        if (inputClassName === "footer" && i !== textInputs.length - 1)
            return;

        // case: is text
        if (inputType === "text") {
            wordDocument.content.push(basicParagraph.text === "" ? null : basicParagraph);

        // case: is picture
        } else if (inputType === "file") {
            // case: picutres have been uploaded
            await uploadFiles(input, basicParagraph);            

        // case: TODO: is table
        }
    });
}


export async function downloadWordDocument(): Promise<void> {

    setUpWordDocument();

    // build request
    const createDocumentResponse = await sendHttpRequest(BACKEND_BASE_URL + "/test/createDocument?file=asdf", "post", wordDocument);

    // handle build errors
    if (createDocumentResponse.status !== 200) 
        alert(createDocumentResponse.error + ": " + createDocumentResponse.message);
        
    // download request
    if (createDocumentResponse.status === 200) 
        FileSaver.saveAs(BACKEND_BASE_URL + "/test/download?pdf=false");
    
    // clean up request, wait 2 seconds after download
    setTimeout(() => sendHttpRequest(BACKEND_BASE_URL + "/test/clearResourceFolder"), 2000);

    cleanUpWordDocument();
}


/**
 * Set properties of {@link wordDocument} to default values.
 */
function cleanUpWordDocument(): void {

    wordDocument.content = [];
    wordDocument.tableConfig = null;
}


function getBasicParagraph(input: HTMLInputElement): BasicParagraph {

    if (!input)
        throw Error("Failed to setup word document.");
    
    // TODO: this might throw becuase input.value might be a picture
    return {
        text: input.value, 
        style: getTextInputStyle(input)
    };
}


export function getTextInputStyle(textInput: HTMLInputElement): BasicStyle {

    if (!textInput)
        throw Error("Failed to setup style for basic paragraph.");
    
    const textInputStyle = textInput.style;
    
    return {
        fontSize: Number.parseInt(getTextInputStyleValue(textInput, "font-size", textInputStyle.fontSize)),
        fontFamily: getTextInputStyleValue(textInput, "font-family", textInputStyle.fontFamily),
        color: rgbToHex(getTextInputStyleValue(textInput, "color", textInputStyle.color)),
        bold: getTextInputStyleValue(textInput, "font-weight", textInputStyle.fontWeight) === "bold",
        italic: getTextInputStyleValue(textInput, "font-style", textInputStyle.fontStyle) === "italic",
        underline: getTextInputStyleValue(textInput, "text-decoration", textInputStyle.textDecoration) === "underline",
        // this condition might change 
        indentFirstLine: Number.parseInt(getTextInputStyleValue(textInput, "margin-left", textInputStyle.marginLeft)) >= 30,
        indentParagraph: Number.parseInt(getTextInputStyleValue(textInput, "margin-left", textInputStyle.marginLeft)) >= 60,
        textAlign: getTextInputStyleValue(textInput, "text-align", textInputStyle.textAlign).toUpperCase(),
        breakType: null
    }
}


function getTextInputStyleValue(textInput: HTMLInputElement, textInputStyleAttribute: string, currentTextInputStyleValue: string): string {

    let defaultStyleValue = textInput.computedStyleMap().get(textInputStyleAttribute);

    if (!defaultStyleValue) {
        alert("Failed to read default style attribute.")
        return "";
    }

    defaultStyleValue = defaultStyleValue.toString();

    // set font-family default
    if (textInputStyleAttribute === "font-family")
        defaultStyleValue = "Calibri";

    // set text-align default
    if (textInputStyleAttribute === "text-align")
        defaultStyleValue = "LEFT";

    // if value empty, use default instead
    return currentTextInputStyleValue === "" ? defaultStyleValue : textInput.style[textInputStyleAttribute];
}


/**
 * Convert rgb string formatted like rgb(0,0,0) to a hex string (without "#" prepended).
 *  
 * @param rgbString rgb string to convert (e.g. rgb(0,0,0))
 * @returns hex string equivalent of rgb string without "#", or "000000" (black) if rgb string is falsy
 */
export function rgbToHex(rgbString: string): string {

    // default is black
    const defaultHex = "000000";

    if (!rgbString)
        return defaultHex;
    
    const rgbRegex = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (!rgbRegex)
        return defaultHex;

    function hex(rgbStringRegex: string) {

        const rgbRegex = Number.parseInt(rgbStringRegex);
        
        let hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 
        
        return isNaN(rgbRegex) ? "00" : hexDigits[(rgbRegex - rgbRegex % 16) / 16] + hexDigits[rgbRegex % 16];
    }

    return hex(rgbRegex[1]) + hex(rgbRegex[2]) + hex(rgbRegex[3]);
}


/**
 * Checks if current text input should be in the next document column. 
 * 
 * @param content all text inputs from Document
 * @param currentIndex index of current iteration
 * @returns true if current text input has different page type than next one, else false
 */
function isAddColumnBreak(content: HTMLCollectionOf<HTMLInputElement>, currentIndex: number): boolean {

    try {      
        const currentTextInput = content[currentIndex];

        // case: is last page
        if (currentTextInput.name === "page1")
            return false;
        
        // ommit headers and footers
        if (currentTextInput.className !== "basicParagraph")
            return false;

        const nextTextInput = content[currentIndex + 1];

        return nextTextInput.className !== currentTextInput.className;

    } catch (e) {
        // expect IndexOutOfBounds
        return false;
    }
}


/**
 * Iterates all files of a file input and uploads them as {@link FormData}. Also adds the 
 * neccessary bp to {@link wordDocument} with the file name as text.<p>
 * 
 * Backend endpoint has to define a RequestBody with name "file".
 * 
 * @param fileInput html input of type "file" holding the uploaded file
 * @param basicParagraph of current iteration
 */
async function uploadFiles(fileInput: HTMLInputElement, basicParagraph: BasicParagraph): Promise<void> {

    if (fileInput.files) {
        for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files.item(i);
            if (file) { 
                // create formData
                const formData = new FormData();
                formData.append("file", file);

                // upload request
                sendUploadPicturesRequest(formData, file.name);

                // add bp with file name for backend
                basicParagraph.text = file.name;
                wordDocument.content.push(basicParagraph);
            }
        }
    }
}


async function sendUploadPicturesRequest(formData: FormData, pictureName: string) {

    fetch(BACKEND_BASE_URL + "/test/uploadFile?fileName=" + pictureName, {
        method: "post",
        body: formData
    })
    .then(resp => {
        // TODO:
    })
}


interface DocumentWrapper {
    content: (BasicParagraph | null)[],
    tableConfig: TableConfig | null
}


interface BasicParagraph {
    text: string, 
    style: BasicStyle
}


// TODO: reconsider name
export interface BasicStyle {
    fontSize: number,   
    fontFamily: string,
    color: string,
    bold: boolean,
    italic: boolean,
    underline: boolean,
    indentFirstLine: boolean,
    indentParagraph: boolean,
    textAlign: string,
    breakType: string | null
}


interface TableConfig {
    numColulmns: number,
    numRows: number,
    startIndex: number,
    endIndex: number
}