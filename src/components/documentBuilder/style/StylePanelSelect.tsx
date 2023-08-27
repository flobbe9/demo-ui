import React from "react"; 
import { getCurrentTextInput } from "../DocumentBuilder";
import { BasicStyle } from "../DocumentBuilder";
import StylePanel, { updateCurrentTextInputStyle } from "./StylePanel";
import "../../styles/StylePanelSelect.css";


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
// TODO: prevent default wont prevent select
export default function StylePanelSelect(props: {
    label?: string,
    styleAttributeBackend: string,
    styleAttributeCSS: string, 
    styleValueDefault: string,
    optionsArray: () => React.JSX.Element[], 
}) {

    return (
        <div className="StylePanelSelect">
            <select className="stylePanelInput" 
                    name={props.styleAttributeBackend} 
                    // only for alert if no input selected
                    onMouseDown={getCurrentTextInput}
                    onChange={(event) => updateCurrentTextInputStyle(event, props.styleAttributeCSS, props.styleValueDefault)}
                    defaultValue={"16px"}>

                    {props.optionsArray()}
            </select>
        </div>
    );
}