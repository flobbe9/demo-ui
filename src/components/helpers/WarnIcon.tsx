import React, { useRef } from "react";
import "../../assets/styles/WarnIcon.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";


/**
 * Icon with "!" char to click on and display a text popup with some kind of warning text.
 * 
 * @since 0.0.6
 */
export default function WarnIcon(props: {
    id?: string,
    className?: string,
    title?: string,

    componentStyle?: React.CSSProperties,
    iconContainerStyle?: React.CSSProperties,
    popupStyle?: React.CSSProperties,

    /** if true, the popup will be displayed on hover, else the popup wont be displayed at all */
    showPopupOnHover?: boolean,
    children?
}) {

    const componentRef = useRef(null);
    const iconContainerRef = useRef(null);
    const popupRef = useRef(null);


    function handleClick(event): void {

        const isVisible = $(popupRef.current!).is(":visible");

        // case: hidden
        if (props.showPopupOnHover && !isVisible)
            $(popupRef.current!).fadeIn(100);

        // case: click on icon
        if (isVisible && (event.target.className.includes("iconContainer") || event.target.className.includes("warnIcon")))
            $(popupRef.current!).fadeOut(200);
    }


    return (
        <div id={"WarnIcon" + (props.id || "")}
             className={"WarnIcon " + (props.className || "") + " dontHideWarnIcon"}
             ref={componentRef}
             style={props.componentStyle}
             >
            <div className="iconContainer flexCenter dontHideWarnIcon"
                 ref={iconContainerRef}
                 style={props.iconContainerStyle}
                 onClick={handleClick}
                 title={props.title || "Hinweis"}
                 >
                <i className="fa-solid fa-exclamation warnIcon dontHideWarnIcon"></i>
            </div>

            <div className="miniPopup hidden dontHideWarnIcon"
                 ref={popupRef}
                 style={props.popupStyle}
                 >
                {props.children}
            </div>
        </div>
    )
}