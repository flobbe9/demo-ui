import React from "react";
import { getCurrentTextInput } from "../DocumentBuilder";
import StylePanel from "./StylePanel";


/**
 * Component defining a radio button in {@link StylePanel} to switch text input types.
 * 
 * @since 0.0.1
 */
export default function StylePanelRadioButton(props: {
    label: string, 
    inputType: string, 
    onClick
 }) {

    return (
        <div className="StylePanelRadioButton">
            <label htmlFor="textInputTypeSwitch">{props.label}</label>
            <input id={"textInputTypeSwitch-" + props.inputType} 
                    className="stylePanelInput" 
                    name="textInputTypeSwitch" 
                    type="radio" 
                    // only for alert if no input selected
                    onMouseDown={getCurrentTextInput}            
                    onClick={(event) => props.onClick(event, props.inputType)}/>
        </div>
    );
}