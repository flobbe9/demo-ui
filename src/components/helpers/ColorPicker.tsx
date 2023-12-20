import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/ColorPicker.css";
import { isRGB, log } from "../../utils/Utils";


export default function ColorPicker(props: {
    id: string,
    color: string,
    handleSelect,
    toggleStyle: (color: string) => void,

    hoverBackgroundColor?: string,

    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    childrenStyle?: React.CSSProperties,

    className?: string,
    disabled?: boolean,
    children?,
    style?
}) {

    const id = props.id ? "ColorPicker" + props.id : "ColorPicker";
    const className = props.className ? "ColorPicker " + props.className : "ColorPicker";

    const [disabled, setDisabled] = useState(props.disabled);

    const componentRef = useRef(null);
    const boxRef = useRef(null);
    const inputRef = useRef(null);
    const childrenRef = useRef(null);


    useEffect(() => {
        props.toggleStyle(prependHashTag(props.color));

    }, [props.color]);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);

    }, [props.disabled])


    function handleDisabledChange(disabled: boolean): void {

        if (disabled) {
            $(boxRef.current!).addClass("disabled");
            $(childrenRef.current!).addClass("disabled");
            $(inputRef.current!).addClass("disabled");
            $(boxRef.current!).addClass("disabled");

        } else {
            $(boxRef.current!).removeClass("disabled");
            $(childrenRef.current!).removeClass("disabled");
            $(inputRef.current!).removeClass("disabled");
            $(boxRef.current!).removeClass("disabled");
        }
    }


    function handleChange(event): void {

        if (disabled)
            return;

        props.handleSelect(event.target.value)
    }


    function handleClick(): void {

        if (disabled)
            return;

        $(componentRef).children().find(".colorInput").trigger("click");
    }


    function handleMouseOver(): void {

        if (disabled)
            return;

        const label = $(boxRef.current!);

        label.css("backgroundColor", props.hoverBackgroundColor || "");
    }


    function handleMouseOut(): void {

        if (disabled)
            return;

        const label = $(boxRef.current!);

        label.css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    return (
        <div id={id} 
             className={className} 
             ref={componentRef}
             onClick={handleClick} 
             title={isRGB(props.color) ? props.color : "#" + props.color} 
             style={props.componentStyle}
             >
            <label className="colorLabel"
                   ref={boxRef} 
                   style={props.boxStyle}
                   htmlFor={"colorInput" + props.id}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}>
                <div className="colorChildren flexCenter" 
                     ref={childrenRef}
                     style={props.childrenStyle}
                     >
                    {props.children}
                </div>
                
                <input id={"colorInput" + props.id} 
                       className="colorInput" 
                       ref={inputRef}
                       type="color"
                       list="selfPalette" 
                       value={prependHashTag(props.color)}
                       onChange={handleChange}
                       onClick={(event) => disabled ? event.preventDefault() : {}}
                       />
            </label>
        </div>
    )
}


function prependHashTag(str: string): string {

    const hasHashTag = str.charAt(0) === "#";

    return hasHashTag ? str : "#" + str;
}