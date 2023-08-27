import React from "react";
import "../../styles/StylePanelCheckbox.css";
import { updateCurrentTextInputStyle } from "./StylePanel";

/**
 * 
 * @param props.styleValue style value to assign to text input onChange
 * @param props.styleAttributeCSS name of the style attribute to change, using the standard CSS name (e.g. font-size)
 * @param props.styleValueDefault default style value to use in style panel, if no text input is selected yet
 * @since 0.0.1 
 */
export default function StylePanelCheckbox(props: {
    children,
    styleValue: string,
    styleAttributeCSS: string, 
    styleValueDefault: string
}) {

    function handleChange(event) {

        // apply text input style
        const inputSelected = updateCurrentTextInputStyle(event, props.styleAttributeCSS, props.styleValueDefault, props.styleValue);

        // toggle checkbox style
        if (inputSelected)
            toggleCheckboxStyle("StylePanelCheckbox-" + props.styleAttributeCSS);
    }


    return (
        <div id={"StylePanelCheckbox-" + props.styleAttributeCSS} 
             className="StylePanelCheckbox">

            {props.children}

            {/* hidden input for checked functionality */}
            <input className="stylePanelInput" 
                   name={props.styleValue} 
                   type="checkbox" 
                   onChange={handleChange} />
        </div>
    );
}


function isChecked(componentId: string): boolean {

    let thisComponent = document.getElementById(componentId)!;

    return thisComponent.querySelector("input")!.checked;
}


export function toggleCheckboxStyle(componentId: string): void {

    let thisComponent = document.getElementById(componentId)!;

    if (isChecked(componentId)) 
        thisComponent.style.backgroundColor = "rgb(155, 155, 155)"
    else 
        thisComponent.style.backgroundColor = "rgb(238, 238, 238)";
}