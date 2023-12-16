import React, { useContext, useState } from "react";
import "../../assets/styles/Paragraph.css";
import TextInput from "./TextInput";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, log } from "../../utils/Utils";
import { ColumnContext } from "./Column";


export default function Paragraph(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    key: string | number,
    id?: string,
    className?: string
}) {
    
    const id = getDocumentId("Paragraph", props.pageIndex, props.id, props.columnIndex, props.paragraphIndex);
    const className = props.className ? "Paragraph " + props.className : "Paragraph";
    
    const columnContext = useContext(ColumnContext);

    const [textInputs, setTextInputs] = useState(initTextInputs());
    

    function initTextInputs(): React.JSX.Element[] {

        const textInputs: React.JSX.Element[] = [];
        const numLinesPerParagraph = columnContext.numLinesPerParagraph;

        for (let i = 0; i < numLinesPerParagraph; i++) 
            textInputs.push(<TextInput key={i}
                                        id={columnContext.columnType}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex}
                                        paragraphIndex={props.paragraphIndex}
                                        textInputIndex={i} />)

        return textInputs;
    }


    return (
        <div id={id} className={className}>
            {textInputs}
        </div>
    )
}