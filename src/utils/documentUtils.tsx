import { getDocumentId, getPartFromDocumentId, isBlank, logWarn, stringToNumber } from "./basicUtils";


/**
 * @param id to find in html document
 * @returns a JQuery with all matching elements or null if no results
 */
export function getJQueryElementById(id: string): JQuery | null {

    // case: blank
    if (isBlank(id)) {
        logWarn("id blank: " + id);
        return null;
    }

    const element = $("#"  + id);

    // case: not present
    if (!element.length) {
        logWarn("falsy id: " + id);
        return null;
    }

    return element;
}


/**
 * @param className to find in html document
 * @returns a JQuery with all matching elements or null if no results
 */
export function getJQueryElementByClassName(className: string): JQuery | null {

    // case: blank
    if (isBlank(className)) {
        logWarn("className blank: " + className);
        return null;
    }

    const element = $("."  + className);

    // case: not present
    if (!element.length) {
        logWarn("falsy className: " + className);
        return null;
    }

    return element;
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