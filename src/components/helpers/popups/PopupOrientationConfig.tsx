import React, { useContext, useState } from "react"; 
import "../../../assets/styles/PopupOrientationConfig.css";
import { AppContext } from "../../App";
import { Orientation } from "../../../enums/Orientation";
import RadioButton from "../../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hideGlobalPopup, log, togglePopupOverlay } from "../../../utils/Utils";
import Button from "../Button";
import Popup from "./Popup";
import PopupWarnConfirm from "./PopupWarnConfirm";


/**
 * Popup content used for changing the document orientation.
 * 
 * @since 0.0.5
 */
export default function PopupOrientationConfig(props) {

    const className = props.className ? "PopupOrientationConfig " + props.className : "PopupOrientationConfig";
    const id = props.id ? "PopupOrientationConfig " + props.id : "PopupOrientationConfig";
    const warnPopupId = id + "Warning";

    const appContext = useContext(AppContext);

    const [orientation, setOrientation] = useState(appContext.orientation)


    function handleSelectOrientation(orientation: Orientation): void {

        setOrientation(orientation);
    }


    function handleSubmit(event): void {

        appContext.setOrientation(orientation);

        appContext.setPages([]);
        setTimeout(() => {
            appContext.setPages(appContext.initPages());
        }, 1);

        hideGlobalPopup(appContext.setPopupContent);
    }


    function toggleWarnPopup(): void {

        // case: selected same orientation
        if (orientation === appContext.orientation) {
            hideGlobalPopup(appContext.setPopupContent);
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
                <div id="orientationContainer" className="orientationContainer flexCenter dontMarkText">
                    <div className="mr-3">
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
                                    checkedBackgroundColor="rgb(238, 238, 238)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
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
                                    checkedBackgroundColor="rgb(238, 238, 238)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                            <span style={{fontSize: "10px"}}>Lorem ipsum</span>
                        </RadioButton>
                        <div className="textCenter">Quer-Format</div>
                    </div>
                </div>

                <Popup id={warnPopupId} className="warnPopup" height="small" width="large">
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
                        className="blackButton blackButtonContained"

                        childrenStyle={{padding: "5px 10px"}}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        
                        handleClick={toggleWarnPopup}>
                    Anwenden
                </Button>
            </div>
        </div>
    )
}