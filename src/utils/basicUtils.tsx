import $ from "jquery";
import { ApiExceptionFormat } from "../abstract/ApiExceptionFormat";
import { KEY_CODES_GERMAN_LETTERS, NUM_SPACES_PER_TAB, TAB_UNICODE } from "../globalVariables";
import { getCSSValueAsNumber } from "./documentBuilderUtils";
import { fetchAnyReturnBlobUrl } from "./fetchUtils";


export function log(text?: any, debug = false): void {

    if (!debug) {
        console.log(text);
        return;
    }

    try {
        throw Error(text);
        
    } catch (e) {
        console.log(e);
    }
}


export function logWarn(text?: any): void {

    try {
        throw Error(text);
        
    } catch (e) {
        console.warn(e);
    }
}


export function logError(text?: any): void {

    try {
        throw Error(text);
        
    } catch (e) {
        console.error(e);
    }
}


/**
 * Log the all props of given {@link ApiExceptionFormat} response and include the stacktrace.
 * 
 * @param response idealy formatted as {@link ApiExceptionFormat}
 */
export function logApiResponse(response: ApiExceptionFormat): void {

    logError(getTimeStamp() + " " +  response.error + "(" + response.status + "): " + response.message + (response.path ? " " + response.path : ""));
}


/**
 * @param id to find in html document, excluding the jquery prefix "#"
 * @param debug if true a warn log will be displayed in case of falsy id, default is true
 * @returns a JQuery with all matching elements or null if no results
 */
export function getJQueryElementById(id: string, debug = true): JQuery | null {

    // case: blank
    if (isBlank(id)) {
        if (debug)
            logWarn("id blank: " + id);

        return null;
    }

    const element = $("#"  + id);

    // case: not present
    if (!element.length) {
        if (debug)
            logWarn("falsy id: " + id);

        return null;
    }

    return element;
}


/**
 * @param className to find in html document, excluding the jquery prefix "."
 * @param debug if true a warn log will be displayed in case of falsy id, default is true
 * @returns a JQuery with all matching elements or null if no results
 */
export function getJQueryElementByClassName(className: string, debug = true): JQuery | null {

    // case: blank
    if (isBlank(className)) {
        if (debug)
            logWarn("className blank: " + className);
        
        return null;
    }

    const element = $("."  + className);

    // case: not present
    if (!element.length) {
        if (debug)
            logWarn("falsy className: " + className);

        return null;
    }

    return element;
}


export function stringToNumber(str: string | number): number {

    if (typeof str === "number")
        return str;
    
    try {
        return Number.parseFloat(str);

    } catch (e) {
        logError(e);
        return -1;
    }
}


export function isNumberFalsy(num: number | null | undefined): boolean {

    return num === undefined || num === null || isNaN(num);
}


export function isBooleanFalsy(bool: boolean | null | undefined) {

    return bool === undefined || bool === null;
}


/**
 * @param str string to check
 * @returns true if given string is empty or only contains white space chars
 */
export function isBlank(str: string | undefined): boolean {

    if (!str && str !== "") {
        logError("Falsy input str: " + str);
        return false;
    }

    str = str.trim();

    return str.length === 0;
}


/**
 * @param str to check
 * @returns true if and only if ```str.length === 0``` is true 
 */
export function isEmpty(str: string): boolean {

    if (!str && str !== "") {
        logError("Falsy input str: " + str);
        return false;
    }

    return str.length === 0;
}


/**
 * @param length num chars the string should have
 * @returns random string of of alphanumeric chars with given length
 */
export function getRandomString(length = 12): string {

    return Math.random().toString(36).substring(2, length + 2);
}


/**
 * Insert given ```insertionString``` into given ```targetString``` after given index.
 * 
 * I.e: ```insertString("Hello", "X", 1)``` would return ```HXello```.
 * 
 * @param targetString string to insert another string into
 * @param insertionString string to insert 
 * @param insertionIndex index in ```targetString``` to insert into, i.e ```insertionIndex = 0``` would insert at the start
 * @returns result string, does not alter ```targetString```
 */
export function insertString(targetString: string, insertionString: string, insertionIndex: number): string {

    let leftHalft = targetString.substring(0, insertionIndex);
    const rightHalf = targetString.substring(insertionIndex);

    leftHalft += insertionString;

    return leftHalft + rightHalf;
}


/**
 * @param keyCode code of the key e.g ```65``` for letter 'A'
 * @returns true if key is either a letter or a number
 */
export function isKeyAlphaNumeric(keyCode: number): boolean {

    if (isNumberFalsy(keyCode)) {
        logError("Failed to determine if key is alpha numeric. 'keyCode' is falsy.");
        return false;
    }

    return (keyCode >= 48 && keyCode <= 57) || // numbers
           (keyCode >= 65 && keyCode <= 90) || // letters
           KEY_CODES_GERMAN_LETTERS.includes(keyCode); // some german letters
        //    keyCode === 32 || // "Space"
        //    keyCode === 9; // "Tab"
}


/**
 * Move cursor a text input element. If ```start === end``` the cursor will be shifted normally to given position.
 * If ```start !== end``` the text between the indices will be marked.
 * 
 * @param textInputId id of text input element to move the cursor in
 * @param start index of selection start, default is 0
 * @param end index of selection end, default is ```start``` param
 */
export function moveCursor(textInputId: string, start = 0, end = start): void {

    const textInput = getJQueryElementById(textInputId);
    if (!textInput)
        return;

    textInput.prop("selectionStart", start);
    textInput.prop("selectionEnd", end);
}


/**
 * @param textInputId of text input element to check
 * @returns the current index of the cursor of given text input element or -1. If text is marked, the index of selection start is returned
 */
export function getCursorIndex(textInputId: string): number {

    const textInput = getJQueryElementById(textInputId);

    return textInput ? textInput.prop("selectionStart") : -1;
}


/**
 * @param key name of the cookie
 * @returns the cookie value as string
 */
function getCookie(key: string): string {

    return document.cookie.split('; ').filter(row => row.startsWith(key)).map(c=>c.split('=')[1])[0];
}


function confirmPageUnloadEvent(event): void {

    event.preventDefault();
    event.returnValue = "";
}


/**
 * @param text to measure
 * @param fontSize of text, unit should be included
 * @param fontFamily of text
 * @param fontWeight of text, default is "normal"
 * @returns width of text in unit of fontSize (not considering tabs {@link TAB_UNICODE}, use {@link getTotalTabWidthInText()} for tht)
 */
export function getTextWidth(text: string, fontSize: string | number, fontFamily: string, fontWeight = "normal"): number { 

    if (isEmpty(text))
        return 0;
    
    const font = fontWeight + " " + fontSize + " " + fontFamily;
    
    const canvas = document.createElement("canvas"); 
    const context = canvas.getContext("2d")!; 
    context.font = font; 

    // dont measure tabs as this would be inaccurate
    text = text.replaceAll(TAB_UNICODE, "");

    let width = context.measureText(text).width;

    return width;
} 


/**
 * @param fontSize used when measuring the tab chars
 * @param fontFamily used when measuring the tab chars
 * @param fontWeight used when measuring the tab chars
 * @returns the width of a string with {@link NUM_SPACES_PER_TAB} spaces and given styles
 */
export function getSingleTabWidth(fontSize: string | number, fontFamily: string, fontWeight = "normal"): number {

    let tabChars = "";
    for (let i = 0; i < NUM_SPACES_PER_TAB; i++) 
        tabChars += " ";

    return getTextWidth(tabChars, fontSize, fontFamily, fontWeight);
}


/**
 * @param text to measure the tab width of
 * @param fontSize used when measuring the tab chars
 * @param fontFamily used when measuring the tab chars
 * @param fontWeight used when measuring the tab chars
 * @returns the actual width of and only of all tabs in given text, considering that the tab size decreases
 *          when other chars are typed in the same range
 */
export function getTotalTabWidthInText(text: string, fontSize: string | number, fontFamily: string, fontWeight = "normal"): number {

    // case: empty text
    if (isEmpty(text))
        return 0;

    const singleTabWidth = getSingleTabWidth(fontSize, fontFamily, fontWeight);

    let totalTabWidth = 0;

    const sequences = text.split(TAB_UNICODE);
    let containsOnlyTabs = true;

    sequences.forEach((sequence, sequenceIndex) => {
        // case: sequence is tab
        const isLastSequence = sequenceIndex === sequences.length - 1;

        if (isEmpty(sequence) && !isLastSequence) {
            totalTabWidth += singleTabWidth;
            return;

        } else 
            containsOnlyTabs = false;

        let sequenceWidthWithoutTab = getTextWidth(sequence, fontSize.toString(), fontFamily, fontWeight);

        // case: sequence length less than equal tab size
        if (!isLastSequence) {
            // even out browser inaccuracy for text that is close but not equal to tab size
            const diff = sequenceWidthWithoutTab - singleTabWidth;
            if (diff > -4 && diff <=0) 
                sequenceWidthWithoutTab += 4.3;

            // case: text width greater than tab size
            if (sequenceWidthWithoutTab > singleTabWidth)
                sequenceWidthWithoutTab = sequenceWidthWithoutTab % singleTabWidth;
            
            // find actual tab width
            const actualTabWidth = singleTabWidth - sequenceWidthWithoutTab;
            totalTabWidth += actualTabWidth;
        }
    });

    // case: only tabs in text
    if (containsOnlyTabs)
        // even out tab sequence that is falsy added due to split() method
        totalTabWidth -= singleTabWidth;

    return totalTabWidth;
}


/**
 * Create a hidden ```<a href="url" download></a>``` element, click it and remove it from the dom afterwards. Optionally handle
 * given url with {@link fetchAnyReturnBlobUrl} first.
 * Create a hidden ```<a href="url" download></a>``` element, click it and remove it from the dom afterwards. Optionally handle
 * given url with {@link fetchAnyReturnBlobUrl} first.
 * 
 * @param url to make the download request to
 * @param fileName name of file to use for download. If empty, the response header will be searched for a filename
 * @param fetchBlob if true, the given url will be handled by {@link fetchAnyReturnBlobUrl} method first, before beeing passed to ```<a></a>``` tag. 
 *                  In that case, the fileName param should be passed as well or no fileName will be specified at all.
 *                  If false, the given url will be passed directly to ```<a></a>``` tag. Http method should be "get" in that case.
 *                  Default is true
 * @param method http method to use for fetch. Default is "get"
 * @param body to send with the request
 * @param headers json object with strings as keys and values
 * @returns error response as {@link ApiExceptionFormat} if ```fetchBlob``` or nothing if all went well 
 */
export async function downloadFileByUrl(url: string, 
                                        fileName?: string, 
                                        fetchBlob = true,
                                        method = "get", 
                                        body?: object, 
                                        headers = {"Content-Type": "application/octet-stream"} 
                                        ): Promise<ApiExceptionFormat | void> {

    // case: fetch blob first
    if (fetchBlob) {
        const response = await fetchAnyReturnBlobUrl(url, method, body, headers);

        // case: successfully generated url from blob
        if (typeof response === "string")
            url = response;
        else
            return response;
    }

    // create link
    const linkElement = document.createElement('a');

    // add props
    linkElement.href = url;
    if (fileName)
        linkElement.download = fileName;

    // add props
    linkElement.href = url;
    if (fileName)
        linkElement.download = fileName;
    linkElement.style.display = 'none';

    // append
    document.body.appendChild(linkElement);
  
    // trigger link
    linkElement.click();
  
    // remove
    document.body.removeChild(linkElement);
}


/**
 * @param width of element as css value, possibly with unit appended
 * @param unitDigits to cut from width in order to get the plain number
 * @returns width in percent relative to window width as string with a '%' appended
 */
export function getElementWidthRelativeToWindow(width: string | number, unitDigits: number): string {

    const windowWidth = $(window).width();
    if (!windowWidth) {
        logError("Failed to get width in percent. 'windowWidth' is falsy");
        return "";
    }

    // NOTE: will this work if one line has not the same width as the window?
    const widhInPercent = (getCSSValueAsNumber(width.toString(), unitDigits) / windowWidth) * 100;

    return widhInPercent + "%";
}


/**
 * Confirm page refresh, tab close and window close with browser popup
 */
export function confirmPageUnload(): void {

    // confirm page refresh / tab close / window close
    window.addEventListener("beforeunload", confirmPageUnloadEvent);
}


export function removeConfirmPageUnloadEvent(): void {

    window.removeEventListener("beforeunload", confirmPageUnloadEvent);
}


/**
 * Remove given ```removeClass``` className from given ```element```, add given ```addClass``` and then
 * after given ```holdTime``` undo both operations.
 * 
 * @param elementId id of element to flash the className of
 * @param addClass className the element has while flashing 
 * @param removeClass className the element should loose while flashing and get back afterwards
 * @param holdTime time in ms that the border stays with given addClass and without given removeClass, default is 1000
 * @return promise that resolves once animation is finished
 */
export async function flashClass(elementId: string, addClass: string, removeClass?: string, holdTime = 1000) {

    return new Promise((res, rej) => {
        const element = getJQueryElementById(elementId);
        if (!element) {
            rej("'elementId' falsy: " + elementId);
            return;
        }
        // remove old class
        element.removeClass(removeClass);

        // add flash class shortly
        element.addClass(addClass);
        
        const resetCallback = () => {
            element.removeClass(addClass)
            element.addClass(removeClass || "");
        }

        // reset
        setTimeout(() => res(resetCallback()), holdTime);
    });
}


/**
 * Add given css object to given element for given amount of time and reset css values afterwards.
 * 
 * @param elementId id of element to flash the syle of
 * @param flashCss css object (key and value are strings) to apply to given element
 * @param holdTime time in ms to apply the styles before resetting them
 * @returns a Promise which resolves once styles are reset
 */
export async function flashCss(elementId: string, flashCss: Record<string, string>, holdTime = 1000): Promise<void> {
    
    return new Promise((res, rej) => {
        const element = getJQueryElementById(elementId);
        if (!element) {
            rej("'elementId' falsy: " + elementId);
            return;
        }

        const initCss: Record<string, string> = {};

        // set flash styles
        Object.entries(flashCss).forEach(([cssProp, cssVal]) => {
            // save init css entry
            initCss[cssProp] = element.css(cssProp);

            // set flash css value
            element.css(cssProp, cssVal);
        })

        // reset flash styles
        setTimeout(() => {
            res(
                Object.entries(initCss).forEach(([cssProp, cssVal]) => 
                    element.css(cssProp, cssVal))
            );
        }, holdTime)
    });
}


/**
 * @param str string to replace a char in
 * @param replacement string to use as replacement
 * @param startIndex of chars to replace in ```str```
 * @param endIndex of chars to replace in ```str``` (not included), default is ```str.length```
 * @returns string with replacement at given position (does not alter ```str```)
 */
export function replaceAtIndex(str: string, replacement: string, startIndex: number, endIndex = str.length): string {

    const charsBeforeIndex = str.substring(0, startIndex);
    const charsBehindIndex = str.substring(endIndex);

    return charsBeforeIndex + replacement + charsBehindIndex;
}


/**
 * @param expected first value to compare
 * @param actual second value to compare
 * @returns ```expected === actual``` after calling ```trim()``` and ```toLowerCase()``` on both values.
 *          Types wont be considered: ```"1" === 1 = true```
 */
export function equalsIgnoreCase(expected: string | number, actual: string | number): boolean {

    if (!expected || !actual)
        return expected === actual;

    expected = expected.toString().trim().toLowerCase();
    actual = actual.toString().trim().toLowerCase();

    return expected === actual;
}


/**
 * @param arr array to search in
 * @param value string or number to look for
 * @returns true if value is included in array. Uses {@link equalsIgnoreCase} for comparison instead of ```includes()```.
 */
export function includesIgnoreCase(arr: (string | number)[] | string, value: string | number): boolean {

    // case: arr is string
    if (typeof arr === "string")
        return arr.trim().toLowerCase().includes(value.toString().trim().toLowerCase());

    const result = arr.find(val => equalsIgnoreCase(val, value));

    return result ? true : false;
}


/**
 * @param str to check 
 * @param regexp pattern to use for checking
 * @returns true if and only if all chars in given string match given pattern, else false
 */
export function matchesAll(str: string, regexp: RegExp): boolean {

    // iterate chars
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        
        if (char.match(regexp) === null)
            return false;
    }

    return true;
}


export function isStringAlphaNumeric(str: string): boolean {

    // alpha numeric regex
    const regexp = /^[a-z0-9ßäÄöÖüÜ]+$/i;

    return matchString(str, regexp);
}


/**
 * @param str to check
 * @returns true if every char of given string matches regex. Only alphabetical chars including german exceptions
 *          'ßäÄöÖüÜ' are a match (case insensitive).
 */
export function isStringAlphabetical(str: string): boolean {

    // alpha numeric regex
    const regexp = /^[a-zßäÄöÖüÜ]+$/i;

    return matchString(str, regexp);
}


/**
 * @param str to check
 * @param considerDouble if true, ',' and '.' will be included in the regex
 * @returns true if every char of given string matches the numeric regex
 */
export function isStringNumeric(str: string, considerDouble = false): boolean {

    // alpha numeric regex
    let regexp = /^[0-9]+$/;

    if (considerDouble)
        regexp = /^[0-9.,]+$/;

    return matchString(str, regexp);
}


export function setCssVariable(variableName: string, value: string): void {

    document.documentElement.style.setProperty("--" + variableName, value);
}


export function getCssVariable(variableName: string): string {

    return document.documentElement.style.getPropertyValue("--" + variableName);
}


/**
 * @param str to check
 * @param regexp to use for matching
 * @returns true if every char of string matches the regex, trims the string first
 */
function matchString(str: string, regexp: RegExp): boolean {

    str = str.trim();

    let matches = true;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char.match(regexp) === null) {
            matches = false;
            break;
        }
    }

    return matches
}


/**
 * @param date to format, default is now (```new Date()```)
 * @returns nicely formatted string formatted like ```year-month-date hours:minutes:seconds:milliseconds```
 */
function getTimeStamp(date = new Date()): string {

    return date.getFullYear() + "-" + prepend0ToNumber(date.getMonth() + 1) + "-" + prepend0ToNumber(date.getDate()) + " " + 
           prepend0ToNumber(date.getHours()) + ":" + prepend0ToNumber(date.getMinutes()) + ":" + prepend0ToNumber(date.getSeconds()) + ":" + date.getMilliseconds();
}


/**
 * @param num to prepend a 0 to
 * @returns a string representation of given number with a 0 prended if the number has only one digit
 */
function prepend0ToNumber(num: number): string {

    let str = num.toString();

    // case: one digit only
    if (num / 10 < 1)
        str = "0" + str;

    return str;
}