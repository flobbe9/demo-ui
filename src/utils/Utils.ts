import $ from "jquery";
import { PAGE_HEIGHT } from "./GlobalVariables";


export function log(text?: any): void {

    console.log(text);
}


export function logWarn(text?: any): void {

    console.warn(text);
}


export function logError(text?: any): void {

    console.error(text);
}


export function logApiResponse(error: ApiExceptionFormat): void {

    console.error(error.error + ": " + error.message);
}


export function logApiError(message: string, error: Error): void {
    
    console.error(message + ". " + error.message);
}



export function stringToNumber(str: string): number {

    try {
        return Number.parseFloat(str);

    } catch (e) {
        console.error(e);
        return -1;
    }
}


/**
 * // TODO: make this more generic
 * Concat given params in given order using "-", e.g.:"TextInput-\<number\>-\<number\>-\<number\>-\<string\>_\<string\>_\<string\>_\<string\>_\<string\>".
 * 
 * @param pageIndex 
 * @param pageColumnIndex 
 * @param pageColumnLineKey 
 * @param textInputKey 
 * @returns textInput id as string containing all params, valid or not
 */
export function getDocumentId(prefix: string,
                                    pageIndex: number, 
                                    pageColumnIndex: number, 
                                    pageColumnLineKey?: string, 
                                    textInputKey?: string): string {

    let id = prefix + "_" + pageIndex + "_" + pageColumnIndex;

    if (pageColumnLineKey)
        id += "_" + pageColumnLineKey;

    if (textInputKey)
        id += "_" + textInputKey

    // this check does not work
    if (!prefix || isNumberFalsy(pageIndex) || isNumberFalsy(pageColumnIndex))
        console.error("Failed to create text input id: " + id);
        
    return id;
}


/**
 * TODO
 * Split given id using "-" and expect array like ['TextInput', '\<number\>', '\<number\>', '\<number\>', '\<string\>_\<string\>_\<string\>_\<string\>_\<string\>']. <p>
 * 
 * Each element of the array is considered an idPart. So idPart = 4 would return the '\<string\>_...' element of the array.<p>
 * 
 * IdParts: <p>
 * - \[1]: pageIndex
 * - \[2]: pageColumnIndex
 * - \[3]: pageColumnLineIndex (key?)
 * - \[4]: textInputKey
 * 
 * @param textInputId id of text input
 * @param idPart index of the element in the array resulting from {@code textInputId.split("-")}
 * @returns the given part of the id or -1 if not found
 */
export function getPartFromDocumentId(textInputId: string, idPart: number): number | string {

    if (idPart < 1 || idPart > 4 || !textInputId) {
        console.error("Failed to get index part from text input id. 'textInputId': " + textInputId + " 'idPart': " + idPart);
        return -1;
    }
        
    const arr = textInputId.split("_");

    return arr[idPart];
}


export function isNumberFalsy(num: number | null | undefined): boolean {

    return num === undefined || num === null || isNaN(num);
}


export function isBlank(str: string): boolean {

    if (!str && str !== "") {
        console.error("Falsy input str: " + str);
        return false;
    }

    str = str.trim();

    return str.length === 0;
}


export function moveCursor(textInputId: string, start = 0, end = 0): void {

    const textInput = $("#" + textInputId);
    
    if (!textInput.length) {
        console.warn("Failed to move cursor for text input with id: " + textInputId);
        return;
    }

    textInput.prop("selectionStart", start);
    textInput.prop("selectionEnd", end);
}


/**
 * @param textInputId id of text input to compare text width to
 * @returns true if width of text is greater than width of input - 10
 */
export function isTextLongerThanInput(textInputId: string): boolean {

    if (!textInputId) {
        console.error("Failed to determine 'scrollLeft'. Text input id falsy");
        return false;
    }

    const textInput = $("#" + textInputId);

    const textInputWidth = getCSSValueAsNumber(textInput.css("width"), 2) - 13; // no idea why 13 works, jus leave it like this :D
    const textWidth = getTextWidth(textInput.prop("value"), textInput.css("fontSize"), textInput.css("fontFamily"));

    return textInputWidth < textWidth;
}


/**
 * @param text to measure
 * @param fontSize of text
 * @param fontFamily of text
 * @returns width of text
 */
export function getTextWidth(text: string, fontSize: string, fontFamily: string): number { 
     
    const font = fontSize + " " + fontFamily;
    
    const canvas = document.createElement("canvas"); 
    const context = canvas.getContext("2d")!; 
    context.font = font; 
    const width = context.measureText(text).width; 

    return width;
} 


/**
 * Cut given number of digits from cssValue and try to parse substring to number.
 * 
 * @param cssValue css value e.g: 16px
 * @param unitDigits number of digigts to cut of cssValue string
 * @returns substring of cssValue parsed to number or NaN if parsing failed
 */
export function getCSSValueAsNumber(cssValue: string, unitDigits: number): number {

    const length = cssValue.length;
    if (unitDigits >= length)
        console.error("Failed to get css value as number. 'unitDigits' too long");

    const endIndex = cssValue.length - unitDigits;

    return stringToNumber(cssValue.substring(0, endIndex));
}


/**
 * @param width css value as string, possibly with unit appended
 * @param unitDigits to cut from width in order to get the plain number
 * @returns width in percent relative to window width as string with a '%' appended
 */
export function getWidthRelativeToWindow(width: string | number, unitDigits: number): string {

    const windowWidth = $(window).width();
    if (!windowWidth) {
        console.error("Failed to get width in percent. 'windowWidth' is falsy");
        return "";
    }

    // TODO: will this work if one line has not the same width as the window?
    const widhInPercent = (getCSSValueAsNumber(width.toString(), unitDigits) / windowWidth) * 100;

    return widhInPercent + "%";
}


/**
 * @param height css value as string, possibly with unit appended
 * @param unitDigits to cut from height in order to get the plain number
 * @returns height in percent relative to {@link PAGE_HEIGHT} as string with a '%' appended
 */
export function getHeightRelativeToPageHeight(height: string, unitDigits: number): string {

    const heightInPercent = (getCSSValueAsNumber(height, unitDigits) / PAGE_HEIGHT) * 100;

    return (Math.round(heightInPercent * 100)) / 100 + "%";
}


export function isKeyAlphaNumeric(keyCode: number): boolean {

    if (isNumberFalsy(keyCode)) {
        logError("Failed to determine if key is alpha numeric. 'keyCode' is falsy.");
        return false;
    }

    return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90);
}


/**
 * Copy of backend object, named the same.
 * 
 * @since 0.0.1
 */
interface ApiExceptionFormat {
    status: number,
    error: string,
    message: string,
    path: string
}