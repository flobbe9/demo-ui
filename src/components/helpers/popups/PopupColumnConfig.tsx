import React, { useContext, useEffect, useState } from "react"; 
import "../../../assets/styles/PopupColumnConfig.css";
import { AppContext } from "../../App";
import { Orientation } from "../../../enums/Orientation";
import RadioButton from "../../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log} from "../../../utils/basicUtils";
import Button from "../Button";
import Popup from "./Popup";
import PopupWarnConfirm from "./PopupWarnConfirm";
import { DocumentContext } from "../../document/Document";


/**
 * Popup content used for changing the number of columns in a document.
 * 
 * @since 0.0.5
 */
export default function PopupColumnConfig(props: {
    id?: string,
    className?: string,
    children?,
    toggleWarnPopup: (warnPopupId: string, duration?: number) => void
}) {

    const className = "PopupColumnConfig " + (props.className || "");
    const id = "PopupColumnConfig " + (props.id || "");
    const warnPopupId = "ColumnConfigWarning";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [orientationClassName, setOrientationClassName] = useState("whiteButtonPortrait");
    const [selectedNumColumns, setSelectedNumColumns] = useState(documentContext.numColumns)


    useEffect(() => {
        if (documentContext.orientation === Orientation.PORTRAIT.toString())
            setOrientationClassName("whiteButtonPortrait")
        
        else    
            setOrientationClassName("whiteButtonLandscape");

    }, [documentContext.orientation])


    function handleSelectNumColumns(numColumns: number): void {

        setSelectedNumColumns(numColumns);
    }


    function handleSubmit(event): void {

        // update column state
        documentContext.setNumColumns(selectedNumColumns);

        // update pages state
        documentContext.setPages([]);
        setTimeout(() => 
            documentContext.setPages(documentContext.initPages()), 1);

        documentContext.hidePopup();
    }


    function toggleWarnPopup(duration = 100): void {

        // case: selected same number
        if (selectedNumColumns === documentContext.numColumns) {
            documentContext.hidePopup()
            return;
        }

        props.toggleWarnPopup("Popup" + warnPopupId, duration);
    }


    return (
        <div id={id} className={className}>
            <div className="popupHeader flexRightStart">
                <i className="fa-solid fa-xmark fa-xl closeIcon hideDocumentPopup"></i>
            </div>
            
            <div className="popupBody flexCenter">
                <div id="numColumnsContainer" className="numColumnsContainer flexCenter dontMarkText">
                    <div className="radioContainer ml-1 mr-0 mr-sm-4">
                        <RadioButton id="OneColumn" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="flexLeftStart"
                                    name="NumColumns"
                                    value={1}
                                    radioGroupValue={selectedNumColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    boxStyle={{
                                        borderRadius: "3px",
                                        boxShadow: "0 1px 3px 0px rgb(151, 151, 151)",
                                        padding: "4px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                        height: "100%"
                                    }}
                                    checkedStyle={{backgroundColor: "rgb(238, 238, 238)"}}
                                    hoverBackgroundColor="rgb(243, 243, 243)"
                                    >
                            <div>Lorem ipsum</div>
                        </RadioButton>
                        <div className="mt-2 mb-3 mr-2">1 Spalte / Seite</div>
                    </div>

                    <div className="radioContainer mr-0 mr-sm-4">
                        <RadioButton id="TwoColumns" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="flexLeftStart"
                                    name="NumColumns"
                                    value={2}
                                    radioGroupValue={selectedNumColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    boxStyle={{
                                        borderRadius: "3px",
                                        boxShadow: "0 1px 3px 0px rgb(151, 151, 151)",
                                        padding: "4px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                    }}
                                    checkedStyle={{backgroundColor: "rgb(238, 238, 238)"}}
                                    hoverBackgroundColor="rgb(243, 243, 243)"
                                    >
                            <div className="verticalBorderRightDotted" style={{width: "50%"}}>
                                Lorem ipsum
                            </div>
                            <div style={{width: "50%"}}></div>
                        </RadioButton>
                        <div className="mt-2 mb-3">2 Spalten / Seite</div>
                    </div>

                    <div className="radioContainer">
                        <RadioButton id="ThreeColumns" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="flexLeftStart"
                                    name="NumColumns"
                                    value={3}
                                    radioGroupValue={selectedNumColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    boxStyle={{
                                        borderRadius: "3px",
                                        boxShadow: "0 1px 3px 0px rgb(151, 151, 151)",
                                        padding: "4px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                    }}
                                    checkedStyle={{backgroundColor: "rgb(238, 238, 238)"}}
                                    hoverBackgroundColor="rgb(243, 243, 243)"
                                    >
                            <div className="verticalBorderRightDotted" style={{width: "33%"}}>
                                Lorem ipsum
                            </div>
                            <div className="verticalBorderRightDotted" style={{width: "33%"}}></div>
                            <div style={{width: "33%"}}></div>
                        </RadioButton>
                        <div className="mt-2 mb-3">3 Spalten / Seite</div>
                    </div>
                </div>

                <Popup id={warnPopupId} className="warnPopup" height="small" width="medium" style={{display: "none"}}>
                    <PopupWarnConfirm handleConfirm={handleSubmit} 
                                      handleDecline={toggleWarnPopup}
                                      hideThis={toggleWarnPopup}
                                      >
                        <p className="textCenter">Der Inhalt des <strong>gesamten</strong> Dokumentes wird <strong>gelöscht</strong> werden.</p>
                        <p className="textCenter">Fortfahren?</p>
                    </PopupWarnConfirm>
                </Popup>
            </div>

            <div className="popupFooter flexRight">
                <Button id={id + "Submit"} 
                        handleClick={(event) => toggleWarnPopup()}
                        className="blackButton blackButtonContained"
                        childrenStyle={{padding: "5px 10px"}}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        >
                    Anwenden
                </Button>
            </div>
        </div>
    )
}