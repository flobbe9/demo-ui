import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/ColorPicker.css";
import { log } from "../../utils/Utils";


export default function ColorPicker(props: {
    id: string,
    color: string,
    handleSelect,
    toggleStyle: (color: string) => void,

    hoverBackgroundColor?: string,
    backgroundColor?: string,
    border?: string,
    childrenColor?: string

    className?: string,
    disabled?: boolean,
    children?,
    style?
}) {

    const id = props.id ? "ColorPicker" + props.id : "ColorPicker";
    const className = props.className ? "ColorPicker " + props.className : "ColorPicker";

    const buttonRef = useRef(null);
    const labelRef = useRef(null);
    const childrenRef = useRef(null);


    useEffect(() => {
        initStyles();

    }, [])


    useEffect(() => {
        props.toggleStyle(prependHashTag(props.color));

    }, [props.color]);


    function initStyles(): void {

        const label = $(labelRef.current!);
        const children = $(childrenRef.current!);

        label.css("border", props.border || "");

        children.css("color", props.childrenColor || "");
    }


    function handleClick() {

        $(buttonRef).children().find(".colorInput").trigger("click");
    }


    function handleMouseOver(): void {
        
        const label = $(labelRef.current!);

        label.css("backgroundColor", props.hoverBackgroundColor || "");
    }


    function handleMouseOut(): void {

        const label = $(labelRef.current!);

        label.css("backgroundColor", props.backgroundColor || "");
    }


    return (
        <div id={id} 
             className={className} 
             ref={buttonRef}
             onClick={handleClick} 
             title={props.color} 
             style={props.style}
             >
            <label className="colorLabel"
                   ref={labelRef} 
                   htmlFor={"colorInput" + props.id}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}>
                <div className="colorChildren flexCenter" ref={childrenRef}>{props.children}</div>
                
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