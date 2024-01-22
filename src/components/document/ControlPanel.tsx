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
        $(".ControlPanelMenu").slideToggle(100);
    }


    return (
        <div id={id} className={className}>
            <div className="boxShadowContainer flex">
                <div className="col-4 controlPanelItem flexLeft">
                    <Button id={"ControlPanelMenu"} 
                            className="hover dontHideControlPanelMenu"
                            childrenClassName="dontHideControlPanelMenu"
                            disabled={disabled}
                            handleClick={handleBurgerButtonClick}
                            boxStyle={{
                                backgroundColor: "transparent",
                                boxShadow: "none"
                            }}
                            childrenStyle={{padding: 0}}
                            >
                        <i className={"burgerButtonIcon hover fa fa-bars fa-lg dontHideControlPanelMenu"}></i>
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
        </div>
    )
}