import { DEFAULT_BASIC_PARAGRAPH_TEXT } from "../utils/GlobalVariables";
import Style, { getDefaultStyle } from "./Style";


/**
 * Interface defining one line in a word document as defined in vorspiel_backend.
 * 
 * @since 0.0.5
 */
export default interface BasicParagraph {
    text: string,
    style: Style
}


export function getDefaultBasicParagraph(): BasicParagraph {
    
    return {
        text: DEFAULT_BASIC_PARAGRAPH_TEXT,
        style: getDefaultStyle()
    }
}