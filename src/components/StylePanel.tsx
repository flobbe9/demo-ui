import React, { useContext, useEffect } from "react";
import "../assets/styles/StylePanel.css";
import { log } from "../utils/Utils";
import { AppContext } from "../App";


export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);


    return (
        <div id={id} className={className}>
            StylePanel
        </div>
    )
}