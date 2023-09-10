import React, { useEffect } from "react";
import "../../styles/StylePanelColor.css";
import { updateCurrentTextInputStyle } from "./StylePanel";


/**
 * @param props.styleAttributeCSS name of the style attribute to change, using the standard CSS name (e.g. font-size)
 * @param props.styleValueDefault default style value to use in style panel, if no text input is selected yet
 * @since 0.0.1 
 */
export default function StylePanelColor(props: {
    styleAttributeCSS: string,
    styleValueDefault: string
}) {

    const componentId = "StylePanelColor";


    useEffect(() => {
        // use red on render
        toggleColor("#f00000")
    }, [])


    function handleChange(event) {

        const isTextInputSelected = updateCurrentTextInputStyle(event, props.styleAttributeCSS, props.styleValueDefault);

        if (isTextInputSelected)
            toggleColor((event.target as HTMLInputElement).value);
    }


    function handleMouseOver(componentId: string): void {

        let thisComponent = document.getElementById(componentId);

        if (!thisComponent)
            return;
    
        thisComponent.style.backgroundColor = "rgb(231, 231, 231)";
    }
    

    function handleMouseOut(componentId: string): void {

        let thisComponent = document.getElementById(componentId);

        if (!thisComponent)
            return;
    
        thisComponent.style.backgroundColor = "rgb(238, 238, 238)";
    }


    return (
        <div id={componentId}
             className="StylePanelColor"
             onMouseOver={() => handleMouseOver(componentId)}
             onMouseOut={() => handleMouseOut(componentId)}>
            A
            <input className="stylePanelInput" 
                    type="color" 
                    name="color"
                    onChange={handleChange} />
        </div>
    );
}


export function toggleColor(color: string): void {

    const thisComponent = document.getElementsByClassName("StylePanelColor")[0] as HTMLElement;
    thisComponent.style.textDecorationColor = color;
}