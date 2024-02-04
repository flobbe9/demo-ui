import React, { LegacyRef, forwardRef} from "react";
import "../../assets/styles/PopupContainer.css";


/**
 * Container component for ```<Popup />```. Only exists for several css configurations.
 * 
 * @since 0.0.6
 */
export default forwardRef(function PopupContainer(props: {
    id: string,
    className?: string,
    children?,
    onClick?,
    style?: React.CSSProperties,
    matchPopupDimensions?: boolean
}, ref: LegacyRef<HTMLDivElement> | undefined) {

    const id = "PopupContainer" + props.id;
    const className = "PopupContainer " + (props.className || "");


    return (
        <div id={id} 
            className={className + " hidden flexCenter " + (props.matchPopupDimensions && "matchPopupDimensions")} 
            ref={ref} 
            style={props.style} 
            onClick={props.onClick}
            >
            {props.children}
        </div>
    )
});