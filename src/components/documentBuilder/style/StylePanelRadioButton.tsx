import React, { useEffect } from "react";
import { updateCurrentTextInputStyle, updateCurrentTextInputType } from "./StylePanel";
import "../../styles/StylePanelRadioButton.css";


/**
 * Component defining a radio button in StylePanel component.
 * 
 * @param props.styleValue to apply to HTML inputs. Must be unique for this component!
 * @param props.styleValueDefault to apply to HTML inputs if no valid styleValue is found.
 * @param props.styleAttributeCSS to use for HTML inputs, using CSS syntax (e.g. "text-align" instead of "textAlign")
 * @since 0.0.1
 */
export default function StylePanelRadioButton(props: {
    children,
    radioButtonGroup: string,
    styleValue: string,
    styleValueDefault: string,
    height: string,
    width: string,
    styleAttributeCSS?: string,
}) {

    const className = "StylePanelRadioButton-" + props.styleValue;

    
    useEffect(() => {
        // style default buttons
        if (isDefaultChecked())
            toggleRadioButtonStyle(className, props.radioButtonGroup);
    }, []);

    
    function isDefaultChecked(): boolean {
        
        return props.styleValue === props.styleValueDefault;
    }


    function handleMouseDown(event) {

        let isTextInputSelected;

        // case: input type switch ("text" or "file"...)
        if (props.radioButtonGroup === "textInputTypeSwitch")
            isTextInputSelected = updateCurrentTextInputType(event, props.styleValue);

        // case: normal stylePanel button
        else
            isTextInputSelected = updateCurrentTextInputStyle(event, props.styleAttributeCSS!, props.styleValueDefault);

        if (isTextInputSelected)
            toggleRadioButtonStyle(className, props.radioButtonGroup);
    }

    return (
        <div id={className} 
             className="StylePanelRadioButton" 
             style={{height: props.height,
                     width: props.width}}>

            <span>{props.children}</span>

            <input id={"textInputTypeSwitch-" + props.styleValue} 
                    className="stylePanelInput" 
                    name={props.radioButtonGroup} 
                    type="radio" 
                    value={props.styleValue}
                    defaultChecked={isDefaultChecked()}
                    style={{height: props.height,
                            width: props.width}}
                    onMouseDown={handleMouseDown} />
        </div>
    );
}


function isChecked(componentId: string): boolean {

    const thisComponent = document.getElementById(componentId)!;

    return thisComponent.querySelector("input")!.checked;
}


export function toggleRadioButtonStyle(thisComponentId: string, radioButtonGroup: string): void {

    const thisComponent = document.getElementById(thisComponentId)!;

    const checkedComponent = Array.from(document.getElementsByClassName("StylePanelRadioButton"))
                                  .filter(component => component.querySelector("input")!.name === radioButtonGroup)
                                  .find(component => component.querySelector("input")!.checked)! as HTMLElement;

    if (!checkedComponent)
        return;

    if (!isChecked(thisComponentId)) 
        // uncheck checked component
        checkedComponent.style.backgroundColor = "rgb(238, 238, 238)";

    thisComponent.style.backgroundColor = "rgb(155, 155, 155)";
}