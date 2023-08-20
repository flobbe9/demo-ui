import React from "react";

/**
 * 
 * @param props.label label of checkbox input
 * @param props.styleValue style value to assign to text input onChange
 * @param props.styleAttributeCSS name of the style attribute to change, using the standard CSS name (e.g. font-size)
 * @param props.styleValueDefault default style value to use in style panel, if no text input is selected yet
 * @param props.onChange callback for onChange event
 * @since 0.0.1 
 */
export default function StylePanelCheckbox(props: {
    label: string, 
    styleValue: string,
    styleAttributeCSS: string, 
    styleValueDefault: string,
    onChange
}) {

return (
    <div className="StylePanelCheckbox">
        <label className="stylePanelLabel" htmlFor={props.styleValue}>{props.label}</label>
        <input className="stylePanelInput" 
                type="checkbox" 
                name={props.styleValue} 
                onChange={(event) => props.onChange(event, props.styleAttributeCSS, props.styleValueDefault, props.styleValue)} />
    </div>
);
}