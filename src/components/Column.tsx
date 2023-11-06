import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Column.css";
import { log, togglePopUp } from "../utils/Utils";
import Paragraph from "./Paragraph";
import { PAGE_HEIGHT } from "../utils/GlobalVariables";
import { AppContext } from "../App";
import PopUpChooseColumnType from "./popUp/PopUpChoosColumnType";


export default function Column(props) {

    const id = props.id ? "Column" + props.id : "Column";
    const className = props.className ? "Column " + props.className : "Column";

    const appContext = useContext(AppContext);


    useEffect(() => {
        // TODO: remove border-right of outer most column, or add left border for first column
    }, []);


    function handlePopUpToggle(event): void {

        shutDownColumnAnimations();

        // configure popup
        appContext.setPopUpContent(<PopUpChooseColumnType handleSelect={handleChooseType} />)
        $(".popUpContainer").addClass("fullHeightContainer")

        // toggle
        togglePopUp(appContext.setPopUpContent);
    }


    function shutDownColumnAnimations(): void {

        // plus icon
        $(".chooseTypeButton").css("animation", "none");
        $(".plusIcon").css("animation", "none");
        
        // TODO: remove this on type select column background
        const column = $(".Column");
        column.prop("className", column.prop("className").replace("hover", ""))
    }


    function handleChooseType(): void {

    }

    // state paragraphs
    // state type
        // 1
            //

    return (
        <div id={id} className={className + " hover"}>
            <div className="chooseTypeOverlay flexCenter">
                <div className="chooseTypeButton flexCenter" title="Spalten Typ auswählen" onClick={handlePopUpToggle}>
                    <img className="plusIcon" src="plusIcon.png" alt="plus icon" />
                </div>
            </div>

            
            <div className="paragraphContainer">
                {/* <Paragraph />
                <Paragraph />
                <Paragraph /> */}
            </div>
        </div>
    )
}


// type:
    // num paragraphs
    // num inputs per paragraph
    // text align
    // num tabs in front of input
    // table