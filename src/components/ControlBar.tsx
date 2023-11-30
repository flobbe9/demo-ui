import React, { useContext } from "react";
import "../assets/styles/ControlBar.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "../App";
import { log } from "../utils/Utils";


export default function ControlBar(props) {

    const id = props.id ? "ControlBar" + props.id : "ControlBar";
    const className = props.className ? "ControlBar " + props.className : "ControlBar";

    const appContext = useContext(AppContext);


    async function buildAndDownloadDocument(): Promise<void> {

        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns);

        if (buildResponse.status === 200)
            downloadDocument(false);
    }


    return (
        <div id={id} className={className}>
            <div className="flexCenter">
                Dokument1.docx
            </div>

            <div className="flexRight">
                {/* <LoadingButton 
                            onClick={buildAndDownloadDocument}
                            className="blackButton blackButtonContained" 
                            variant="contained"
                            >
                        Download
                </LoadingButton>                 */}
            </div>
        </div>
    )
}