import React, { useState } from "react"; 
import "../../assets/styles/PopupWarnConfirm.css";
import { cookieOptions } from "react-use-cookie";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBooleanFalsy, log } from "../../utils/basicUtils";
import Button from "../helpers/Button";
import WarnIcon from "../helpers/WarnIcon";
import Checkbox from "../helpers/Checkbox";


/**
 * Popup content used for displaying a warning.
 * 
 * @since 0.0.6
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

        handleCheckboxChecked();

        props.handleConfirm();
    }


    function handleCheckboxChecked(isChecked?: boolean): void {

        let dontShowAgain = isDontShowAgain;

        // case: no confirm button
        if (props.dontConfirm && !isBooleanFalsy(isChecked)) {
            setIsDontShowAgain(isChecked || false);
            dontShowAgain = isChecked!;
        }

        // update checkbox selection
        if (props.setDontShowAgainCookie) 
            props.setDontShowAgainCookie(dontShowAgain ? "true" : "false", {days:  365});
    }


    return (
        <div id={id} className={className}> 
            <div className="popupHeader flex">
                <div className="col-4">
                    {/* placeholder */}
                </div>
                <div className="col-4 flexCenterStart">
                    <WarnIcon size="small"
                            iconContainerStyle={{
                                borderColor: "orange",
                                color: "orange",
                            }}
                            hover={false}
                            />
                </div>
                <div className="col-4 flexRightStart">
                    <i className="fa-solid fa-xmark fa-xl closeIcon" onClick={props.hideThis}></i>
                </div>
            </div>

            <div className={"popupBody " + childrenClassName}>
                {props.children}

                {/* dont show again checkbox */}
                {props.displayDontShowAgainCheckbox ? 
                    <div className={props.checkboxContainerClassname || ""} style={{fontSize: "0.8em"}}>
                        <Checkbox id={"DontShowAgainCheckbox"} 
                                  className="flexCenter me-1"
                                  checked={isDontShowAgain} 
                                  handleSelect={props.dontConfirm ? handleCheckboxChecked : setIsDontShowAgain}
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
                        <label htmlFor="checkboxInputDontShowAgainCheckbox">Nachricht nicht mehr anzeigen.</label>
                    </div>
                    :
                    <></>
                }
            </div>

            <div className={"popupFooter flexCenter " + (dontConfirm ? "hidden " : "")}>

                <Button id={id + "Decline"} 
                        className="me-4 blackButton blackButtonContained" 
                        childrenStyle={{
                            padding: "5px 10px",                            
                        }}
                        hoverBackgroundColor="rgb(70, 70, 70)"
                        clickBackgroundColor="rgb(130, 130, 130)"
                        onClick={props.handleDecline}
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
                        onClick={handleConfirm}
                        >
                    Ja
                </Button>
            </div>
        </div>
    )
}