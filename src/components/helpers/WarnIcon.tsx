import React, { useRef } from "react";
import "../../assets/styles/WarnIcon.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBooleanFalsy, log } from "../../utils/basicUtils";
import { SubtlePopupType } from "../../abstract/SubtlePopupType";


/**
 * Icon with "!" char to click on and display a text popup with some kind of warning text.
 * 
 * @since 0.0.6
 */
export default function WarnIcon(props: {
    size: "small" | "medium" | "large",
    id?: string,
    className?: string,
    title?: string,
    
    componentStyle?: React.CSSProperties,
    iconContainerStyle?: React.CSSProperties,
    iconContainerClassName?: string,
    popupStyle?: React.CSSProperties,
    /** Determines the icon. */
    type?: SubtlePopupType

    /** if true, the popup will be displayed on hover, else the popup wont be displayed at all */
    showPopupOnHover?: boolean,
    children?
}) {

    const componentRef = useRef(null);
    const iconContainerRef = useRef(null);
    const popupRef = useRef(null);


    function getIcon(): React.JSX.Element {

        const defaultClassName = " warnIcon dontHideWarnIcon ";

        switch (props.type) {
            case "Info":
                return <i className={"fa-solid fa-info" + defaultClassName} style={{marginBottom: "1px"}}></i>

            case "Success": 
                return <i className={"fa-solid fa-check" + defaultClassName}></i>;
            
            case "Warn":
                return <i className={"fa-solid fa-exclamation" + defaultClassName}></i>

            case "Error":
                return <i className={"fa-solid fa-xmark" + defaultClassName} style={{marginTop: "1px"}}></i>;

            default:
                // warn exlamation mark
                return <i className={"fa-solid fa-exclamation" + defaultClassName}></i>;
        }
    }


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
            <div className={"iconContainer flexCenter dontHideWarnIcon " + 
                            (props.iconContainerClassName || "") + " " + 
                            props.size + "Circle " + 
                            (props.showPopupOnHover && "hover")}
                 ref={iconContainerRef}
                 style={props.iconContainerStyle}
                 onClick={handleClick}
                 title={props.title || ""}
                 >
                {getIcon()}
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