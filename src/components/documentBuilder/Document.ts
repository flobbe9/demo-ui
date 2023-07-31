/** The final document that will be processed. */
export const wordDocument:Document = {
    content: [],
    tableConfig: null
}

let currentIndex = 0;


export function setCurrentIndex(newCurrentIndex: number) {

    currentIndex = newCurrentIndex;
}

export function getCurrentIndex() {

    alert(currentIndex)

    return currentIndex;
}


interface Document {
    content: (BasicParagraph | null)[],
    tableConfig: TableConfig | null
}


interface BasicParagraph {
    text: string, 
    style: Style
}


export interface Style {
    fontSize: number,
    fontFamily: string,
    color: string,
    bold: boolean,
    italic: boolean,
    underline: boolean,
    indentFirstLine: boolean,
    indentParagraph: boolean,
    textAlign: string,
    breakType: string | null
}


interface TableConfig {
    numColulmns: number,
    numRows: number,
    startIndex: number,
    endIndex: number
}