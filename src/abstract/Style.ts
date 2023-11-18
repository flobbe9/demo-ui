import { BreakType } from "../enums/Breaktype";
import { getCSSValueAsNumber, logError, rgbStringToHex, stringToNumber } from "../utils/Utils";


/**
 * Interface defining a style object as defined in vorspiel_backend.
 * 
 * @since 0.0.6
 */
export default interface Style {
    fontSize: number,
    fontFamily: string,
    /** as hexa deciaml WITHOUT the '#' appended */
    color: string, 
    bold: boolean,
    italic: boolean,
    underline: boolean,
    textAlign: string,
    breakType: BreakType | null
}


/**
 * @param textInput text input element
 * @returns Style object with style attributes from text input (breakType always null) or a default style object
 */
export function getTextInputStyle(textInput: JQuery): Style {
    
    // case: textInput falsy
    if (!textInput.length) {
        logError("Failed to get style from text input. 'textInput' is falsy. Returning default style instead");
        return getDefaultStyle();
    }

    return {
        fontSize: getCSSValueAsNumber(textInput.css("fontSize"), 2),
        fontFamily: textInput.css("fontFamily"),
        color: rgbStringToHex(textInput.css("color")).replace("#", ""),
        bold: isTextInputBold(textInput),
        italic: textInput.css("fontStyle") === "italic",
        underline: textInput.css("textDecoration") === "underline",
        textAlign: textInput.css("textAlign").toUpperCase(),
        breakType: null
    }
}


function isTextInputBold(textInput: JQuery): boolean {

    const fontWeight = textInput.css("fontWeight");

    // case: is number
    if (!Number.isNaN(fontWeight)) {
        const fontWeightNumber = stringToNumber(fontWeight);
        return fontWeightNumber >= 700; 
    }

    // case: is string
    return fontWeight.toLowerCase() === "bold";
}


export function getDefaultStyle(): Style {

    return {
        fontSize: 14,
        fontFamily: "Arial",
        color: "000000",
        bold: false,
        italic: false,
        underline: false,
        textAlign: "LEFT",
        breakType: null
    };
}