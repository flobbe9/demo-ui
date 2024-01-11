import React, { useContext, useState } from "react"; 
import "../../../assets/styles/PopupOrientationConfig.css";
import { AppContext } from "../../App";
import { Orientation } from "../../../enums/Orientation";
import RadioButton from "../../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../../utils/basicUtils";
import Button from "../Button";
import Popup from "./Popup";
import PopupWarnConfirm from "./PopupWarnConfirm";
import { DocumentContext } from "../../document/Document";


/**
 * Popup content used for changing the document orientation.
 * 
 * @since 0.0.5
 */
export default function PopupOrientationConfig(props: {
    id?: string,
    className?: string,
    children?,
    toggleWarnPopup: (warnPopupId: string, duration?: number) => void
}) {

    const className = "PopupOrientationConfig " + (props.className || "PopupOrientationConfig");
    const id = "PopupOrientationConfig " + (props.id || "PopupOrientationConfig");
    const warnPopupId = "OrientationConfigWarning";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [orientation, setOrientation] = useState(documentContext.orientation);


    function handleSelectOrientation(orientation: Orientation): void {

        setOrientation(orientation);
    }


    function handleSubmit(event): void {

        documentContext.setOrientation(orientation);

        documentContext.setPages([]);
        setTimeout(() => documentContext.setPages(documentContext.initPages()), 1);

        documentContext.hidePopup();
    }


    function toggleWarnPopup(duration = 100): void {

        // case: selected same orientation
        if (orientation === documentContext.orientation) {
            documentContext.hidePopup(duration);
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
                <div id="orientationContainer" className="orientationContainer flexCenter dontMarkText">
                    <div className="mr-0 mr-sm-3">
                        <RadioButton id="Portrait"
                                    className="radioContainer" 
                                    labelClassName="whiteButton whiteButtonPortrait"
                                    childrenClassName="flexCenterStart"
                                    name="Orientation" 
                                    value={Orientation.PORTRAIT}
                                    radioGroupValue={orientation}
                                    handleSelect={handleSelectOrientation}
                                    boxStyle={{
                                        borderRadius: "3px",
                                        boxShadow: "0 1px 3px 0px rgb(151, 151, 151)",
                                        padding: "2px"
                                    }}
                                    checkedStyle={{backgroundColor: "rgb(238, 238, 238)"}}
                                    hoverBackgroundColor="rgb(243, 243, 243)"
                                    >
                            <span style={{fontSize: "10px"}}>Lorem ipsum</span>
                        </RadioButton>
                        <div className="textCenter">Hoch-Format</div>
                    </div>
                    
                    <div>
                        <RadioButton id="Landscape"
                                    className="radioContainer"
                                    labelClassName="whiteButton whiteButtonLandscape"
                                    childrenClassName="flexCenterStart"
                                    name="Orientation"
                                    value={Orientation.LANDSCAPE}
                                    radioGroupValue={orientation}
                                    handleSelect={handleSelectOrientation}
                                    boxStyle={{
                                        borderRadius: "3px",
                                        boxShadow: "0 1px 3px 0px rgb(151, 151, 151)",
                                        padding: "2px"
                                    }}
                                    checkedStyle={{backgroundColor: "rgb(238, 238, 238)"}}
                                    hoverBackgroundColor="rgb(243, 243, 243)"
                                    >
                            <span style={{fontSize: "10px"}}>Lorem ipsum</span>
                        </RadioButton>
                        <div className="textCenter">Quer-Format</div>
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

            <div className="popupFooter flexRight" >
                <Button id={id + "Submit"} 
                        className="blackButton blackButtonContained"
                        childrenStyle={{padding: "5px 10px"}}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        handleClick={(event) => toggleWarnPopup()}
                        >
                    Anwenden
                </Button>
            </div>
        </div>
    )
}