import BasicParagraph from "../abstract/BasicParagraphs";
import DocumentWrapper from "../abstract/DocumentWrapper";
import Style, { getTextInputStyle } from "../abstract/Style";
import { BreakType } from "../enums/Breaktype";
import { Orientation } from "../enums/Orientation";
import { BACKEND_BASE_URL } from "../utils/GlobalVariables";
import { getDocumentId, getPartFromDocumentId, isBlank, log, logWarn, stringToNumber } from "../utils/Utils";
import sendHttpRequest from "../utils/fetch/fetch";


export async function buildDocument(orientation: Orientation, numColumns: number) {

    const body = buildDocumentWrapper(orientation, numColumns);

    const jsonResponse = await sendHttpRequest(BACKEND_BASE_URL + "/api/documentBuilder/createDocument", "post", body);
    
    log(jsonResponse)
}


function buildDocumentWrapper(orientation: Orientation, numColumns: number): DocumentWrapper {

    return {
        content: buildContent(),
        tableConfig: null,
        landscape: orientation === Orientation.LANDSCAPE,
        numColumns: numColumns
    }
}

function buildContent(): (BasicParagraph | null)[] {

    const columns = $(".Column");

    const content: (BasicParagraph | null)[] = [];

    // header
    content.push(null);

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

        buildColumn(pageIndex, columnIndex, content);
    });
    
    // footer (none)
    content.push(null);

    return content;
}


// TODO: what if column is empty, will column break work?
function buildColumn(pageIndex: number, columnIndex: number, allBasicParagrahps: (BasicParagraph | null)[]) {

    log("Starting to build column...");

    const columnId = getDocumentId("Column", pageIndex, "", columnIndex);
    const columnTextInputs = $("#" + columnId + " .TextInput");

    // case: no text inputs yet
    if (!columnTextInputs.length) {
        logWarn("Failed to build column. No text inputs rendered yet. 'columnId': " + columnId);
        return [];
    }

    // iterate text inputs
    Array.from(columnTextInputs).forEach(textInputElement => {
        const textInputId = textInputElement.id;
        const textInput = $("#" + textInputId);

        const text = getTextInputContent(textInput);

        // case: no text
        if (isBlank(text))
            allBasicParagrahps.push(null);

        // case: normal paragraph
        else
            allBasicParagrahps.push({text: text, style: getTextInputStyle(textInput)})
    });

    // add column break
    addColumnBreakAtColumnEnd(allBasicParagrahps);
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


function addColumnBreakAtColumnEnd(basicParagraphs: (BasicParagraph | null)[]): void {

    for (let i = basicParagraphs.length - 1; i >= 0; i--) {
        const basicParagraph = basicParagraphs[i];
        if (basicParagraph) {
            basicParagraph.style.breakType = BreakType.COLUMN;
            return;
        }
    }
}