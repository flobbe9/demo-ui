import React, { useEffect } from "react";
import sendHttpRequest, { ApiExceptionFormat } from "../../utils/fetch/fetch";
import "../styles/DocumentBuilder.css";
import Document from "./Document";
import FileSaver from "file-saver"
import { setTimeout } from "timers-promises";
import { BACKEND_BASE_URL } from "../../utils/GlobalVariables";
import StylePanel from "./style/StylePanel";


/** Id of BasicParagraphs text input currently selected */
export let currentBasicParagraphId = "";


export function setCurrentBasicParagraphId(newBasicParagraphId: string) {
    
    currentBasicParagraphId = newBasicParagraphId;
};


// TODO: make helper for alert/log combinations, add error popup instead of alert
export default function DocumentBuilder(props) {

    useEffect(() => {
        // confirm page refresh / tab close / window close
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            event.returnValue = "";
        });
    }, [])

    return (
        <div className="DocumentBuilder">

            <h1 style={{textAlign: "center"}}>Document builder</h1><br />

            <div className="container">
                <Document />

                <StylePanel />
            </div>   
        </div>
    )
}


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


/** The final document that will be processed. */
export const wordDocument: DocumentWrapper = {
    content: [],
    tableConfig: null,
}


export async function downloadWordDocument(): Promise<void> {

    setUpWordDocument();

    // build request
    const createDocumentResponse = await sendHttpRequest(BACKEND_BASE_URL + "/test/createDocument?file=asdf", "post", wordDocument);

    // handle build errors
    if (createDocumentResponse.status !== 200) {
        console.log(createDocumentResponse.error + ": " + createDocumentResponse.message);
        alert("Server Error. Bitte versuche es erneut oder lade die Seite neu!")
    }
        
    // download request
    if (createDocumentResponse.status === 200) 
        FileSaver.saveAs(BACKEND_BASE_URL + "/test/download?pdf=false");

    // wait 2 seconds before cleaning up
    await setTimeout(2000);
    
    // clean up request
    sendHttpRequest(BACKEND_BASE_URL + "/test/clearResourceFolder");

    cleanUpWordDocument();
}


function setUpWordDocument(): void {

    const Document = document.getElementsByClassName("Document")[0];
    const inputs = Document.getElementsByTagName("input");

    // iterate all inputs inside "Document"
    Array.from(inputs).forEach((input, i) => {
        // add break at the top of first page to even out COLUMN break bug
        if (i === 1)
            wordDocument.content.push(null);

        pushBasicParagraph(input, inputs, i);
    });
}


async function pushBasicParagraph(currentInput: HTMLInputElement, inputs: HTMLCollectionOf<HTMLInputElement>, i: number): Promise<void> {

    const inputClassName = currentInput.className;
    const inputType = currentInput.type;

    // get text and style
    const basicParagraph = getBasicParagraph(currentInput)!;

    // case: column break
    if (isAddColumnBreak(inputs, i)) 
        addColumnBreak(basicParagraph);

    // case: header
    if (inputClassName === "header" && i !== 0)
        return;

    // case: footer
    if (inputClassName === "footer" && i !== inputs.length - 1)
        return;

    // case: is text
    if (inputType === "text") {
        wordDocument.content.push(basicParagraph.text === "" ? null : basicParagraph);

    // case: is picture
    } else if (inputType === "file")
        // upload files and add one bp each to wordDocument
        await uploadFiles(currentInput, basicParagraph);      
}


function getBasicParagraph(input: HTMLInputElement): BasicParagraph | null {

    let inputValue = input.value

    // case: weird input value
    if (typeof input.value !== "string")
        inputValue = "";

    return {
        text: inputValue, 
        style: getTextInputStyle(input)!
    };
}



export function getTextInputStyle(textInput: HTMLInputElement): BasicStyle | null {

    if (!textInput) {
        console.log("Failed to setup style for basic paragraph.");
        alert("Das hat leider nicht geklappt. Bitte versuche es erneut oder lade die Seite neu!");
        return null;
    }
    
    const textInputStyle = textInput.style;
    
    try {
        return {
            fontSize: Number.parseInt(getTextInputStyleValue(textInput, "font-size", textInputStyle.fontSize)!),
            fontFamily: getTextInputStyleValue(textInput, "font-family", textInputStyle.fontFamily)!,
            color: rgbToHex(getTextInputStyleValue(textInput, "color", textInputStyle.color)!),
            bold: getTextInputStyleValue(textInput, "font-weight", textInputStyle.fontWeight)! === "bold",
            italic: getTextInputStyleValue(textInput, "font-style", textInputStyle.fontStyle)! === "italic",
            underline: getTextInputStyleValue(textInput, "text-decoration", textInputStyle.textDecoration)! === "underline",
            // this condition might change 
            indentFirstLine: Number.parseInt(getTextInputStyleValue(textInput, "margin-left", textInputStyle.marginLeft)!) >= 30,
            indentParagraph: Number.parseInt(getTextInputStyleValue(textInput, "margin-left", textInputStyle.marginLeft)!) >= 60,
            textAlign: getTextInputStyleValue(textInput, "text-align", textInputStyle.textAlign)!.toUpperCase(),
            breakType: null
        }

    // case: no default style found
    } catch (e) {
        console.log(e.name + ": " + e.message);
        alert("Das hat leider nicht geklappt. Bitte versuche es erneut oder lade die Seite neu!");
        return null;
    }
}


function getTextInputStyleValue(textInput: HTMLInputElement, textInputStyleAttribute: string, currentTextInputStyleValue: string): string | null {

    let defaultStyleValue = textInput.computedStyleMap().get(textInputStyleAttribute);

    if (!defaultStyleValue) 
        return null;
    
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

    return hex(rgbRegex[1]) + hex(rgbRegex[2]) + hex(rgbRegex[3]);
}


function hex(rgbStringRegex: string) {

    const rgbRegex = Number.parseInt(rgbStringRegex);
    
    let hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 
    
    return isNaN(rgbRegex) ? "00" : hexDigits[(rgbRegex - rgbRegex % 16) / 16] + hexDigits[rgbRegex % 16];
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


function addColumnBreak(basicParagraph: BasicParagraph): void {

    basicParagraph.style.breakType = "COLUMN";

    // case: no text but column break
    if (basicParagraph.text === "")
        // prevent setting bp to null
        basicParagraph.text = " ";
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
                const response = await sendUploadPicturesRequest(formData, file.name);

                // case: upload failed
                if (response.status !== 200) {
                    console.log(response);
                    alert("Server Error. Bitte versuche es erneut oder lade die Seite neu!")
                    return;
                }

                // add bp with file name for backend
                basicParagraph.text = file.name;
                wordDocument.content.push(basicParagraph);
            }
        }
    }
}


async function sendUploadPicturesRequest(formData: FormData, pictureName: string) {

    const url = BACKEND_BASE_URL + "/test/uploadFile?fileName=" + pictureName;

    try {
        const response = await fetch(url, {
            method: "post",
            body: formData
        });

        return await response.json();

    } catch (e) {
        const prettyResponse: ApiExceptionFormat = {
            status: 500,
            error: e.name,
            message: e.message,
            path: url.replace(BACKEND_BASE_URL, "")
        };

        return prettyResponse;
    }
}


/**
 * Set properties of {@link wordDocument} to default values.
 */
function cleanUpWordDocument(): void {

    wordDocument.content = [];
    wordDocument.tableConfig = null;
}


interface DocumentWrapper {
    content: (BasicParagraph | null)[],
    tableConfig: TableConfig | null
}


interface BasicParagraph {
    text: string, 
    style: BasicStyle
}


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