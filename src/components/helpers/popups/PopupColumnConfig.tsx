import React, { useContext, useEffect, useState, useRef } from "react"; 
import "../../../assets/styles/PopupColumnConfig.css";
import { AppContext } from "../../App";
import { Orientation } from "../../../enums/Orientation";
import RadioButton from "../../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hideGlobalPopup, log, togglePopupOverlay } from "../../../utils/Utils";
import Button from "../Button";
import Popup from "./Popup";
import PopupWarnConfirm from "./PopupWarnConfirm";


/**
 * Popup content used for changing the number of columns in a document.
 * 
 * @since 0.0.5
 */
export default function PopupColumnConfig(props) {

    const className = props.className ? "PopupColumnConfig " + props.className : "PopupColumnConfig";
    const id = props.id ? "PopupColumnConfig " + props.id : "PopupColumnConfig";
    const warnPopupId = id + "Warn";

    const appContext = useContext(AppContext);

    const [orientationClassName, setOrientationClassName] = useState("whiteButtonPortrait");
    const [selectedNumColumns, setSelectedNumColumns] = useState(appContext.numColumns)


    useEffect(() => {
        if (appContext.orientation === Orientation.PORTRAIT.toString())
            setOrientationClassName("whiteButtonPortrait")
        
        else    
            setOrientationClassName("whiteButtonLandscape");

    }, [appContext.orientation])


    function handleSelectNumColumns(numColumns: number): void {

        setSelectedNumColumns(numColumns);
    }


    function handleSubmit(event): void {

        // update column state
        appContext.setNumColumns(selectedNumColumns);

        // update pages state
        appContext.setPages([]);
        setTimeout(() => 
            appContext.setPages(appContext.initPages()), 1);

        hideGlobalPopup(appContext.setPopupContent);
    }


    function toggleWarnPopup(): void {

        // case: selected same number
        if (selectedNumColumns === appContext.numColumns) {
            hideGlobalPopup(appContext.setPopupContent)
            return;
        }

        $("#" + warnPopupId + "Popup").fadeToggle(100);
        togglePopupOverlay();
    }


    return (
        <div id={id} className={className}>
            <div className="popupHeader flexRightStart">
                <i className="fa-solid fa-xmark fa-xl closeIcon hideGlobalPopup"></i>
            </div>
            
            <div className="popupBody flexCenter">
                <div id="numColumnsContainer" className="numColumnsContainer flexCenter dontMarkText">
                    <div className="radioContainer mr-0 mr-sm-4">
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
                                        padding: "2px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                        height: "100%"
                                    }}
                                    checkedBackgroundColor="rgb(238, 238, 238)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
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
                                        padding: "2px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                    }}
                                    checkedBackgroundColor="rgb(238, 238, 238)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
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
                                        padding: "2px"
                                    }}
                                    childrenStyle={{
                                        fontSize: "9px",
                                    }}
                                    checkedBackgroundColor="rgb(238, 238, 238)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
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

                <Popup id={warnPopupId} className="warnPopup" height="small" width="medium">
                    <PopupWarnConfirm handleConfirm={handleSubmit} 
                                      handleDecline={() => hideGlobalPopup(appContext.setPopupContent)}
                                      hideThis={toggleWarnPopup}
                                      >
                        <p className="textCenter">Der Inhalt des <strong>gesamten</strong> Dokumentes wird <strong>gelöscht</strong> werden.</p>
                        <p className="textCenter">Fortfahren?</p>
                    </PopupWarnConfirm>
                </Popup>
            </div>

            <div className="popupFooter flexRight">
                <Button id={id + "Submit"} 
                        handleClick={toggleWarnPopup}
                        
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