import React, { useContext, useEffect, useState, useRef } from "react";
import "../assets/styles/ControlPanel.css";
import { buildDocument, downloadDocument } from "../builder/Builder";
import { AppContext } from "./App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, isBlank, log, removeConfirmPageUnloadEvent } from "../utils/basicUtils";
import Button from "./helpers/Button";
import { API_ENV } from "../globalVariables";


// TODO: add print button
// TODO: add save button
// TODO: mobile mode
export default function ControlPanel(props: {
    id?: string,
    className?: string,
    key?: string,
    chiildren?
}) {

    const id = props.id ? "ControlPanel" + props.id : "ControlPanel";
    const className = props.className ? "ControlPanel " + props.className : "ControlPanel";

    const fileNameInputRef = useRef(null);
    
    const [disabled, setDisabled] = useState(true);    
    
    const appContext = useContext(AppContext);


    useEffect(() => {
        if (disabled && !isBlank(appContext.selectedTextInputId))
            setDisabled(false);
        
    }, [appContext.selectedTextInputId]);


    async function buildAndDownloadDocument(): Promise<void> {

        // remove confirm unload event
        removeConfirmPageUnloadEvent();

        // build
        const buildResponse = await buildDocument(appContext.orientation, appContext.numColumns, appContext.documentFileName, appContext.numLinesAsSingleColumn);

        // download
        if (buildResponse.status === 200)
            downloadDocument(false);

        // add back confirm unload event
        if (API_ENV !== "dev")
            confirmPageUnload();
    }


    function handleFileNameKeyUp(event): void {

        const input = $(fileNameInputRef.current!);
        let inputValue: string;

        if (!input || !(inputValue = input.prop("value")))  
            return;

        inputValue = appContext.adjustDocumentFileName(inputValue);

        appContext.setDocumentFileName(inputValue);
    }


    return (
        <div id={id} className={className + " flex"}>
            <div className="col-4 controlPanelItem flexLeft">
            </div>

            <div className="col-4 controlPanelItem flexCenter">
                <input id="fileNameInput"
                    className={"fileNameInput"} 
                    ref={fileNameInputRef}
                    type="text" 
                    defaultValue={appContext.documentFileName}
                    onKeyUp={handleFileNameKeyUp}
                    />
            </div>  
            
            <div className="col-4 controlPanelItem flexRight">
                <Button id={"SaveDocument"}
                        className="blackButton blackButtonContained mr-5"
                        
                        title="Dokument speichern"
                        disabled={true}
                        rendered={false}

                        childrenStyle={{
                            padding: "3px 9px"
                        }}
                        hoverBackgroundColor="rgb(50, 50, 50)"
                        clickBackgroundColor="rgb(150, 150, 150)"
                        >
                    <i className="fa-regular fa-floppy-disk mr-1"></i> 
                    <span>Save</span>
                </Button>             

                <Button id={"DownloadDocument"}
                        className="mr-3"
                        
                        handlePromise={buildAndDownloadDocument}
                        title="Als Word Dokument herunterladen"
                        disabled={disabled}

                        boxStyle={{backgroundColor: "blue"}}
                        childrenStyle={{
                            color: "white",
                            padding: "3px 9px"
                        }}
                        hoverBackgroundColor="rgb(80, 80, 255)"
                        clickBackgroundColor="rgb(80, 80, 255)"
                        >
                    <i className="fa-solid fa-file-arrow-down fa-lg mr-2"></i>

                    <span>Word</span>
                </Button>   

                <Button id={"DownloadDocument"}
                        className="mr-3"

                        handlePromise={buildAndDownloadDocument}
                        title="Als PDF herunterladen"
                        disabled={true}
                        rendered={false}

                        boxStyle={{backgroundColor: "red"}}
                        childrenStyle={{
                            color: "white",
                            padding: "3px 9px"
                        }}
                        hoverBackgroundColor="rgb(255, 135, 135)"
                        clickBackgroundColor="rgb(255, 80, 80)"
                        >
                    <i className="fa-solid fa-file-arrow-down fa-lg mr-2"></i>
                    <span>Pdf</span>
                </Button>  
            </div>  
        </div>
    )
}