import { Orientation } from "../enums/Orientation";
import React from "react";

export const BACKEND_BASE_URL = "" + process.env.REACT_APP_BACKEND_BASE_URL;
export const USER_SERVICE_BASE_URL = "" + process.env.REACT_APP_USER_SERVICE_BASE_URL;
export const API_ENV = "" + process.env.REACT_APP_ENV;
export const API_VERSION = "" + process.env.REACT_APP_VERSION;

export const FONT_FAMILIES = [
    "Helvetica",
    "Arial",
    "Arial Black",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Gill Sans",
    "Times New Roman",
    "Georgia",
    "Palatino",
    "Baskerville",
    "Andalé Mono",
    "Courier",
    "Lucida",
    "Monaco",
    "Bradley Hand",
    "Brush Script MT",
    "Luminari",
    "Comic Sans MS",
    "Calibri"
];

export const FONT_SIZES = [
    8,
    9,
    10,
    11,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    36,
    48,
    72
]

export type Side = "top" | "right" | "left" | "bottom" | "none";

export const DEFAULT_BASIC_PARAGRAPH_TEXT = " ";

export const NO_TEXT_INPUT_SELECTED = "Wähle zuerst ein Texteingabefeld aus.";

export const NUM_HEADINGS_PER_COLUMN = 3;

/** 
 * Width of one text input relative to the wirndwo width (at the moment). 
 * Not constant because it changes with the orientation 
 */
let TEXT_INPUT_WIDTH = 100 / 13;
export function getTextInputWidth(): number {

    return TEXT_INPUT_WIDTH;
}

export function setTextInputWidth(textInputWidth: number): void {

    TEXT_INPUT_WIDTH = textInputWidth;
}


export function getNumLinesPerColumn(orientation: Orientation, fontSize: number): number {

    return orientation === Orientation.PORTRAIT ? getNumLinesPerColumnPortraitByFontSize(fontSize) : getNumLinesPerColumnLandscapeByFontSize(fontSize);
}

/** fontSize of a line that is added to the document (i.e. because there's not enough lines at the moment) */
export const FILLER_LINE_FONT_SIZE = 14;

/** Number of empty lines on top of every column, becuase of backend */
const numFillerLines = 1;

const NUM_LINES_PROTRAIT: ReadonlyArray<Object> = [{
    8: 76 - numFillerLines,
    9: 68 - numFillerLines,
    10: 61 - numFillerLines,
    11: 54 - numFillerLines,
    12: 51 - numFillerLines,
    14: 44 - numFillerLines,
    16: 38 - numFillerLines,
    18: 34 - numFillerLines,
    20: 31 - numFillerLines,
    22: 28 - numFillerLines,
    24: 26 - numFillerLines,
    26: 24 - numFillerLines,
    28: 22 - numFillerLines,
    36: 17 - numFillerLines,
    48: 13 - numFillerLines,
    72: 9 - numFillerLines
}];

/**
 * Get number of lines fitting on a single page (or column) in protrait mode.
 * Considering the font size and expecting the whole page (or column) to have the same font size (in px).
 * Expecting no header / footer. 1 line of header / footer would take 2 lines on the page (so with both header and footer
 * present at least 4 lines would have to be added to below values).<p>
 * 
 * {@link numFillerLines} will be subtracted from the number of lines. <p>
 * 
 * Array is read only and has only one object formatted like: ```{fontSize: numLines}```
 */
function getNumLinesPerColumnPortraitByFontSize(fontSize: number): number {

    return NUM_LINES_PROTRAIT[0][fontSize];
}

export const MAX_FONT_SIZE_SUM_PORTRAIT = NUM_LINES_PROTRAIT[0]["14"] * 14;


const NUM_LINES_LANDSCAPE: ReadonlyArray<Object> = [{
    8: 53 - numFillerLines,
    9: 47 - numFillerLines,
    10: 43 - numFillerLines,
    11: 39 - numFillerLines,
    12: 36 - numFillerLines,
    14: 31 - numFillerLines,
    16: 28 - numFillerLines,
    18: 25 - numFillerLines,
    20: 23 - numFillerLines,
    22: 21 - numFillerLines,
    24: 19 - numFillerLines,
    26: 18 - numFillerLines,
    28: 17 - numFillerLines,
    36: 14 - numFillerLines,
    48: 11 - numFillerLines,
    72: 8 - numFillerLines
}];

/**
 * Get number of lines fitting on a single page (or column) in landscape mode.
 * Considering the font size and expecting the whole page (or column) to have the same font size (in px).
 * Expecting no header / footer. 1 line of header / footer would take 2 lines on the page (so with both header and footer
 * present at least 4 lines would have to be added to below values).<p>
 * 
 * {@link numFillerLines} will be subtracted from the number of lines. <p>
 * 
 * Array is read only and has only one object formatted like: ```{fontSize: numLines}```
 */
function getNumLinesPerColumnLandscapeByFontSize(fontSize: number): number {

    return NUM_LINES_LANDSCAPE[0][fontSize];
}

export const MAX_FONT_SIZE_SUM_LANDSCAPE = NUM_LINES_LANDSCAPE[0]["14"] * 14;


const WsPerLineLandscapeFontSize14 = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
const WsPerLinePortraitFontSize14 = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"; // 19px in browser


export const MAX_NUM_TABS = 12;

export const SPACES_PER_TAB = 16;

export const TAB_UNICODE = "0x09";
export const SINGLE_TAB_UNICODE_ESCAPED = "\x09";
export const TAB_UNICODE_ESCAPED = "\x09\x09";


/**
 * Defines the number of columns and the start index for each column type involving a table. Object key is the 
 * column type.
 */
export const TABLE_CONFIG: Readonly<Record<number, {numColumns: number, startIndex: number}>> = {
    6: {
        numColumns: 1,
        startIndex: 1
    },
    7: {
        numColumns: 2,
        startIndex: 1
    },
    8: {
        numColumns: 3,
        startIndex: 1
    }
}


export function isMobileWidth(): boolean {

    return document.documentElement.clientWidth < 800;
}


export const SELECTED_COLOR = "rgb(0, 226, 226)";


export const SELECTED_STYLE: React.CSSProperties = {
    borderColor: SELECTED_COLOR
}


/** format of a word file */
export const DOCUMENT_SUFFIX = ".docx";

export const BUILDER_PATH = "/build";