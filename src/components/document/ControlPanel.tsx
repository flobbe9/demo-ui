import React, { useContext, useEffect, useState, useRef } from "react";
import "../../assets/styles/ControlPanel.css";
import { buildDocument, downloadDocument } from "../../builder/Builder";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, isBlank, log, removeConfirmPageUnloadEvent } from "../../utils/basicUtils";
import Button from "../helpers/Button";
import { API_ENV } from "../../globalVariables";
import { DocumentContext } from "./Document";
import { adjustDocumentFileName } from "../../utils/documentBuilderUtils";


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
    const documentContext = useContext(DocumentContext);


    useEffect(() => {
        if (disabled && !isBlank(documentContext.selectedTextInputId))
            setDisabled(false);
        
    }, [documentContext.selectedTextInputId]);


    async function buildAndDownloadDocument(pdf = false): Promise<void> {

        // remove confirm unload event
        removeConfirmPageUnloadEvent();

        // build
        const buildResponse = await buildDocument(documentContext.orientation, documentContext.numColumns, documentContext.documentFileName, documentContext.numSingleColumnLines);

        // download
        if (buildResponse.status === 200)
            downloadDocument(pdf, documentContext.documentFileName);

        // add back confirm unload event
        if (API_ENV !== "dev")
            confirmPageUnload();
    }


    function handleFileNameKeyUp(event): void {

        const input = $(fileNameInputRef.current!);
        let inputValue: string;

        if (!input || !(inputValue = input.prop("value")))  
            return;

        inputValue = adjustDocumentFileName(inputValue);

        documentContext.setDocumentFileName(inputValue);
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
                    defaultValue={documentContext.documentFileName}
                    onKeyUp={handleFileNameKeyUp}
                    />
            </div>  
            
            <div className="col-12 col-md-7 col-lg-4 controlPanelItem flexRight">
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

                        handlePromise={() => buildAndDownloadDocument(true)}
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