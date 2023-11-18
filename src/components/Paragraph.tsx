import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Paragraph.css";
import TextInput from "./TextInput";
import { getDocumentId, log } from "../utils/Utils";
import {v4 as uuid} from "uuid";
import { ColumnContext } from "./Column";
import { AppContext } from "../App";
import { Orientation } from "../enums/Orientation";


export default function Paragraph(props: {
    pageIndex: number,
    columnIndex: number,
    paragraphIndex: number,
    id?: string,
    className?: string
}) {
    
    const id = getDocumentId("Paragraph", props.pageIndex, props.id, props.columnIndex, props.paragraphIndex);
    const className = props.className ? "Paragraph " + props.className : "Paragraph";
    
    const appContext = useContext(AppContext);
    const columnContext = useContext(ColumnContext);

    const [textInputs, setTextInputs] = useState(initTextInputs());
    

    function initTextInputs(): React.JSX.Element[] {

        const textInputs: React.JSX.Element[] = [];
        const numLinesPerParagraph = columnContext.columnTypeConfig.getNumLinesPerParagraph();

        for (let i = 0; i < numLinesPerParagraph; i++) 
            textInputs.push(<TextInput key={uuid()}
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