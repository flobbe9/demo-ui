import React, { useContext, useEffect } from "react";
import "../assets/styles/Document.css";
import Page from "./Page";
import { hidePopUp, log } from "../utils/Utils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";
import { buildDocument, downloadDocument } from "../builder/Builder";
import ControlBar from "./ControlBar";


export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);


    useEffect(() => {
        // TODO: confirm page leave, use PopUp.tsx

        hidePopUp(appContext.setPopUpContent);

        // set document name
        $(".NavBar .textCenter").css("display", "flex");

        return () => {$(".NavBar .textCenter").css("display", "none")}
    }, []);


    // TODO: add controll bar above style panel
    return (
        <div id={id} className={className}>
            <ControlBar />

            <StylePanel />

            <div className="pageContainer">
                <div className="flexCenter">
                    <Page pageIndex={0}/>
                </div>
                <div className="flexCenter">
                    <Page pageIndex={1}/>
                </div>
            </div>


        </div>
    )
}