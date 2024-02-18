import React, { useContext, useRef } from 'react';
import "../../assets/styles/ControlPanelMenu.css";
import Button from '../helpers/Button';
import { DocumentContext } from './Document';
import DownloadIcon from '../helpers/DownloadIcon';


export default function ControlPanelMenu(props: {
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = "ControlPanelMenu" + (props.id || "");
    const className = "ControlPanelMenu " + (props.className || "");

    const documentContext = useContext(DocumentContext);
    const menuRef = useRef(null);


    // TODO: 
        // new document
        // pdf
        // save

    return (
        <div id={id} className={className + " dontHideControlPanelMenu hidden"} ref={menuRef}>
                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"DownloadWord"}
                            className="dontHideControlPanelMenu hover"
                            childrenClassName="dontHideControlPanelMenu flexCenter"
                            
                            handlePromise={(event) => documentContext.buildAndDownloadDocument(false)}
                            title="Als Word Dokument herunterladen"

                            boxStyle={{
                                backgroundColor: "blue",
                                boxShadow: "none"
                            }}
                            childrenStyle={{
                                color: "white",
                                padding: "3px 9px",
                                width: "80px"
                            }}
                            >
                        <DownloadIcon id="Word" className="me-2" /> <span>Word</span>
                    </Button>    
                </div>
                        
                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"DownloadPdf"}
                            className="dontHideControlPanelMenu"
                            childrenClassName="flexCenter dontHideControlPanelMenu"

                            handlePromise={(event) => documentContext.buildAndDownloadDocument(true)}
                            title="Als PDF Dokument herunterladen"
                            disabled={true}
                            rendered={false}

                            boxStyle={{
                                backgroundColor: "red",
                                boxShadow: "none"
                            }}
                            childrenStyle={{
                                color: "white",
                                padding: "3px 9px",
                            }}
                            hoverBackgroundColor="rgb(255, 135, 135)"
                            clickBackgroundColor="rgb(255, 80, 80)"
                            >
                        <DownloadIcon id="Pdf" className="me-2" /> <span>Pdf</span>
                    </Button>  
                </div>

                <div className="controlPanelMenuItem dontHideControlPanelMenu">
                    <Button id={"SaveDocument"}
                            className="blackButton blackButtonContained flexLeft dontHideControlPanelMenu"
                            childrenClassName="flexLeft dontHideControlPanelMenu"
                            
                            title="Dokument speichern"
                            disabled={true}
                            rendered={false}

                            childrenStyle={{
                                padding: "3px 9px",
                            }}
                            hoverBackgroundColor="rgb(50, 50, 50)"
                            clickBackgroundColor="rgb(150, 150, 150)"
                            >
                        <i className="fa-regular fa-floppy-disk me-2"></i> 
                        <span>Speichern</span>
                    </Button>
                </div>
            </div>
)}