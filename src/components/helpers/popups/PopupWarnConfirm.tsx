import React, { useContext, useEffect, useState, useRef } from "react"; 
import useCookie, { cookieOptions, getCookie } from "react-use-cookie";
import "../../../assets/styles/PopupWarnConfirm.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBooleanFalsy, log, } from "../../../utils/basicUtils";
import Button from "../Button";
import WarnIcon from "../WarnIcon";
import { DONT_SHOW_AGAIN_COOKIE_NAME } from "../../../globalVariables";
import Checkbox from "../Checkbox";


/**
 * Popup content used for displaying a warning.
 * 
 * @since 0.0.5
 */
export default function PopupWarnConfirm(props: {
    id: string,
    hideThis,
    className?: string,
    childrenClassName?: string
    checkboxContainerClassname?: string
    children?
    handleConfirm?,
    handleDecline?
    /** if true, the yes/no buttons wont be displayed */
    dontConfirm?: boolean,
    /** if true a checkbox with "dont show again" is displayed */
    displayDontShowAgainCheckbox?: boolean
    /** cookie and setter to save user selection. Will be used on confirm "yes" only */
    dontShowAgainCookie?: string
    setDontShowAgainCookie?: (newCookie: string, options?: cookieOptions) => void
}) {

    const id = "PopupWarnConfirm" + (props.id || "");
    const className = "PopupWarnConfirm " + (props.className || "PopupWarnConfirm");
    const childrenClassName = props.childrenClassName || "";

    const [dontConfirm, setDontConfirm] = useState(isBooleanFalsy(props.dontConfirm) ? false : props.dontConfirm);
    const [isDontShowAgain, setIsDontShowAgain] = useState(false);


    function handleConfirm(event): void {

        // case: no checkbox
        if (!props.displayDontShowAgainCheckbox) {
            props.handleConfirm();
            return;
        }

        // update checkbox selection
        if (props.setDontShowAgainCookie && isDontShowAgain) 
            props.setDontShowAgainCookie("true", {days:  365});
        
        props.handleConfirm();
    }


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

                {/* dont show again checkbox */}
                {props.displayDontShowAgainCheckbox ? 
                    <div className={props.checkboxContainerClassname || ""} style={{fontSize: "0.8em"}}>
                        <Checkbox id={"DontShowAgainCheckbox"} 
                                  className="flexCenter mr-1"
                                  checked={isDontShowAgain} 
                                  handleSelect={setIsDontShowAgain}
                                  boxStyle={{
                                    border: "1px solid rgb(200, 200, 200)",
                                    borderRadius: "3px",
                                    height: "20px",
                                    width: "20px"
                                  }}
                                  checkedStyle={{backgroundColor: "rgb(240, 240, 240)"}}
                                  >
                            <div>
                                {isDontShowAgain ? <i className="fa-solid fa-check"></i> : <></>}
                            </div>
                        </Checkbox>
                        <label htmlFor="dontShowAgainCheckbox">Nachricht nicht mehr anzeigen.</label>
                    </div>
                    :
                    <></>
                }
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
                        handleClick={handleConfirm}
                        >
                    Ja
                </Button>
            </div>
        </div>
    )
}