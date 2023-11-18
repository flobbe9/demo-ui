import React, { useContext } from "react";
import "../assets/styles/ControlBar.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "../App";


export default function ControlBar(props) {

    const id = props.id ? "ControlBar" + props.id : "ControlBar";
    const className = props.className ? "ControlBar " + props.className : "ControlBar";

    const appContext = useContext(AppContext);


    return (
        <div id={id} className={className}>
            <div className="flexCenter">
                Dokument1.docx
            </div>

            <div className="flexRight">
                <button onClick={() => buildDocument(appContext.orientation, appContext.numColumns)}>Build</button>
                <button onClick={() => downloadDocument(false)}>download</button>
            </div>
        </div>
    )
}