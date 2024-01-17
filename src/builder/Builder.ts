import BasicParagraph, { getDefaultBasicParagraph } from "../abstract/BasicParagraphs";
import DocumentWrapper from "../abstract/DocumentWrapper";
import { getTextInputStyle } from "../abstract/Style";
import { BreakType } from "../enums/Breaktype";
import { Orientation } from "../enums/Orientation";
import { BACKEND_BASE_URL, DEFAULT_BASIC_PARAGRAPH_TEXT, SINGLE_COLUMN_LINE_CLASS_NAME, getOriginalFontSizeByFakeFontSize } from "../globalVariables";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { downloadFileByUrl, isBlank, log, logApiResponse, logError, logWarn, stringToNumber } from "../utils/basicUtils";
import { appendDocxSuffix, getDocumentId, getPartFromDocumentId } from "../utils/documentBuilderUtils";
import fetchJson from "../utils/fetchUtils";


const documentBuilderMapping = "/api/documentBuilder";

// TODO: remember to add empty line after table (in case of column break)


/**
 * Send request to backend to download document either as pdf or docx file.
 *  
 * @param pdf if true, a pdf file is returned by backend
 */
export function downloadDocument(pdf: boolean) {
    
    const url = BACKEND_BASE_URL + documentBuilderMapping + "/download?pdf=" + pdf;

    // TODO: dont stay on localhost:4001 in case of error
    downloadFileByUrl(url);
}


/**
 * Iterate document, collect all ```BasicParagraph```s and send build request to backend.
 * 
 * @param orientation of the document
 * @param numColumns number of columns in the document
 * @param docxFileName full name of the document (including suffix)
 * @return promise of json response
 */
export async function buildDocument(orientation: Orientation, numColumns: number, docxFileName: string, numSingleColumnLines = 0): Promise<any> {

    const fileName = docxFileName ? appendDocxSuffix(docxFileName) : "Dokument_1.docx";

    const body: DocumentWrapper =  {
        content: buildContent(numColumns),
        tableConfigs: [],
        landscape: orientation === Orientation.LANDSCAPE,
        fileName: fileName,
        numColumns: numColumns,
        numSingleColumnLines: numSingleColumnLines
    }

    // TODO
    // case: is table

    const jsonResponse = await fetchJson(BACKEND_BASE_URL + documentBuilderMapping + "/buildAndWrite", "post", body);

    if (jsonResponse.status !== 200)
        logApiResponse(jsonResponse);

    return jsonResponse;
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
    let columnTextInputs = $("#" + columnId + " .TextInput");
    
    // case: no text inputs yet
    if (!columnTextInputs.length) {
        logWarn("Failed to build column. No text inputs rendered yet. 'columnId': " + columnId);
        return;
    }
    
    // case: first page first column
    if (pageIndex === 0 && columnIndex === 0 ) {
        // add single column lines
        const linesAsSingleColumn = $("." + SINGLE_COLUMN_LINE_CLASS_NAME);
        columnTextInputs = columnTextInputs.add(linesAsSingleColumn);
    }

    // iterate text inputs
    Array.from(columnTextInputs).forEach(textInputElement => {
        const textInputId = textInputElement.id;
        const textInput = $("#" + textInputId);

        let text = getTextInputContent(textInput);
        if (isBlank(text))
            text = DEFAULT_BASIC_PARAGRAPH_TEXT;

        const style = getTextInputStyle(textInput);
        // fix font size for MS Word
        style.fontSize = getOriginalFontSizeByFakeFontSize(style.fontSize);

        allBasicParagrahps.push({text: text, style})
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
    if (!textInput.length) 
        return ""
    
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