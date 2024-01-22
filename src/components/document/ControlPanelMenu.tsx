import React, { useContext, useRef } from 'react';
import "../../assets/styles/ControlPanelMenu.css";
import Button from '../helpers/Button';
import { DocumentContext } from './Document';


export default function ControlPanelMenu(props: {
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = "ControlPanelMenu" + (props.id || "");
    const className = "ControlPanelMenu" + (props.className || "");

    const documentContext = useContext(DocumentContext);
    const menuRef = useRef(null);


    return (
        <div id={id} className={className + " dontHideControlPanelMenu hidden"} ref={menuRef}>
                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"DownloadDocument"}
                            className="dontHideControlPanelMenu"
                            childrenClassName="dontHideControlPanelMenu"
                            
                            handlePromise={documentContext.buildAndDownloadDocument}
                            title="Als Word Dokument herunterladen"

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
            </div>
)}