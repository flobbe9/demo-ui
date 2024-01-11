import { DOCUMENT_SUFFIX, Side } from "../globalVariables";
import { getJQueryElementById, getTextWidth, isBlank, isNumberFalsy, isStringNumeric, logError, logWarn, stringToNumber } from "./basicUtils";


/**
 * Concat given params in given order using "_".
 * 
 * @param pageIndex index of page
 * @param customId any string to append to end of id
 * @param paragraphIndex index of paragraph
 * @param textInputIndex index of text input
 * @param columnIndex index of column
 * @returns id as string containing all params, valid or not
 */
export function getDocumentId(prefix: string,
                            pageIndex: number,
                            customId?: string | number,
                            columnIndex?: number,
                            paragraphIndex?: number,
                            textInputIndex?: number): string {

    let id = prefix + "_" + pageIndex;

    if (!isNumberFalsy(columnIndex))
        id += "_" + columnIndex;

    if (!isNumberFalsy(paragraphIndex))
        id += "_" + paragraphIndex;

    if (!isNumberFalsy(textInputIndex))
        id += "_" + textInputIndex;

    if (customId)
        id += "_" + customId;

    // this check does not work
    if (!prefix || isNumberFalsy(pageIndex))
        logError("Failed to create text input id: " + id);

    return id;
}


/**
 * Split given id using "_" and expect array like ```["Page", 1, 3]```. <p>
 * 
 * Each element of the array is considered an idPart. So ```idPart = 2``` would return ```3```. <p>
 * 
 * @param id id of text input
 * @param idPart index of the element in the array resulting from ``` id.split("_")```
 * - ```0```: prefix
 * - ```1```: pageIndex
 * - ```2```: columnIndex (optional in id)
 * - ```3```: paragraphIndex (optional in id)
 * - ```4```: textInputIndex (optional in id)
 * - ```length - 1```: customIdPart (optional in id, always last)
 * 
 * @returns the given part of the id or -1 if not found
 */
export function getPartFromDocumentId(id: string, idPart: number): string {

    if (idPart < 0 || idPart > 3 || !id) {
        logError("Failed to get index part from text input id. 'id': " + id + " 'idPart': " + idPart);
        return "";
    }
        
    const arr = id.split("_");

    return arr[idPart];
}


/**
 * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
 * @returns page id of given document element (event if documentId element does not exist) or null
 */
export function getPageIdByDocumentId(documentId: string): string | null {

    // case: no text input selected yet
    if (isBlank(documentId))
        return null;

    const pageIndex = getPartFromDocumentId(documentId, 1);

    return getDocumentId("Page", stringToNumber(pageIndex), "");
}


/**
 * @param documentId in order to identify the column. Must be a columnId or a deeper level (i.e. paragraphId or textInputId). Default is selectedTextInputId
 * @returns column id of given document element (event if documentId element does not exist) or null
 */
export function getColumnIdByDocumentId(documentId: string): string | null {

    // case: no text input selected yet
    if (isBlank(documentId))
        return null;

    const pageIndex = getPartFromDocumentId(documentId, 1);
    const columnIndex = getPartFromDocumentId(documentId, 2);

    return getDocumentId("Column", stringToNumber(pageIndex), "", stringToNumber(columnIndex));
}


/**
 * @param textInputId id of ```<TextInput />``` to check
 * @returns true if element with given id exists in document and has className 'TextInput', else false
 */
export function isTextInputIdValid(textInputId: string): boolean {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return false;

    // case: is no TextInput
    if (!textInput.prop("className").includes("TextInput"))
        return false;

    return true;
}


/**
 * @param textInputId id of the current text input
 * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
 */
export function getNextTextInput(textInputId: string): JQuery | null {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return null;

    const allTextInputs = $(".TextInput");
    const index = allTextInputs.index(textInput);

    // case: has no next text input
    if (allTextInputs.length - 1 === index)
        return null;

    return $(allTextInputs.get(index + 1)!);
}


/**
 * @param textInputId id of the current text input
 * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
 */
export function getPrevTextInput(textInputId: string): JQuery | null {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return null;

    const allTextInputs = $(".TextInput");
    const index = allTextInputs.index(textInput);

    // case: has no prev text input
    if (index === 0)
        return null;

    return $(allTextInputs.get(index - 1)!);
}


/**
 * This calculation is quite inaccurate. Tends to subtract more pixels than necessary which means the fontSize in 
 * Word will be a bit too small.
 * 
 * @param fontSize get the fontSize difference in Word for
 * @returns approximated number of pixels by which the fontSize in the browser should be increased to match the actual fontSize in MS Word
 */
export function getFontSizeDiffInWord(fontSize: number): number {

    if (isNaN(fontSize)) {
        logError("'getFontSizeDiffInWord()' failed. 'fontSize' is NaN")
        return -1;
    }

    return fontSize >= 19 ? Math.ceil(fontSize / 4) : Math.ceil(fontSize / 3);
}


/**
 * @param textInputId id of text input to compare text width to
 * @param inputOverhead amount of pixels of input's width that should not be considered for calculation, i.e. padding or border.
 * @param testChars string that is not part of input value but should be included in value when calculating value's width
 * @returns true if width of text is greater than width of input
 */
export function isTextLongerThanInput(textInputId: string, inputOverhead: number, testChars = ""): boolean {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return false;

    const textInputWidth = getCSSValueAsNumber(textInput.css("width"), 2) - inputOverhead;
    const textWidth = getTextWidth(textInput.prop("value") + testChars, textInput.css("fontSize"), textInput.css("fontFamily"), textInput.css("fontWeight"));

    return textInputWidth < textWidth;
}


/**
 * Append {@link DOCUMENT_SUFFIX} if last chars dont match it.
 * 
 * @param documentFileName to adjust
 * @returns fixed document file name (not altering givn param)
 */
export function adjustDocumentFileName(documentFileName: string): string {

    let fileName = documentFileName.trim();

    fileName = fileName.replaceAll(" ", "_");

    return fileName;
}


/**
 * @param fileName to append suffix to
 * @returns given fileName with {@link DOCUMENT_SUFFIX} appended or unaltered fileName, if fileName is falsy
 *          or has suffix already
 */
export function appendDocxSuffix(fileName: string): string {

    if (!fileName) {
        logWarn("'appendDocxSuffix()' failed. 'fileName' is falsy: " + fileName);
        return fileName;
    }

    const suffix = fileName.substring(fileName.length - 5);

    return suffix !== DOCUMENT_SUFFIX ? fileName += DOCUMENT_SUFFIX : fileName;
}


/**
 * Cut given number of digits from cssValue and try to parse substring to number.
 * 
 * @param cssValue css value e.g: 16px
 * @param unitDigits number of digigts to cut of cssValue string
 * @returns substring of cssValue parsed to number or NaN if parsing failed
 */
export function getCSSValueAsNumber(cssValue: string | number, unitDigits: number): number {

    if (typeof cssValue === "number")
        return cssValue;

    const length = cssValue.length;
    if (unitDigits >= length) {
        // case: is numeric
        if (isStringNumeric(cssValue, true))
            return stringToNumber(cssValue);

        logError("Failed to get css value as number. 'unitDigits' (" + unitDigits + ") too long or 'cssValue' (" + cssValue + ") too short.");
    }

    const endIndex = cssValue.length - unitDigits;

    return stringToNumber(cssValue.substring(0, endIndex));
}


export function isRGB(color: string): boolean {

    return color.toLowerCase().includes("rgb");
}


/**
 * @param rgb string formatted like ```rgb(0, 0, 0)```
 * @returns hex string with '#' prepended
 */
export function rgbStringToHex(rgb: string): string {

    rgb = rgb.replace("rgb(", "");
    rgb = rgb.replace(")", "");

    const rgbArr = rgb.split(",");

    return rgbNumbersToHex(stringToNumber(rgbArr[0]), 
                           stringToNumber(rgbArr[1]), 
                           stringToNumber(rgbArr[2]));
}


/**
 * @param r red
 * @param g green
 * @param b blue
 * @returns hex string with '#' prepended
 */
function rgbNumbersToHex(r: number, g: number, b: number) {

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

  
/**
 * @param hex string
 * @returns ```[23, 14, 45]``` like ```[r, g, b]```
 */
function hexToRgb(hex: string) {

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? result.map(i => parseInt(i, 16)).slice(1) : null
}


export function getOppositeSide(side: Side): Side {

    if (side === "right")
        return "left";

    if (side === "left") 
        return "right";

    if (side === "top") 
        return "bottom";

    if (side === "bottom") 
        return "top";

    return "none";
}