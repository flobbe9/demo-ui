import React from "react"
import "../assets/styles/StylePanelSection.css";


export default function StylePanelSection(props: {
    hideRightBorder: boolean,
    id?: string,
    className?: string,
    buttonContainerClassName?: string,
    children?
}) {

    const id = props.id ? "StylePanelSection" + props.id : "StylePanelSection";
    const className = props.className ? "StylePanelSection " + props.className : "StylePanelSection";
    let buttonContainerClassName = props.hideRightBorder === true ? "buttonContainer hideRightBorder" : "buttonContainer";
    buttonContainerClassName += props.buttonContainerClassName ? " " + props.buttonContainerClassName : "";


    return (
        <div id={id} className={className}>
            <div className={buttonContainerClassName}>
                {props.children}
            </div>
        </div>
    )
}