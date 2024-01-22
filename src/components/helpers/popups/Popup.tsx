import React, { useState, useEffect, useRef, forwardRef, LegacyRef } from "react";
import "../../../assets/styles/Popup.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../../utils/basicUtils";
import { PopupSize, isPopupSize } from "../../../abstract/PopupSize";


/**
 * Container that can be toggled via ```toggleGlobalPopup()```. An overlay will be displayed to
 * blur any other content (z-index = 2).
 * 
 * @since 0.0.5
 */
export default forwardRef(function Popup(props: {
    id: string,
    className?: string,
    children?,
    style?: React.CSSProperties,

    height: PopupSize | string,
    width: PopupSize | string,
    handleOverlayClick?: () => void
}, ref: LegacyRef<HTMLDivElement> | undefined) {

    const id = "Popup" + props.id;

    const [style, setStyle] = useState(initStyle());
    const [className, setClassName] = useState("Popup " + initClassName());
    
    const overlayRef = useRef(null);
    const childrenRef = useRef(null);


    function initClassName(): string {

        let newClassName = props.className + " ";

        if (isPopupSize(props.height))
            newClassName += props.height + "Height ";

        if (isPopupSize(props.width))
            newClassName += props.width + "Width ";

        if (props.className)
            newClassName += props.className + " ";

        return newClassName;
    }


    // TODO: does not work
    function initStyle() {

        let style = props.style || {};

        if (!isPopupSize(props.height))
            style = { ...style, height: props.height };

        if (!isPopupSize(props.width))
            style = { ...style, width: props.width };
        
        return style;
    }


    return (
        <div id={id} 
             className={className} 
             style={style}
             ref={ref}
             >
            <div className={"popupOverlay"} ref={overlayRef} onClick={props.handleOverlayClick}></div>

            <div className={"popupChildren"} ref={childrenRef}>{props.children}</div>
        </div>
    )
});