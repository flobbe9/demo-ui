import { Orientation } from "../enums/Orientation";
import { getNumLinesPerColumn } from "./GlobalVariables";


/**
 * Class holding information about the ```Paragraphs``` and ```TextInputs``` inside a ```Column```.
 * 
 * @since 0.0.6
 */
export default class ColumnTypeConfig {

    private numLinesPerParagraph: number;
    
    private isTable: boolean;


    constructor(numLinesPerParagraph: number, isTable: boolean) {

        this.numLinesPerParagraph = numLinesPerParagraph;
        this.isTable = isTable;
    }
    
    
    public getNumLinesPerParagraph(): number {
        
        return this.numLinesPerParagraph;
    }

    
    public setNumLinesPerParagraph(value: number) {
        
        this.numLinesPerParagraph = value;
    }

    
    public getIsTable(): boolean {

        return this.isTable;
    }
    

    public setIsTable(value: boolean) {

        this.isTable = value;
    }


    /**
     * Calculate the number of paragraphs that can fit inside this column, considering the fontSize of the column,
     * the {@link Orientation} of the page and the {@link numLinesPerParagraph}.
     * 
     * @param orientation of the page
     * @param fontSize of all lines of this column
     * @returns number of paragraphs that fit inside this column
     * @see getNumLinesPerColumn
     */
    getNumParagraphs(orientation: Orientation, fontSize: number): number {

        const numLinesPerColumn = getNumLinesPerColumn(orientation, fontSize);

        const numParagraphs = numLinesPerColumn / this.numLinesPerParagraph;

        return Math.floor(numParagraphs);
    }
}