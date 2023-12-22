import React, { createContext, useContext, useEffect, useState } from "react";
import "../../assets/styles/Column.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getDocumentId, isBlank, log, togglePopup } from "../../utils/Utils";
import Paragraph from "./Paragraph";
import { AppContext } from "../../App";
import { DocumentContext } from "./Document";
import { NUM_HEADINGS_PER_COLUMN, getNumLinesPerColumn } from "../../utils/GlobalVariables";
import { Orientation } from "../../enums/Orientation";


// TODO: num lines per column calculation inaccurate with large headings
export default function Column(props: {
    pageIndex: number,
    columnIndex: number,
    key?: string | number,
    id?: string,
    className?: string
}) {

    const id = getDocumentId("Column", props.pageIndex, props.id, props.columnIndex);
    const className = props.className ? "Column " + props.className : "Column";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);
    
    const [columnType, setColumnType] = useState(1);
    const [numLinesPerParagraph, setNumLinesPerParagraph] = useState(1);
    const [paragraphs, setParagraphs] = useState<React.JSX.Element[]>();
    
    const context = {
        columnType,
        setColumnType,
        updateColumnStates,
        numLinesPerParagraph,
        setNumLinesPerParagraph
    }


    useEffect(() => {
        setParagraphs(initParagraphs(appContext.selectedTextInputStyle.fontSize));

    }, []);


    useEffect(() => {
        // case: rerender this column for font size changes
        if (appContext.getSelectedColumnId() === id)
            setParagraphs(initParagraphs(appContext.columnFontSize));

    }, [appContext.columnHeading1FontSize, appContext.columnHeading2FontSize, appContext.columnHeading3FontSize, appContext.columnFontSize]);


    function initParagraphs(fontSize: string | number): React.JSX.Element[] {

        const paragraphs: React.JSX.Element[] = [];
        const numParagraphs = getNumParagraphs(appContext.orientation, getCSSValueAsNumber(fontSize, 2), getHeadingFontSizes());

        for (let i = 0; i < numParagraphs; i++) 
            paragraphs.push(<Paragraph key={crypto.randomUUID()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex} 
                                        paragraphIndex={i} />)

        return paragraphs;
    }


    /**
     * @returns array of font sizes of headings of this column (ascending from first heading to last). 
     *          Uses hardcoded values from ```<Document />```
     */
    function getHeadingFontSizes(): number[] {

        return [
            !appContext.columnHeading1FontSize ? appContext.selectedTextInputStyle.fontSize : 
                                                getCSSValueAsNumber(appContext.columnHeading1FontSize, 2),
            !appContext.columnHeading2FontSize ? appContext.selectedTextInputStyle.fontSize : 
                                                getCSSValueAsNumber(appContext.columnHeading2FontSize, 2),
            !appContext.columnHeading3FontSize ? appContext.selectedTextInputStyle.fontSize : 
                                                getCSSValueAsNumber(appContext.columnHeading3FontSize, 2),
        ];
    }


    /**
     * Update column font size and render method state in ```<Document />```.
     */
    function updateColumnStates(newTextInputId: string): void {

        const selectedColumnId = appContext.getSelectedColumnId();
        const newSelectedColumnId = appContext.getColumnIdByTextInputId(newTextInputId);

        if (!isBlank(selectedColumnId) && !isBlank(newSelectedColumnId)) {
            const columnTextInputs = $("#" + id + " .paragraphContainer .Paragraph .TextInput");

            // update column font size
            if (columnTextInputs.length > NUM_HEADINGS_PER_COLUMN) {
                const columnFontSize = columnTextInputs.get(3)!.style.fontSize;

                // case: column fontSize has changed
                if (appContext.columnFontSize !== columnFontSize) 
                    appContext.setColumnFontSize(columnFontSize);
            }

            if (columnTextInputs.length) {
                // update heading font sizes
                const columnHeading1FontSize = columnTextInputs.get(0)!.style.fontSize;
                if (appContext.columnHeading1FontSize !== columnHeading1FontSize)
                    appContext.setColumnHeading1FontSize(columnHeading1FontSize);

                const columnHeading2FontSize = columnTextInputs.get(1)!.style.fontSize;
                if (appContext.columnHeading2FontSize !== columnHeading2FontSize)
                    appContext.setColumnHeading2FontSize(columnHeading2FontSize);

                const columnHeading3FontSize = columnTextInputs.get(2)!.style.fontSize;
                if (appContext.columnHeading3FontSize !== columnHeading3FontSize)
                    appContext.setColumnHeading3FontSize(columnHeading3FontSize);
                
                // update column empty
                if (appContext.getSelectedColumnId() !== appContext.getColumnIdByTextInputId(id))
                    documentContext.setIsSelectedColumnEmpty(documentContext.checkIsColumnEmptyById(id));
            }
        }
    }


    function shutDownColumnAnimations(): void {

        // plus icon
        $(".plusIconBackground").css("animation", "none");
        $(".plusIcon").css("animation", "none");
        
        // column hover
        const column = $("#" + id);
        column.prop("className", column.prop("className").replace("hover", ""))
    }


    /**
     * Calculate the number of paragraphs that can fit inside this column, considering the fontSize of the column,
     * the {@link Orientation} of the page and the numLinesPerParagraph.
     * 
     * @param orientation of the page
     * @param columnFontSize of all lines of this column except headings
     * @returns number of paragraphs that fit inside this column
     * @see getNumLinesPerColumn
     */
    function getNumParagraphs(orientation: Orientation, columnFontSize: number, headingFontSizes: (string | number)[]): number {

        const numLinesPerColumn = calculateNumLinesPerColumn(orientation, columnFontSize, headingFontSizes);
        const numParagraphs = numLinesPerColumn / numLinesPerParagraph;

        return Math.floor(numParagraphs);
    }


    /**
     * @param orientation of the page
     * @param columnFontSize font size of all lines in column except headings
     * @param headingFontSizes array of font sizes of headings (ascending from first heading to last)
     * @returns number of lines that can fit inside 1 column including headings
     */
    function calculateNumLinesPerColumn(orientation: Orientation, columnFontSize: number, headingFontSizes: (string | number)[]): number {

        // add up heading font sizes
        let sumHeadingFontSizes = 0;
        headingFontSizes.forEach(fontSize => sumHeadingFontSizes += getCSSValueAsNumber(fontSize, 2));
        sumHeadingFontSizes = sumHeadingFontSizes / headingFontSizes.length;
        
        // decide whether to add or subtract lines
        const subtractLines: boolean = sumHeadingFontSizes > columnFontSize;  

        // get num lines to add or subtract
        let numLinesToChange = 0;
        if (subtractLines) 
            numLinesToChange = Math.round((sumHeadingFontSizes % columnFontSize) / (columnFontSize / 2));

        else
            numLinesToChange = Math.round((columnFontSize % sumHeadingFontSizes) / (columnFontSize / 2));
        
        return subtractLines ? getNumLinesPerColumn(orientation, columnFontSize) - numLinesToChange :
                               getNumLinesPerColumn(orientation, columnFontSize) + numLinesToChange;
    }


    return (
        <div id={id} className={className}>
            <ColumnContext.Provider value={context}>
                <div className={"paragraphContainer columnType-" + columnType}>
                    {paragraphs}
                </div>
            </ColumnContext.Provider>
        </div>
    )
}


export const ColumnContext = createContext({
    columnType: 1,
    setColumnType: (columnType: number) => {},
    updateColumnStates: (newTextInputId: string) => {},
    numLinesPerParagraph: 1,
    setNumLinesPerParagraph: (numLines: number) => {}
});