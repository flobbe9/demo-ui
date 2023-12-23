import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/ControlPanel.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBlank, log } from "../utils/Utils";
import Button from "./helpers/Button";


export default function ControlPanel(props: {
    id?: string,
    className?: string,
    key?: string,
    chiildren?
}) {

    const id = props.id ? "ControlPanel" + props.id : "ControlPanel";
    const className = props.className ? "ControlPanel " + props.className : "ControlPanel";
    
    const [disabled, setDisabled] = useState(true);    
    
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (disabled && !isBlank(appContext.selectedTextInputId))
            setDisabled(false);
        
    }, [appContext.selectedTextInputId]);


    async function buildAndDownloadDocument(): Promise<void> {

        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns);

        if (buildResponse.status === 200)
            downloadDocument(false, appContext.documentFileName);
    }


    return (
        <div id={id} className={className}>
            <Button id={"DownloadDocument"}
                    handlePromise={buildAndDownloadDocument}
                    className="blackButton blackButtonContained"
                    hoverBackgroundColor="rgb(50, 50, 50)"
                    clickBackgroundColor="rgb(150, 150, 150)"
                    title="Dokument herunterladen"
                    disabled={disabled}
                    >
                <i className="fa-regular fa-circle-down"></i> Download
            </Button>             
        </div>
    )
}