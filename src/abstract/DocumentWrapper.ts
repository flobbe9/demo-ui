import BasicParagraph from "./BasicParagraphs";
import TableConfig from "./TableConfig";


/**
 * Inteface defining the final request body to send to document_builder api.
 * 
 * @since 0.0.5
 */
export default interface DocumentWrapper {
    content: (BasicParagraph | null)[],
    tableConfigs: TableConfig[],
    landscape: boolean,
    fileName: string,
    numColumns: number,
    numSingleColumnLines: number
}