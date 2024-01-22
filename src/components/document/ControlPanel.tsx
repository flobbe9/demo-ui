import React, { useContext, useEffect, useState, useRef } from "react";
import "../../assets/styles/ControlPanel.css";
import { buildDocument, downloadDocument } from "../../builder/builder";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, isBlank, log, removeConfirmPageUnloadEvent } from "../../utils/basicUtils";
import Button from "../helpers/Button";
import { API_ENV } from "../../globalVariables";
import { DocumentContext } from "./Document";
import { adjustDocumentFileName } from "../../utils/documentBuilderUtils";


/**
 * Holds config options that don't have to do with styling (i.e. download, save etc.).
 * 
 * @since 0.0.6
 */
// TODO: z index making trouble, divide controlpanel and menu into two outer components, make controlpaenl z-index 1 and menu 2
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

    const menuRef = useRef(null);
    
    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);


    useEffect(() => {
        if (disabled && !isBlank(documentContext.selectedTextInputId))
            setDisabled(false);
        
    }, [documentContext.selectedTextInputId]);


    function handleFileNameKeyUp(event): void {

        const input = $(fileNameInputRef.current!);
        let inputValue: string;

        if (!input || !(inputValue = input.prop("value")))  
            return;

        inputValue = adjustDocumentFileName(inputValue);

        documentContext.setDocumentFileName(inputValue);
    }


    function handleBurgerButtonClick(event): void {

        // toggle menu
        $(menuRef.current!).slideToggle(100);
    }


    return (
        <div id={id} className={className}>
            <div className="boxShadowContainer flex">
                <div className="col-4 controlPanelItem flexLeft">
                    <Button id={"ControlPanelMenu"} 
                            disabled={disabled}
                            boxStyle={{
                                backgroundColor: "transparent",
                                boxShadow: "none"
                            }}
                            childrenStyle={{padding: 0}}
                            >
                        <i className={"burgerButtonIcon hover fa fa-bars fa-lg dontHideControlPanelMenu"} onClick={handleBurgerButtonClick}></i>
                    </Button>
                </div>

                <div className="col-4 controlPanelItem flexCenter">
                    <input id="fileNameInput"
                        className="fileNameInput"
                        ref={fileNameInputRef}
                        type="text" 
                        defaultValue={documentContext.documentFileName}
                        onKeyUp={handleFileNameKeyUp}
                        />
                </div>  
                
                <div className="col-12 col-md-7 col-lg-4 controlPanelItem flexRight">
                </div>  
            </div>

            {/* <div id="controlPanelMenu" className="controlPanelMenu dontHideControlPanelMenu hidden" ref={menuRef}>
                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"DownloadDocument"}
                            className="dontHideControlPanelMenu"
                            childrenClassName="dontHideControlPanelMenu"
                            
                            handlePromise={documentContext.buildAndDownloadDocument}
                            title="Als Word Dokument herunterladen"
                            disabled={disabled}

                            boxStyle={{backgroundColor: "blue"}}
                            childrenStyle={{
                                color: "white",
                                padding: "3px 9px",
                                width: "80px"
                            }}
                            hoverBackgroundColor="rgb(80, 80, 255)"
                            clickBackgroundColor="rgb(80, 80, 255)"
                            >
                        <i className="fa-solid fa-file-arrow-down fa-lg mr-2"></i>
                        <span>Word</span>
                    </Button>    
                </div>
                        
                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"DownloadDocument"}
                            className="dontHideControlPanelMenu"
                            childrenClassName="flexLeft dontHideControlPanelMenu"

                            handlePromise={() => documentContext.buildAndDownloadDocument(true)}
                            title="Als PDF Dokument herunterladen"
                            disabled={true}

                            boxStyle={{backgroundColor: "red"}}
                            childrenStyle={{
                                color: "white",
                                padding: "3px 9px",
                                width: "80px"
                            }}
                            hoverBackgroundColor="rgb(255, 135, 135)"
                            clickBackgroundColor="rgb(255, 80, 80)"
                            >
                        <i className="fa-solid fa-file-arrow-down fa-lg mr-2"></i>
                        <span>Pdf</span>
                    </Button>  
                </div>

                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"SaveDocument"}
                            className="blackButton blackButtonContained flexLeft dontHideControlPanelMenu"
                            childrenClassName="flexLeft dontHideControlPanelMenu"
                            
                            title="Dokument speichern"
                            disabled={true}

                            boxStyle={{height: "fit-content"}}
                            childrenStyle={{
                                padding: "3px 9px",
                            }}
                            hoverBackgroundColor="rgb(50, 50, 50)"
                            clickBackgroundColor="rgb(150, 150, 150)"
                            >
                        <i className="fa-regular fa-floppy-disk mr-1"></i> 
                        <span>Speichern</span>
                    </Button>
                </div>
            </div> */}
        </div>
    )
}