import BasicParagraph from "./BasicParagraphs";
import TableConfig from "./TableConfig";


/**
 * Inteface defining the final request body to send to vorspiel_backend.
 * 
 * @since 0.0.6
 */
export default interface DocumentWrapper {
    content: (BasicParagraph | null)[],
    tableConfig: TableConfig | null,
    landscape: boolean,
    numColumns: number
}