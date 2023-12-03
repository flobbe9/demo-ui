import { BreakType } from "../enums/Breaktype";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, log, logError, rgbStringToHex, stringToNumber } from "../utils/Utils";


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
 * Defines all properties one {@link Style} object can have (as defined in backend)
 */
export type StyleProp = "fontSize" | "fontFamily" | "color" | "bold" | "italic" | "underline" | "textAlign" | "breakType";


/**
 * @param textInput text input element
 * @returns Style object with style attributes from text input (breakType always null) or a default style object
 */
export function getTextInputStyle(textInput: JQuery<any>): Style {
    
    // case: textInput falsy
    if (!textInput.length) {
        logError("Failed to get style from text input. 'textInput' is falsy. Returning default style instead");
        return getDefaultStyle();
    }

    return {
        fontSize: getCSSValueAsNumber(textInput.css("fontSize"), 2),
        fontFamily: textInput.css("fontFamily").replaceAll("\"", ""),
        color: rgbStringToHex(textInput.css("color")).replace("#", ""),
        bold: isTextInputBold(textInput),
        italic: textInput.css("fontStyle") === "italic",
        underline: textInput.css("textDecoration").includes("underline"),
        textAlign: textInput.css("textAlign").toUpperCase(),
        breakType: null
    }
}


/**
 * @param textInput to apply style to
 * @param style to apply
 * @param excludedStyleProps array of style props to not apply
 * @see Style
 * @see StyleProp
 */
export function applyTextInputStyle(textInput: JQuery, style: Style, excludedStyleProps: StyleProp[] = []): void {

    // case: textInput falsy
    if (!textInput.length) {
        logError("Failed to apply style to text input. 'textInput' is falsy");
        return;
    }

    // prepend "#" if hex color
    const color = isRGB(style.color) ? style.color : prependHashTag(style.color);

    if (!excludedStyleProps.includes("fontSize"))
        textInput.css("fontSize", style.fontSize);

    if (!excludedStyleProps.includes("fontFamily"))
        textInput.css("fontFamily", style.fontFamily);

    if (!excludedStyleProps.includes("color"))
        textInput.css("color", color);

    if (!excludedStyleProps.includes("bold"))
        textInput.css("fontWeight", style.bold ? "bold" : "normal");

    if (!excludedStyleProps.includes("italic"))
        textInput.css("fontStyle", style.italic ? "italic" : "normal");

    if (!excludedStyleProps.includes("underline"))
        textInput.css("textDecoration", style.underline ? "underline" : "none");

    if (!excludedStyleProps.includes("textAlign"))
        textInput.css("textAlign", style.textAlign);
}


export function getDefaultStyle(): Style {

    return {
        fontSize: 14,
        fontFamily: "Calibri",
        color: "000000",
        bold: false,
        italic: false,
        underline: false,
        textAlign: "LEFT",
        breakType: null
    };
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


/**
 * @param str to prepend "#" to
 * @returns string with ```newString.charAt(0) === "#"```, does not alter given ```str```
 */
function prependHashTag(str: string): string {

    const firstChar = str.charAt(0);

    return firstChar === "#" ? str : "#" + str;
}


function isRGB(color: string): boolean {

    return color.toLowerCase().includes("rgb");
}