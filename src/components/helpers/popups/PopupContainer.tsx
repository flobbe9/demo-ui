import React, { forwardRef} from "react";
import "../../../assets/styles/PopupContainer.css";


/**
 * Container component for ```<Popup />```. Only exists for several css configurations.
 * 
 * @since 0.0.5
 */
export default forwardRef(function PopupContainer(props: {
    id: string,
    className?: string,
    children?,
    onClick?
}, ref) {

    const id = "PopupContainer" + props.id;
    const className = "PopupContainer " + (props.className || "");


    return (
        <div id={id} className={className + " hidden flexCenter"} ref={ref} onClick={props.onClick}>
            {props.children}
        </div>
    )
});