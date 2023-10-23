import React from "react";
import "../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";


export default function StylePanel(props: {
    className?: string,
    style?,
    children?
}) {

    const thisClassName = props.className ? "StylePanel " + props.className : "StylePanel";

    return (
        <div id="StylePanel"
             className={thisClassName}>
            <h2>StylePanel</h2>
            <StylePanelSection stylePanelSectionName={"textInputType"} />
        </div>
    )
}