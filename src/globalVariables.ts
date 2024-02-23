import React from "react";
import { getFontSizeDiffInWord } from "./utils/documentBuilderUtils";
import CsrfToken from "./classes/CsrfToken";


export const WEBSITE_NAME = "" + process.env.REACT_APP_WEBSITE_NAME;
export const API_ENV = "" + process.env.REACT_APP_ENV;
export const API_VERSION = "" + process.env.REACT_APP_VERSION;
export const API_NAME = "" + process.env.REACT_APP_API_NAME;
export const DOCUMENT_BUILDER_BASE_URL = "" + process.env.REACT_APP_DOCUMENT_BUILDER_BASE_URL;
export const USER_SERVICE_BASE_URL = "" + process.env.REACT_APP_USER_SERVICE_BASE_URL;

/** 
 * Token that is sent with every request to backend for additional security. 
 * 
 * @see {@link CsrfToken}
 */
export const CSRF_TOKEN: CsrfToken = new CsrfToken("X-CSRF-TOKEN");

export const NUM_PAGES = 2;
export const PAGE_WIDTH_PORTRAIT = "806px";
export const PAGE_WIDTH_LANDSCAPE = "1170px";

export const MAX_NUM_COLUMNS = 3;

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
    "Calibri",
];

export const RAW_FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

export const MAX_FONT_SIZE = RAW_FONT_SIZES[RAW_FONT_SIZES.length - 1];
export const MIN_FONT_SIZE = RAW_FONT_SIZES[0];
/** only numbers, min 8, max 72 */
export const FONT_SIZE_REGEX = /^[8-9]$|^[1-6][0-9]$|^[7][0-2]$/;

/** Formatted like: ```[msWordFontSize, browserFontSize]```. To get browserFontSize add a certain diff to even out font style difference in MS Word */
export const FONT_SIZES = RAW_FONT_SIZES.map(fontSize => [fontSize, fontSize + getFontSizeDiffInWord(fontSize)]);

/** Formatted like: ```[msWordFontSize, browserFontSize]```. Cover all fontSizes from {@link MIN_FONT_SIZE} to {@link MAX_FONT_SIZE} */
export const FONT_SIZES_WHOLE_SCALE = getAllFontSizes();
function getAllFontSizes(): number[][] {

    const allFontSizes: number[][] = [];

    for (let i = MIN_FONT_SIZE; i <= MAX_FONT_SIZE; i++) 
        allFontSizes.push([i, i + getFontSizeDiffInWord(i)])

    return allFontSizes;
}

/** Formatted like {@link FONT_SIZES} but mapping all numbers from {@link MIN_FONT_SIZE} to {@link MAX_FONT_SIZE} */

export type Side = "top" | "right" | "left" | "bottom" | "none";

export const DEFAULT_BASIC_PARAGRAPH_TEXT = "";

export const NO_TEXT_INPUT_SELECTED = "Wähle zuerst ein Texteingabefeld aus.";

/** fontSize of a line that is added to the document (i.e. because there's not enough lines at the moment) */
export const DEFAULT_FONT_SIZE = 14;

/** Number of empty lines on top of every column, becuase of backend */
const NUM_FILLER_LINES = 1;

/** assuming a fontSize of 14 */
export const NUM_LINES_PROTRAIT = 41 - NUM_FILLER_LINES;
/** assuming a fontSize of 19 */
export const MAX_FONT_SIZE_SUM_PORTRAIT = NUM_LINES_PROTRAIT * DEFAULT_FONT_SIZE;

/** assuming a fontSize of 14 */
export const NUM_LINES_LANDSCAPE = 29 - NUM_FILLER_LINES;
/** assuming a fontSize of 19 */
export const MAX_FONT_SIZE_SUM_LANDSCAPE = NUM_LINES_LANDSCAPE * DEFAULT_FONT_SIZE;

export const NUM_SPACES_PER_TAB = 8;
export const TAB_UNICODE = "\t";


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


// export const SELECT_COLOR = "rgb(0, 226, 226)";
export const SELECT_COLOR = "black";


export const SELECTED_STYLE: React.CSSProperties = {
    borderColor: SELECT_COLOR
}


export const DOCX_SUFFIX = ".docx";
export const PDF_SUFFIX = ".pdf";
export const DEFAULT_DOCUMENT_FILE_NAME = "Document_1";
/** Matches any num of any start chars plus '.' plus suffix, i.e. 'asdf.docx' or §$%.pdf */
export const DOCUMENT_FILE_SUFFIX_PATTERN = /.(docx|pdf)$/;
/** Matches any num of alphanumeric chars or '-' or '.' or ' '*/
export const DOCUMENT_FILE_PREFIX_PATTERN = /[\w\-. ]/;


export const BUILDER_PATH = "/";

export const SINGLE_COLUMN_LINE_CLASS_NAME = "SingleColumnLine";

export const DONT_SHOW_AGAIN_COOKIE_NAME = "dontShowAgain";

/** list of key codes that don't display a character when typed inside a text input */
export const KEY_CODES_NO_TYPED_CHAR = [
        17, // command
        91, // meta / windows / mac
        18, // alt
        16, // shift
        20, // capsLock
        27, // escape
        33, // page up
        34, // page down
        37, // arrowLeft
        38, // arrowTop
        39, // arrowRight
        40, // arrowDown
        13, // enter
        8, // backspace
        46, // delete
        45, // insert
        35, // end
        36, // home
        112, // F1
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123 // F12
]

/** alphabetic key codes of german only letters like 'ä' */
export const KEY_CODES_GERMAN_LETTERS = [
    222, // ä / Ä
    192, // ö / Ö
    186, // ü / Ü
    219, // ß / ?
]


// ------------------- Archive

const NUM_LINES_PROTRAIT_OLD: ReadonlyArray<Object> = [{
    8: 76 - NUM_FILLER_LINES,
    9: 68 - NUM_FILLER_LINES,
    10: 61 - NUM_FILLER_LINES,
    11: 54 - NUM_FILLER_LINES,
    12: 51 - NUM_FILLER_LINES,
    14: 44 - NUM_FILLER_LINES,
    16: 38 - NUM_FILLER_LINES,
    18: 34 - NUM_FILLER_LINES,
    20: 31 - NUM_FILLER_LINES,
    22: 28 - NUM_FILLER_LINES,
    24: 26 - NUM_FILLER_LINES,
    26: 24 - NUM_FILLER_LINES,
    28: 22 - NUM_FILLER_LINES,
    36: 17 - NUM_FILLER_LINES,
    48: 13 - NUM_FILLER_LINES,
    72: 9 - NUM_FILLER_LINES
}];

const NUM_LINES_LANDSCAPE_OLD: ReadonlyArray<Object> = [{
    8: 53 - NUM_FILLER_LINES,
    9: 47 - NUM_FILLER_LINES,
    10: 43 - NUM_FILLER_LINES,
    11: 39 - NUM_FILLER_LINES,
    12: 36 - NUM_FILLER_LINES,
    14: 31 - NUM_FILLER_LINES,
    16: 28 - NUM_FILLER_LINES,
    18: 25 - NUM_FILLER_LINES,
    20: 23 - NUM_FILLER_LINES,
    22: 21 - NUM_FILLER_LINES,
    24: 19 - NUM_FILLER_LINES,
    26: 18 - NUM_FILLER_LINES,
    28: 17 - NUM_FILLER_LINES,
    36: 14 - NUM_FILLER_LINES,
    48: 11 - NUM_FILLER_LINES,
    72: 8 - NUM_FILLER_LINES
}];