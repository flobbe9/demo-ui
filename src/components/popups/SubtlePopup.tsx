import React, { Ref, RefObject, forwardRef, useImperativeHandle, useRef } from "react";
import "../../assets/styles/SubtlePopup.css";
import WarnIcon from "../helpers/WarnIcon";
import { SubtlePopupType } from "../../abstract/SubtlePopupType";


/**
 * Popup designed for displaying messages only. Will disappear after a while automatically. 
 * 
 * @since 0.0.6
 */
export default forwardRef(function SubtlePopup(props: {
    id?: string,
    className?: string,
    style?: React.CSSProperties,
    children?: React.JSX.Element,
    /** heading of popup */
    title: string,
    /** main message of popup */
    message: string
    type: SubtlePopupType
    hideThis: (duration?: number) => void

}, containerRef: Ref<HTMLDivElement>) {

    const id = "SubtlePopup" + (props.id || "");
    const className = "SubtlePopup " + (props.className || "");


    return (
        <div id={id} className={className + " dontHideSubtlePopup " + props.type}>
            {/* header */}
            <div className="dontHideSubtlePopup subtlePopupHeader flex">
                <div className="dontHideSubtlePopup col-4"></div>
                <WarnIcon className={"dontHideSubtlePopup flexCenter col-4"} 
                            size={"small"} 
                            iconContainerClassName={props.type}
                            type={props.type}
                        />

                <i className="fa-solid fa-xmark fa-lg closeIcon dontHideSubtlePopup col-4 flexRight" 
                    onClick={() => props.hideThis(100)}
                    style={{height: "max-content"}}
                >
                </i>
            </div>

            {/* body */}
            <h5 className="dontHideSubtlePopup textCenter">
                {props.title}
            </h5>
            <div className="dontHideSubtlePopup">{props.message}</div>
        </div>

    )
});