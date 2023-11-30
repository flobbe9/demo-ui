import React, { useEffect, useState } from "react";
import "../../assets/styles/ColorPicker.css";
import { log } from "../../utils/Utils";


// TODO: add flexible styles like other buttons
// TODO: test
export default function ColorPicker(props: {
    id: string,
    color: string,
    handleSelect,
    toggleStyle: (color: string) => void,
    className?: string,
    children?,
    style?
}) {

    const id = props.id ? "ColorPicker" + props.id : "ColorPicker";
    const className = props.className ? "ColorPicker " + props.className : "ColorPicker";


    useEffect(() => {
        props.toggleStyle(prependHashTag(props.color));

    }, [props.color]);


    function handleClick() {

        $("#" + id).children().find(".colorInput").trigger("click");
    }


    return (
        <div id={id} className={className} onClick={handleClick} title={props.color} style={props.style}>
            <label className="colorLabel" htmlFor={"colorInput" + props.id}>
                <div className="colorChildren flexCenter">{props.children}</div>
                
                <input id={"colorInput" + props.id} 
                       className="colorInput" 
                       type="color"
                       list="selfPalette" 
                       value={prependHashTag(props.color)}
                       onChange={(event) => props.handleSelect(event.target.value)}
                       />
            </label>
        </div>
    )
}


function prependHashTag(str: string): string {

    const hasHashTag = str.charAt(0) === "#";

    return hasHashTag ? str : "#" + str;
}