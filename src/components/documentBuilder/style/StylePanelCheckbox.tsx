import React from "react";
import "../../styles/StylePanelCheckbox.css";
import { handleMouseOut, handleMouseOver, isChecked, updateCurrentTextInputStyle } from "./StylePanel";

/**
 * 
 * @param props.styleValue style value to assign to text input onChange
 * @param props.styleAttributeCSS name of the style attribute to change, using the standard CSS name (e.g. font-size)
 * @param props.styleValueDefault default style value to use in style panel, if no text input is selected yet
 * @since 0.0.1 
 */
export default function StylePanelCheckbox(props: {
    children?,
    styleValue: string,
    styleAttributeCSS: string, 
    styleValueDefault: string
}) {

    const componentId = "StylePanelCheckbox-" + props.styleAttributeCSS;


    function handleChange(event) {

        // apply text input style
        const inputSelected = updateCurrentTextInputStyle(event, props.styleAttributeCSS, props.styleValueDefault, props.styleValue);

        // toggle checkbox style
        if (inputSelected)
            toggleCheckboxStyle(componentId);
    }


    return (
        <div id={componentId} 
             className="StylePanelCheckbox"
             onMouseOver={() => handleMouseOver(componentId)}
             onMouseOut={() => handleMouseOut(componentId)}>

            {props.children}

            {/* hidden input for checked functionality */}
            <input className="stylePanelInput" 
                   name={props.styleValue} 
                   type="checkbox" 
                   onChange={handleChange} />
        </div>
    );
}


export function toggleCheckboxStyle(componentId: string): void {

    let thisComponent = document.getElementById(componentId)!;

    if (isChecked(componentId)) 
        thisComponent.style.backgroundColor = "rgb(200, 200, 200)"
    else 
        thisComponent.style.backgroundColor = "rgb(238, 238, 238)";
}