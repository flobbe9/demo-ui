import React from "react"; 
import { getCurrentTextInput } from "../DocumentBuilder";
import { BasicStyle } from "../DocumentBuilder";
import StylePanel from "./StylePanel";


/**
 * Component defining a select input in {@link StylePanel} to set styles of currently selected text input.
 * 
 * @param props.label label of select input
 * @param props.styleAttributeBackend name of the style attribute to change, using the property name of {@link BasicStyle} (e.g. fontSize)
 * @param props.styleAttributeCSS name of the style attribute to change, using the standard CSS name (e.g. font-size)
 * @param props.styleValueDefault default style value to use in style panel, if no text input is selected yet
 * @param props.optionsArray callback returning an array of <option> tags for the select input
 * @param props.onChange callback for onChange event
 * @since 0.0.1
 */
export default function StylePanelSelect(props: {
    label?: string,
    styleAttributeBackend: string,
    styleAttributeCSS: string, 
    styleValueDefault: string,
    optionsArray: () => React.JSX.Element[], 
    onChange
}) {

    return (
        <div className="StylePanelSelect">
            {props.label ? <label className="stylePanelLabel" htmlFor={props.styleAttributeBackend}>{props.label}</label> : null}

            <select className="stylePanelInput" 
                    name={props.styleAttributeBackend} 
                    // only for alert if no input selected
                    onMouseDown={getCurrentTextInput}
                    onChange={(event) => props.onChange(event, props.styleAttributeCSS, props.styleValueDefault)}>
                    {props.optionsArray()}
            </select>
        </div>
    );
}