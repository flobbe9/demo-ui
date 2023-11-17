import Style from "./Style";


/**
 * Interface defining one line in a word document as defined in vorspiel_backend.
 * 
 * @since 0.0.6
 */
export default interface BasicParagraph {
    text: string,
    style: Style
}