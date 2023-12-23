import React, { useContext } from "react";
import "../assets/styles/ControlBar.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../utils/Utils";
import Button from "./helpers/Button";


export default function ControlBar(props: {
    id?: string,
    className?: string,
    key?: string,
    chiildren?
}) {

    const id = props.id ? "ControlBar" + props.id : "ControlBar";
    const className = props.className ? "ControlBar " + props.className : "ControlBar";

    const appContext = useContext(AppContext);


    async function buildAndDownloadDocument(): Promise<void> {

        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns);

        if (buildResponse.status === 200)
            downloadDocument(false, appContext.documentFileName);
    }


    return (
        <div id={id} className={className}>
            <div className="downloadButtonContainer flexRight mr-3">
                <Button id={"DownloadDocument"}
                        handlePromise={buildAndDownloadDocument}
                        childrenStyle={{
                            padding: "3px"
                        }}
                        hoverBackgroundColor="rgb(50, 50, 50)"
                        clickBackgroundColor="rgb(150, 150, 150)"
                        title="Dokument herunterladen"
                        >
                    <i className="fa-regular fa-circle-down"></i> Download
                </Button>                
            </div>
        </div>
    )
}