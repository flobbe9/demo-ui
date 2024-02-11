import React, { useContext, useEffect, useState, useRef } from "react";
import "../../assets/styles/ControlPanel.css";
import { AppContext } from "../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { confirmPageUnload, flashClass, isBlank, isStringAlphaNumeric, log, removeConfirmPageUnloadEvent } from "../../utils/basicUtils";
import Button from "../helpers/Button";
import { DocumentContext } from "./Document";
import { matchesAll } from './../../utils/basicUtils';
import { DOCUMENT_FILE_PREFIX_PATTERN, KEY_CODES_NO_TYPED_CHAR } from "../../globalVariables";
import { isFileNameValid } from "../../utils/documentBuilderUtils";


/**
 * Holds config options that don't have to do with styling (i.e. download, save etc.).
 * 
 * @since 0.0.6
 */
// TODO: scroll like user does

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


    function handleFileNameKeyUp(event): void {

        documentContext.setDocumentFileName($(fileNameInputRef.current!).prop("value"));
    }


    function handleFileNameKeyDown(event): void {

        const input = $(fileNameInputRef.current!);
        const typedChar = KEY_CODES_NO_TYPED_CHAR.includes(event.keyCode) ? "" : event.key;

        // case: invalid file name
        if (!matchesAll(input.prop("value") + typedChar, DOCUMENT_FILE_PREFIX_PATTERN)) {
            event.preventDefault();

            documentContext.showSubtlePopup("Dateiname ungültig", `Du kannst das Zeichen '${event.key}' hier nicht benutzen.`, "Warn");

            flashClass(input.prop("id"), "invalid");

            return;
        }
    }


    function handleBurgerButtonClick(event): void {

        // toggle menu
        $(".ControlPanelMenu").slideToggle(100);
    }


    return (
        <div id={id} className={className}>
            <div className="boxShadowContainer flex pt-1 pe-2 pb-1 ps-3">
                <div className="col-7 col-sm-4 controlPanelItem flexLeft">
                    <Button id={"ControlPanelMenu"} 
                            className="hover dontHideControlPanelMenu"
                            childrenClassName="dontHideControlPanelMenu"
                            disabled={disabled}
                            onClick={handleBurgerButtonClick}
                            boxStyle={{
                                backgroundColor: "transparent",
                                boxShadow: "none"
                            }}
                            childrenStyle={{
                                color: "white",
                                fontSize: "1.2em",
                                padding: 0
                            }}
                            >
                        <i className={"burgerButtonIcon fa fa-bars dontHideControlPanelMenu"}></i>
                        <span className="ms-2">Menü</span>
                    </Button>
                </div>

                <div className="col-4 controlPanelItem flexCenter">
                    <input id="fileNameInput"
                        className="fileNameInput"
                        ref={fileNameInputRef}
                        type="text" 
                        defaultValue={documentContext.documentFileName}
                        onKeyDown={handleFileNameKeyDown}
                        onKeyUp={handleFileNameKeyUp}
                        />
                </div>  
                
                <div className="col-4 controlPanelItem flexRight">
                </div>  
            </div>
        </div>
    )
}