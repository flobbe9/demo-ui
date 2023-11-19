import React, { createContext, useContext, useState } from "react";
import "../assets/styles/Column.css";
import { getDocumentId, log, togglePopUp } from "../utils/Utils";
import Paragraph from "./Paragraph";
import { AppContext } from "../App";
import PopUpChooseColumnType from "./popUps/PopUpChoosColumnType";
import {v4 as uuid} from "uuid";
import ColumnTypeConfig from "../utils/ColumnTypeConfig";


export default function Column(props: {
    pageIndex: number,
    columnIndex: number,
    id?: string,
    className?: string
}) {

    const id = getDocumentId("Column", props.pageIndex, props.id, props.columnIndex);
    const className = props.className ? "Column " + props.className : "Column";

    const appContext = useContext(AppContext);
    
    const [columnType, setColumnType] = useState(1);
    const [columnTypeConfig, setColumnTypeConfig] = useState(new ColumnTypeConfig(1, false));
    const [paragraphs, setParagraphs] = useState([<div key={uuid()}></div>]);
    
    const context = {
        columnType: columnType,
        setColumnType: setColumnType,
        columnTypeConfig: columnTypeConfig,
        setColumnTypeConfig: setColumnTypeConfig
    }


    function initParagraphs(): React.JSX.Element[] {

        // TODO: figure out fontSize
        const paragraphs: React.JSX.Element[] = [];

        for (let i = 0; i < columnTypeConfig.getNumParagraphs(appContext.orientation, 14); i++) 
            paragraphs.push(<Paragraph key={uuid()}
                                        pageIndex={props.pageIndex}
                                        columnIndex={props.columnIndex} 
                                        paragraphIndex={i} />)

        return paragraphs;
    }


    function handlePopUpToggle(event): void {

        // configure popup
        appContext.setPopUpContent(<PopUpChooseColumnType handleSelect={handleSelectType} handleSubmit={handleTypeSubmit} />)
        $(".popUpContainer").addClass("fullHeightContainer")

        // toggle
        togglePopUp(appContext.setPopUpContent);
    }


    function shutDownColumnAnimations(): void {

        // plus icon
        $(".plusIconBackground").css("animation", "none");
        $(".plusIcon").css("animation", "none");
        
        // column hover
        const column = $("#" + id);
        column.prop("className", column.prop("className").replace("hover", ""))
    }


    function handleSelectType(columnType: number): void {

        setColumnType(columnType);
        // TODO: set config by columnType
    }
    
    
    function handleTypeSubmit(): void {
        
        $("#" + id + " .columnOverlay").hide();
        $("#" + id + " .paragraphContainer").show();

        shutDownColumnAnimations();
        setParagraphs(initParagraphs());
    }


    return (
        <div id={id} className={className + " hover"}>
            <ColumnContext.Provider value={context}>
                <div className="columnOverlay flexCenter" onClick={handlePopUpToggle}>
                    <div className="plusIconBackgroundContainer flexCenter">
                        <div className="plusIconBackground flexCenter" title="Spalten Typ auswählen">
                            <img className="plusIcon" src="plusIcon.png" alt="plus icon" />
                        </div>
                    </div>
                </div>

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
    columnTypeConfig: new ColumnTypeConfig(1, false),
    setColumnTypeConfig: (columnTypeConfig: ColumnTypeConfig) => {}
});