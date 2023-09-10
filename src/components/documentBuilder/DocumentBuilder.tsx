import React, { useEffect, useState } from "react";
import sendHttpRequest, { ApiExceptionFormat } from "../../utils/fetch/fetch";
import "../styles/DocumentBuilder.css";
import Document, { getPageCount } from "./Document";
import FileSaver from "file-saver"
import { setTimeout } from "timers-promises";
import { BACKEND_BASE_URL } from "../../utils/GlobalVariables";
import StylePanel, { isHeaderFooter } from "./style/StylePanel";
import { getColumnPositionByBasicParagraphId, getLastBasicParagraphIdInColumn, getPageNumberByBasicParagraphId } from "./BasicParagraph";
import { logError } from "../../utils/UtilMethods";
import { LoadingButton } from "@mui/lab";


/** Id of BasicParagraphs text input currently selected */
export let currentBasicParagraphId = "";


export function setCurrentBasicParagraphId(newBasicParagraphId: string) {
    
    currentBasicParagraphId = newBasicParagraphId;
};


// TODO: add onUrl change event, navigate maybe
export default function DocumentBuilder(props) {

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // confirm page refresh / tab close / window close
        // window.addEventListener("beforeunload", (event) => {
        //     event.preventDefault();
        //     event.returnValue = "";
        // });
    }, [])


    async function handleDownload(event): Promise<void> {

        setLoading(true);

        await downloadWordDocument();

        setLoading(false);
    }


    return (
        <div className="DocumentBuilder">
            <div className="displayFlex">
                <div className="randomDiv">{" "}</div>
                <StylePanel />
            </div>

            <div className="displayFlex">
                <Document />
            </div>
                        
            <div className="displayFlex">
                <div className="downloadButtonContainer">
                    <LoadingButton id="downloadButton" className="blackButton blackButtonContained" loading={loading} onClick={handleDownload} loadingIndicator="Downloading..." variant="contained">
                        Download
                    </LoadingButton>
                </div>
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


// TODO: add download method that does not open new tab and returns promise, remove settimeout
async function downloadWordDocument(): Promise<void> {

    // fill object
    const setUpSuccessfully = await fillWordDocument();
    if (!setUpSuccessfully)
        return;

    // build
    const createDocumentResponse = await sendHttpRequest(BACKEND_BASE_URL + "/test/createDocument", "post", wordDocument);
    if (createDocumentResponse.status !== 200) {
        logError(createDocumentResponse);
        alert("Server Error. Bitte versuche es erneut oder lade die Seite neu!");
    }
        
    // download
    if (createDocumentResponse.status === 200) 
        FileSaver.saveAs(BACKEND_BASE_URL + "/test/download?pdf=false");

    // wait 2 seconds before cleaning up
    await setTimeout(2000);
    
    // clean up
    sendHttpRequest(BACKEND_BASE_URL + "/test/clearResourceFolder");

    cleanUpWordDocument();
}


async function fillWordDocument(): Promise<boolean> {

    const Document = document.getElementsByClassName("Document")[0];
    const inputs = Document.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) {
        // add line break at the top of first page to even out COLUMN break bug
        if (i === 1)
            wordDocument.content.push(null);

        const pushedSuccessfully = await pushBasicParagraph(inputs, i);

        if (!pushedSuccessfully)
            return false;
    };

    return true;
}


async function pushBasicParagraph(inputs: HTMLCollectionOf<HTMLInputElement>, i: number): Promise<boolean> {

    const input = inputs[i];
    const inputType = input.type;
    const pageNumber = getPageNumberByBasicParagraphId(input.name);
    const columnPosition = getColumnPositionByBasicParagraphId(input.name);

    // get text and style
    const basicParagraph = createBasicParagraph(input)!;

    // case: column break
    if (isAddColumnBreak(inputs, i, pageNumber, columnPosition)) 
        addColumnBreak(basicParagraph);

    // case: header or footer
    if (isHeaderFooter(input) && !(i === 0 || i === inputs.length - 1)) 
        return true;

    // case: is text
    if (inputType === "text") {
        wordDocument.content.push(basicParagraph.text === "" ? null : basicParagraph);

    // case: is picture
    } else if (inputType === "file") {
        // upload files and add one bp each to wordDocument
        const uploadSuccessful = await uploadFiles(input, basicParagraph);

        if (uploadSuccessful)
            wordDocument.content.push(basicParagraph);
        else
            return false;
    }   
    
    return true;
}


function createBasicParagraph(input: HTMLInputElement): BasicParagraph | null {

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
 * @param pageNumber of the current text input
 * @param columnPosition of the current text input
 * @returns true if current text input has different page type than next one, else false
 */
function isAddColumnBreak(content: HTMLCollectionOf<HTMLInputElement>, currentIndex: number, pageNumber: number, columnPosition: string): boolean {

    try {      
        const currentTextInput = content[currentIndex];

        // case: is last ColumnPage
        if (currentTextInput.name.startsWith("BasicParagraph-" + getPageCount() + "-right-"))
            return false;
        
        // ommit headers and footers
        if (isHeaderFooter(currentTextInput))
            return false;

        return currentTextInput.name === getLastBasicParagraphIdInColumn(pageNumber, columnPosition);

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
 * Iterates all files of a file input and uploads them as {@link FormData}.<p>
 * Will set text of given basicParagraph to file name. Will center the picture.<p>
 * 
 * Backend endpoint has to define a RequestBody with name "file".
 * 
 * @param fileInput html input of type "file" holding the uploaded file
 * @param basicParagraph of current iteration
 */
async function uploadFiles(fileInput: HTMLInputElement, basicParagraph: BasicParagraph): Promise<boolean> {

    const files = fileInput.files;

    if (files) {
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);

            if (file) { 
                // create formData
                const formData = new FormData();
                formData.append("file", file);

                // upload request
                const response = await sendUploadPicturesRequest(formData, file.name);

                // case: upload failed
                if (response.status !== 200) {
                    logError(response);
                    alert("Server Error. Bitte versuche es erneut oder lade die Seite neu!")
                    return false;
                }

                basicParagraph.text = file.name;
                basicParagraph.style.textAlign = "CENTER";
            }
        }
    }

    return true;
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