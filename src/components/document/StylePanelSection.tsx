import React from "react"
import "../../assets/styles/StylePanelSection.css";


export default function StylePanelSection(props: {
    id: string,
    hideRightBorder: boolean,
    className?: string,
    buttonContainerClassName?: string,
    componentStyle?: React.CSSProperties
    buttonContainerStyle?: React.CSSProperties,
    children?,
}) {

    const id = props.id ? "StylePanelSection" + props.id : "StylePanelSection";
    const className = props.className ? "StylePanelSection " + props.className : "StylePanelSection";
    let buttonContainerClassName = props.hideRightBorder === true ? "buttonContainer hideRightBorder" : "buttonContainer";
    buttonContainerClassName += props.buttonContainerClassName ? " " + props.buttonContainerClassName : "";


    return (
        <div id={id} className={className} style={props.componentStyle}>
            <div className={buttonContainerClassName} style={props.buttonContainerStyle}>
                {props.children}
            </div>
        </div>
    )
}