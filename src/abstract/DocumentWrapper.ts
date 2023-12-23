import BasicParagraph from "./BasicParagraphs";
import TableConfig from "./TableConfig";


/**
 * Inteface defining the final request body to send to vorspiel_backend.
 * 
 * @since 0.0.5
 */
export default interface DocumentWrapper {
    content: (BasicParagraph | null)[],
    tableConfigs: TableConfig[],
    landscape: boolean,
    numColumns: number
}