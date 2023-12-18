import React, { useContext } from "react";
import "../assets/styles/ControlBar.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../utils/Utils";
import Button from "./helpers/Button";


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
                <Button id={"DownloadDocument"}
                        handlePromise={buildAndDownloadDocument}
                        className="blackButton blackButtonContained" 
                        hoverBackgroundColor="rgb(50, 50, 50)"
                        clickBackgroundColor="rgb(150, 150, 150)"
                        title="Dokument herunterladen"
                >
                    Download
                </Button>                
            </div>
        </div>
    )
}