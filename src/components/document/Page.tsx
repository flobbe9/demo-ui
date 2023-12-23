import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/Page.css";
import Column from "./Column";
import TextInput from "./TextInput";
import { AppContext } from "../../App";
import { getDocumentId, getPartFromDocumentId, log } from "../../utils/Utils";


// TODO: consider page width, compare with word
export default function Page(props: {
    pageIndex: number,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = getDocumentId("Page", props.pageIndex, props.id);
    let className = props.className ? "Page " + props.className : "Page";

    const appContext = useContext(AppContext);

    const [columns, setColumns] = useState(initColumns());
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "pagePortrait" : "pageLandscape");


    useEffect(() => {
        // remove right border from last column on page
        $("#" + getDocumentId("Column", props.pageIndex, "", columns.length - 1)).css("border-right", "none");
        
    }, []);


    function initColumns(): React.JSX.Element[] {

        if (appContext.numColumns > 3)
            return [<Column key={0} pageIndex={props.pageIndex} columnIndex={0}/>];

        const columns: React.JSX.Element[] = [];

        for (let i = 0; i < appContext.numColumns; i++) 
            columns.push(<Column key={i} pageIndex={props.pageIndex} columnIndex={i}/>);

        return columns;
    }


    return (
        <div id={id} className={className + " " + orientationClassName} style={props.style}>
            <div className="columnContainer">
                {columns}
            </div>
        </div>
    )
}