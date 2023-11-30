import React, { useContext, useEffect } from "react";
import "../../assets/styles/Document.css";
import Page from "./Page";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hidePopUp, log } from "../../utils/Utils";
import { AppContext } from "../../App";
import StylePanel from "./StylePanel";


// TODO: how to cache document?
export default function Document(props) {

    const id = props.id ? "Document" + props.id : "Document";
    const className = props.className ? "Document " + props.className : "Document";

    const appContext = useContext(AppContext);


    useEffect(() => {
        // confirmPageUnload();

        hidePopUp(appContext.setPopUpContent);

        $(".App").css("backgroundColor", "white");

        // TODO: confirm url change
    }, []);


    return (
        <div id={id} className={className}>
            {/* <ControlBar /> */}

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