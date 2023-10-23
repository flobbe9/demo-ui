import React from "react";
import "../assets/styles/StylePanelSection.css";
import StyleInput from "./StyleInput";



export default function StylePanelSection(props: {
    stylePanelSectionName: string
    className?: string,
    style?,
    children?
}) {

    const thisId = "StylePanelSection-" + props.stylePanelSectionName;
    const thisClassName = props.className ? "StylePanelSection " + props.className : "StylePanelSection";

    return (
        <div id={thisId}
             className={thisClassName}>
            <h3>StylePanelSection</h3>
            <StyleInput stylePanelSectionName={props.stylePanelSectionName} name={"fontSize"} />
        </div>
    )
}