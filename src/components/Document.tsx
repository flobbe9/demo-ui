import React, { useContext, useEffect } from "react";
import "../assets/styles/Document.css";
import Page from "./Page";
import { hidePopUp, log } from "../utils/Utils";
import { AppContext } from "../App";
import StylePanel from "./StylePanel";


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


    return (
        <div id={id} className={className}>
            <StylePanel />

            <div className="flexCenter">
                <div className="pageContainer">
                    <Page />

                    <Page />
                </div>
            </div>
        </div>
    )
}