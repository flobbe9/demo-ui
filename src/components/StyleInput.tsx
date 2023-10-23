import React from "react";
import "../assets/styles/StyleInput.css";


export default function StyleInput(props: {
    stylePanelSectionName: string,
    name: string,
    className?: string,
    style?,
    children?
}) {

    const thisId = "StyleInput-" + props.stylePanelSectionName + "-" + props.name;
    const thisClassName = props.className ? "StyleInput " + props.className : "StyleInput";


    return (
        <label htmlFor={props.name}>
            <input id={thisId}
                    className={thisClassName}
                    style={props.style}
                    type="checkbox" 
                    name={props.name}/>
            <span>Texttttt</span>

            {props.children}
        </label>
    )
}