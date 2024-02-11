import { DEFAULT_DOCUMENT_FILE_NAME, DOCX_SUFFIX, FONT_SIZES_WHOLE_SCALE, PDF_SUFFIX, Side, DOCUMENT_FILE_PREFIX_PATTERN, DOCUMENT_FILE_SUFFIX_PATTERN } from "../globalVariables";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCursorIndex, getJQueryElementById, getTextWidth, getTotalTabWidthInText, insertString, isBlank, isNumberFalsy, isStringNumeric, log, logError, logWarn, matchesAll, stringToNumber } from "./basicUtils";


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

    if (!prefix || isNumberFalsy(pageIndex))
        logError("Failed to create text input id. Falsy prefix: " + prefix + " or falsy pageIndex: " + pageIndex);

    let id = prefix + "_" + pageIndex;

    if (!isNumberFalsy(columnIndex))
        id += "_" + columnIndex;

    if (!isNumberFalsy(paragraphIndex))
        id += "_" + paragraphIndex;

    if (!isNumberFalsy(textInputIndex))
        id += "_" + textInputIndex;

    if (customId)
        id += "_" + customId;

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

    if (idPart < 0 || !id) {
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
 * @param debug if true a warn log will be displayed in case of falsy id, default is true
 * @returns true if element with given id exists in document and has className 'TextInput', else false
 */
export function isTextInputIdValid(textInputId: string, debug = true): boolean {

    const textInput = getJQueryElementById(textInputId, debug);
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
 * @param debug if true a warn log will be displayed in case of falsy id, default is true
 * @returns JQuery of the next ```<TextInput>``` ```<input />``` tag or null if not found
 */
export function getPrevTextInput(textInputId: string, debug = true): JQuery | null {

    const textInput = getJQueryElementById(textInputId, debug);
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
 * @param msWordFontSize font size in ms word
 * @returns the matching font size for browser. Adds a cretain amount to msWord font size
 */
export function getBrowserFontSizeByMSWordFontSize(msWordFontSize: number): number {

    return msWordFontSize + getFontSizeDiffInWord(msWordFontSize);
}


/**
 * @param browserFontSize font size in browser
 * @returns the matching font size for ms word. Adds a cretain amount to browser font size
 */
export function getMSWordFontSizeByBrowserFontSize(browserFontSize: number): number {

    const msWordFontSize = FONT_SIZES_WHOLE_SCALE.find(([msWordFontSize, fontSize]) => fontSize === browserFontSize);

    return msWordFontSize ? msWordFontSize[0] : -1;
}


/**
 * @param textInputId id of text input to compare text width to
 * @param testChars string that is not part of input value but should be included in value when calculating value's width
 * @param fontSize to use when calculating the text width instead of the font size of given text input
 * @returns true if width of text is greater than width of input
 */
export function isTextLongerThanInput(textInputId: string, testChars: string, fontSize?: string): boolean {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return false;

    // insert test chars at correct position
    const cursorIndex = getCursorIndex(textInputId);
    let textInputValue = textInput.prop("value");
    textInputValue = insertString(textInputValue, testChars, cursorIndex);

    // measure width of text and tabs
    const textInputWidth = getCSSValueAsNumber(textInput.css("width"), 2) - getTextInputOverhead(textInputId);
    const textWidth = getTextWidth(textInputValue, fontSize || textInput.css("fontSize"), textInput.css("fontFamily"), textInput.css("fontWeight"));
    const totalTabWidth = getTotalTabWidthInText(textInputValue, fontSize || textInput.css("fontSize"), textInput.css("fontFamily"), textInput.css("fontWeight"));

    return textInputWidth < textWidth + totalTabWidth;
}
    

/**
 * @param textInputId id of the text input to check
 * @returns any space of selectedTextInput element's width like padding etc. that cannot be occupied by the text input value (in px).
 *          Return 0 if textInputId param is invalid
 */
export function getTextInputOverhead(textInputId: string): number {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return 0;

    // add up padding and border
    const paddingRight = getCSSValueAsNumber(textInput.css("paddingRight"), 2);
    const paddingLeft = getCSSValueAsNumber(textInput.css("paddingLeft"), 2);
    const borderRightWidth = getCSSValueAsNumber(textInput.css("borderRightWidth"), 2);
    const borderLefttWidth = getCSSValueAsNumber(textInput.css("borderLeftWidth"), 2);

    return paddingRight + paddingLeft + borderRightWidth + borderLefttWidth;
}


/**
 * Trim file name and replace white space chars with '_'. 
 * If valid suffix is missing, append one depending on ```pdf``` param
 * 
 * @param documentFileName to adjust
 * @param pdf if true {@link PDF_SUFFIX} will be appended, else {@link DOCX_SUFFIX}
 * @returns valid document file name (not altering given param) or null if file name param is invalid
 */
export function adjustDocumentFileName(documentFileName: string | undefined, pdf = false): string | null {

    const [isPrefixValid, isSuffixValid] = isFileNameValid(documentFileName);

    // case: prefix invalid
    if (!isPrefixValid) {
        log(documentFileName + " is invalid")
        return null;
    }

    let fileName = documentFileName!.trim();

    fileName = fileName.replaceAll(" ", "_");

    // case: suffix invalid
    if (!isSuffixValid)
        // case: prefix + suffix invalid too
        if (!matchesAll(fileName, DOCUMENT_FILE_PREFIX_PATTERN))
            return null;

        // case: prefix + suffix valid
        else
            fileName = fileName += pdf ? PDF_SUFFIX : DOCX_SUFFIX;

    return fileName;
}


/**
 * @param fileName to check
 * @return true if file name without suffix matches {@link DOCUMENT_FILE_PREFIX_PATTERN} and suffix matches
 *         {@link DOCUMENT_FILE_SUFFIX_PATTERN}
 * 
 * @see {@link DOCX_SUFFIX}
 * @see {@link PDF_SUFFIX}
 */
export function isFileNameValid(fileName: string | undefined): [boolean, boolean] {

    const prefixAndSuffix = separateFileNameSuffix(fileName || "");

    // case: falsy fileName
    if (!prefixAndSuffix)
        return [false, false];

    const prefix = prefixAndSuffix[0];
    const suffix = prefixAndSuffix[1];

    return [matchesAll(prefix, DOCUMENT_FILE_PREFIX_PATTERN), suffix.match(DOCUMENT_FILE_SUFFIX_PATTERN) !== null];
}


/**
 * @param fileName to get prefix and suffix from
 * @returns a touple with```[prefix, suffix]``` where suffix is a substring starting at the last '.' of given file name. 
 *          I.e. ```Hello.world.pdf``` would return ```["Hello.world", ".pdf"]```.
 *          Return ```null``` if fileName is blank.
 */
function separateFileNameSuffix(fileName: string): [string, string] | null {

    if (isBlank(fileName))
        return null;

    const lastDotIndex = fileName.lastIndexOf(".");

    // case: no '.' at all
    if (lastDotIndex === -1)
        return [fileName, ""];

    const prefix = fileName.substring(0, lastDotIndex);
    const suffix = fileName.substring(lastDotIndex);

    return [prefix, suffix];
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