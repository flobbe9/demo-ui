export const BACKEND_BASE_URL = "" + process.env.REACT_APP_BACKEND_BASE_URL;
export const USER_SERVICE_BASE_URL = "" + process.env.REACT_APP_USER_SERVICE_BASE_URL;

// TODO: improove this
export const fontFamilies = [
    "Arial", 
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT"
]

export const TAB_SYMBOL = "//TAB";

export const NO_TEXT_INPUT_SELECTED = "Wähle zuerst ein Texteingabefeld aus.";

export const MAX_NUM_TEXTINPUTS_PORTRAIT = 13;

export const MAX_NUM_TEXTINPUTS_LADNSCAPE = 20;

// TODO: calculate this with padding, margin and border of input
/** in px, means 24 lines of inputs with a height of 27px (16px fontSize at the moment) */
export const PAGE_HEIGHT = 648; // add input padding-top and -bottom to this number
// export const PAGE_HEIGHT = 100; // add input padding-top and -bottom to this number

/** 
 * Width of one text input relative to the windwo width (at the moment). 
 * Not constant because it changes with the orientation 
 */
let TEXT_INPUT_WIDTH = 100 / 13;
export function getTextInputWidth(): number {

    return TEXT_INPUT_WIDTH;
}

export function setTextInputWidth(textInputWidth: number): void {

    TEXT_INPUT_WIDTH = textInputWidth;
}


// calculate input width in percent for cases:
    // protrait
        // 1, 2, 3 columns
    // landscape
        // 1, 2, 3 columns