import BasicParagraph, { getDefaultBasicParagraph } from "../abstract/BasicParagraphs";
import DocumentWrapper from "../abstract/DocumentWrapper";
import { getTextInputStyle } from "../abstract/Style";
import TableConfig from "../abstract/TableConfig";
import { BreakType } from "../enums/Breaktype";
import { Orientation } from "../enums/Orientation";
import { BACKEND_BASE_URL, DEFAULT_BASIC_PARAGRAPH_TEXT, TABLE_CONFIG } from "../utils/GlobalVariables";
import { downloadFileByUrl, getDocumentId, getPartFromDocumentId, isBlank, log, logWarn, stringToNumber } from "../utils/Utils";
import fetchJson from "../utils/fetch/fetch";


const documentBuilderMapping = "/api/documentBuilder";

// TODO: remember to add empty line after table (in case of column break)


/**
 * Send request to backend to download document either as pdf or docx file.
 *  
 * @param pdf if true, a pdf file is returned by backend
 */
export async function downloadDocument(pdf: boolean, documentFileName: string) {
    
    const fileName = documentFileName || "Dokument_1.docx";
    const url = BACKEND_BASE_URL + documentBuilderMapping + "/download?pdf=" + pdf + "&fileName=" + fileName;

    downloadFileByUrl(url);
}


/**
 * Iterate document, collect all ```BasicParagraph```s and send build request to backend.
 * 
 * @param orientation of the document
 * @param numColumns number of columns in the document
 */
export async function buildDocument(orientation: Orientation, numColumns: number): Promise<any> {

    const body: DocumentWrapper =  {
        content: buildContent(numColumns),
        tableConfigs: [],
        landscape: orientation === Orientation.LANDSCAPE,
        numColumns: numColumns
    }

    // TODO
    // case: is table
    // if (isTable(columnType)) 
    //     body.tableConfig = getTableConfig(columnType);

    return await fetchJson(BACKEND_BASE_URL + documentBuilderMapping + "/createDocument", "post", body);
}


/**
 * Iterate all ```<Column />``` elements in ```<Document />``` and map text and style to array of ```BasicParagraph```s.<p>
 * 
 * Add default ```BasicParagraph``` at start and end for header and footer (currently empty).
 * 
 * @param numColumns number of columns in document
 * @returns array of all ```BasicParagraph```s in document
 */
function buildContent(numColumns: number): BasicParagraph[] {

    const columns = $(".Column");

    const content: BasicParagraph[] = [];

    // header (none)
    content.push(getDefaultBasicParagraph());

    // heading
    const heading = $(".heading");
    const headingText = getTextInputContent(heading);
    if (!isBlank(headingText))
        content.push({text: headingText, style: getTextInputStyle(heading)});

    // body
    Array.from(columns).forEach(column => {
        const columnId = column.id;
        const pageIndex = stringToNumber(getPartFromDocumentId(columnId, 1));
        const columnIndex = stringToNumber(getPartFromDocumentId(columnId, 2));

        buildColumn(pageIndex, columnIndex, content, numColumns);
    });
    
    // footer (none)
    content.push(getDefaultBasicParagraph());

    return content;
}


/**
 * Iterate ```<TextInput />``` elements of column and add text and style as ```BasicParagraph``` to given ```allBasicParagraphs```.
 * 
 * @param pageIndex index of page of column to iterate
 * @param columnIndex index of column to iterate
 * @param allBasicParagrahps array of all ```BasicParagraphs``` collected so far
 * @param numColumns number of columns in document
 * @see BasicParagraph
 */
function buildColumn(pageIndex: number, columnIndex: number, allBasicParagrahps: BasicParagraph[], numColumns: number): void {

    const columnId = getDocumentId("Column", pageIndex, "", columnIndex);
    const columnTextInputs = $("#" + columnId + " .TextInput");

    // case: no text inputs yet
    if (!columnTextInputs.length) {
        logWarn("Failed to build column. No text inputs rendered yet. 'columnId': " + columnId);
        return;
    }

    // iterate text inputs
    Array.from(columnTextInputs).forEach(textInputElement => {
        const textInputId = textInputElement.id;
        const textInput = $("#" + textInputId);

        let text = getTextInputContent(textInput);
        if (isBlank(text))
            text = DEFAULT_BASIC_PARAGRAPH_TEXT;

        allBasicParagrahps.push({text: text, style: getTextInputStyle(textInput)})
    });

    // case: is not very last column
    if (!(isLastPage(columnId) && isLastColumn(columnId, numColumns)))
        addColumnBreak(allBasicParagrahps);
}


/**
 * @param textInput input element of type ```text``` to get ```value``` from
 * @returns ```value``` from input element or ```""``` if ```textInput``` is falsy
 */
function getTextInputContent(textInput: JQuery): string {

    // case: input falsy
    if (!textInput.length) {
        logWarn("Failed to get text input content. 'textInput' not present");
        return ""
    }

    // case: not a text input
    if (textInput.prop("type") !== "text") {
        logWarn("Failed to get text input content. 'textInput' type does not equal 'text'");
        return "";
    }
    
    return textInput.prop("value");
}


/**
 * Add column break at last ```BasicParagraph``` of given list.
 * 
 * @param basicParagraphs array of ```BasicParagraph```s added so far
 */
function addColumnBreak(basicParagraphs: BasicParagraph[]): void {

    const basicParagraph = basicParagraphs[basicParagraphs.length - 1];
    if (!basicParagraph) {
        logWarn("Failed to column break. 'basicParagraph' is falsy");
        return;
    }
    basicParagraph.style.breakType = BreakType.COLUMN;
}


/**
 * @param documentId any id formatted like ```"Prefix_pageIndex_columnIndex"...```
 * @returns true if page of ```documentId``` is last of document
 */
function isLastPage(documentId: string): boolean {

    const pageIndex = stringToNumber(getPartFromDocumentId(documentId, 1));

    return $("#Page_" + (pageIndex + 1)).length === 0;
}


/**
 * @param documentId any id formatted like ```"Prefix_pageIndex_columnIndex"...```
 * @param numColumns number of columns in document
 * @returns true if column of ```documentId``` is on it's page
 */
function isLastColumn(documentId: string, numColumns: number): boolean {

    const columnIndex = getPartFromDocumentId(documentId, 2);

    return stringToNumber(columnIndex) === numColumns - 1;
}


/**
 * @param columnType type of column
 * @returns true if this column is a table
 */
function isTable(columnType: number): boolean {

    return columnType === 6 ||
           columnType === 7 ||
           columnType === 8;
}


function getTableConfig(columnType: number): TableConfig {

    const numRows = 10;// TODO

    return {
        numColumns: TABLE_CONFIG[columnType].numColumns,
        numRows: 0, // iterate and count
        startIndex: TABLE_CONFIG[columnType].startIndex
    };
}