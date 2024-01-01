import React, { useContext, useEffect, useState, useRef } from "react"; 
import "../../../assets/styles/PopupWarnConfirm.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hideGlobalPopup, isBooleanFalsy, log, togglePopupOverlay } from "../../../utils/Utils";
import Button from "../Button";
import WarnIcon from "../WarnIcon";


/**
 * Popup content used for displaying a warning.
 * 
 * @since 0.0.5
 */
export default function PopupWarnConfirm(props: {
    id?: string,
    hideThis: () => void,
    className?: string,
    childrenClassName?: string
    children?
    handleConfirm?,
    handleDecline?
    /** if true, the yes/no buttons wont be displayed */
    dontConfirm?: boolean,
}) {

    const className = props.className ? "PopupWarnConfirm " + props.className : "PopupWarnConfirm";
    const childrenClassName = props.childrenClassName || "";
    const id = props.id ? "PopupWarnConfirm " + props.id : "PopupWarnConfirm";

    const [dontConfirm, setDontConfirm] = useState(isBooleanFalsy(props.dontConfirm) ? false : props.dontConfirm);


    return (
        <div id={id} className={className}> 
            <div className="popupHeader flexCenter">
                <WarnIcon size="small"
                        iconContainerStyle={{
                            borderColor: "orange",
                            color: "orange",
                        }}
                        hover={false}
                         />
                <i className="fa-solid fa-xmark fa-xl closeIcon" onClick={props.hideThis}></i>
            </div>

            <div className={"popupBody " + childrenClassName}>
                {props.children}
            </div>

            <div className={"popupFooter flexCenter " + (dontConfirm ? "hidden " : "")}>
                <Button id={id + "Decline"} 
                        className="mr-4 blackButton blackButtonContained" 
                        childrenStyle={{
                            padding: "5px 10px",                            
                        }}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        handleClick={props.handleDecline}
                        >
                    Nein
                </Button>

                <Button id={id + "Confirm"} 
                        className="blackButton blackButtonContained" 
                        childrenStyle={{
                            padding: "5px 10px",                            
                            width: "50px"
                        }}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        handleClick={props.handleConfirm}
                        >
                    Ja
                </Button>
            </div>
        </div>
    )
}