import React, { useEffect, useState } from "react";
import "../../assets/styles/ColorPicker.css";
import { log } from "../../utils/Utils";


export default function ColorPicker(props: {
    id: string,
    handleSelect?,
    children?,
    className?: string,
}) {

    const id = props.id ? "ColorPicker" + props.id : "ColorPicker";
    const className = props.className ? "ColorPicker " + props.className : "ColorPicker";

    const [color, setColor] = useState("#000000");// default black


    function handleClick() {

        $("#" + id).children().find(".colorInput").trigger("click");
    }


    function handleSelect(event) {

        // update state
        setColor(event.target.value);

        // select handler
        if (props.handleSelect)
            props.handleSelect(event.target.value);
    }


    return (
        <div id={id} className={className} onClick={handleClick}>
            <label className="colorLabel" htmlFor="">
                <div className="colorChildren flexCenter">{props.children}</div>
                
                <input id={"colorInput" + props.id} 
                       className="colorInput" 
                       type="color"
                       list="selfPalette" 
                       onChange={(event) => handleSelect(event)}/>
            </label>
        </div>
    )
}