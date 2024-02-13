import React, { useContext, useEffect, useState } from "react"; 
import "../../assets/styles/PopupColumnConfig.css";
import useCookie from "react-use-cookie";
import { AppContext } from "../App";
import { Orientation } from "../../enums/Orientation";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log} from "../../utils/basicUtils";
import Button from "../helpers/Button";
import Popup from "./Popup";
import PopupWarnConfirm from "./PopupWarnConfirm";
import { DocumentContext } from "../document/Document";
import PopupContainer from "./PopupContainer";
import { DONT_SHOW_AGAIN_COOKIE_NAME } from "../../globalVariables";
import { getDefaultStyle } from "../../abstract/Style";


/**
 * Popup content used for changing the number of columns in a document.
 * 
 * @since 0.0.6
 */
export default function PopupColumnConfig(props: {
    id?: string,
    className?: string,
    children?,
    warnPopupContainerIdPart: string
    toggleWarnPopup: (warnPopupId: string, duration?: number) => void
}) {

    const className = "PopupColumnConfig " + (props.className || "");
    const id = "PopupColumnConfig" + (props.id || "");

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [orientationClassName, setOrientationClassName] = useState("whiteButtonPortrait");
    const [selectedNumColumns, setSelectedNumColumns] = useState(documentContext.numColumns)
    const [dontShowAgainCookie, setDontShowAgainCookie] = useCookie(DONT_SHOW_AGAIN_COOKIE_NAME + "ColumnConfig", "false");


    useEffect(() => {
        if (documentContext.orientation === Orientation.PORTRAIT.toString())
            setOrientationClassName("whiteButtonPortrait")
        
        else    
            setOrientationClassName("whiteButtonLandscape");

    }, [documentContext.orientation]);


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

        documentContext.setSelectedTextInputStyle(getDefaultStyle());

        documentContext.hidePopup();
    }


    function toggleWarnPopup(event, duration = 100): void {

        // case: selected same number
        if (selectedNumColumns === documentContext.numColumns) {
            documentContext.hidePopup()
            return;
        }

        // case: dont show again
        if (dontShowAgainCookie === "true") {
            handleSubmit(event)
            return;
        }

        props.toggleWarnPopup("PopupContainer" + props.warnPopupContainerIdPart, duration);
    }


    return (
        <div id={id} className={className}>
            <div className="popupHeader flexRightStart">
                <i className="fa-solid fa-xmark fa-xl closeIcon hideDocumentPopup"></i>
            </div>
            
            <div className="popupBody">
                <h2 className="textCenter">Spalten Anzahl</h2>
                <div className="bodyContent flexCenter">
                    <div id="numColumnsContainer" className="numColumnsContainer flexCenter dontMarkText">
                        <div className="radioContainer ms-1 m-2">
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
                            <div className="mt-2 mb-3 me-2 textCenter">1 Spalte / Seite</div>
                        </div>

                        <div className="radioContainer m-2">
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
                            <div className="mt-2 mb-3 textCenter">2 Spalten / Seite</div>
                        </div>

                        <div className="radioContainer m-2">
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
                            <div className="mt-2 mb-3 textCenter">3 Spalten / Seite</div>
                        </div>
                    </div>

                    <PopupContainer id={props.warnPopupContainerIdPart} className="warnPopupContainer" matchPopupDimensions={documentContext.matchPopupDimensions}>
                        <Popup id={props.warnPopupContainerIdPart} height={appContext.isMobileView ? "350px" : "medium"} width="medium">
                            <PopupWarnConfirm id="ColumnConfig" handleConfirm={handleSubmit} 
                                            handleDecline={(event) => toggleWarnPopup(event)}
                                            hideThis={(event) => toggleWarnPopup(event)}
                                            displayDontShowAgainCheckbox={true}
                                            checkboxContainerClassname="flexCenter mt-5"
                                            setDontShowAgainCookie={setDontShowAgainCookie}
                                            >
                                <p className="textCenter">Der Inhalt des <strong>gesamten</strong> Dokumentes wird <strong>gelöscht</strong> werden.</p>
                                <p className="textCenter">Fortfahren?</p>
                            </PopupWarnConfirm>
                        </Popup>
                    </PopupContainer>
                </div>
            </div>

            <div className="popupFooter flexRight">
                <Button id={id + "Submit"} 
                        onClick={(event) => toggleWarnPopup(event)}
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