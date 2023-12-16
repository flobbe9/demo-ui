import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/Checkbox.css"
import { SELECTED_STYLE } from "../../utils/GlobalVariables";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";


// TODO: test
export default function Checkbox(props: {
    id: string, 
    checked: boolean,
    handleSelect,
    
    hoverBackgroundColor?: string,
    checkedBackgroundColor?: string,

    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    childrenStyle?: React.CSSProperties,
    
    className?: string,
    onMouseDown?: (event) => void,
    disabled?: boolean,
    children?,
    title?: string
}) {

    const id = "Checkbox" + props.id;
    const className = props.className ? "Checkbox " + props.className : "Checkbox";
    const labelClassName = "checkboxLabel";
    const labelId = labelClassName + props.id;

    const [checked, setChecked] = useState(props.checked);
    const [disabled, setDisabled] = useState(props.disabled);
    const [boxStyle, setBoxStyle] = useState<React.CSSProperties>();

    const labelRef = useRef(null);
    const inputRef = useRef(null);
    const childrenRef = useRef(null);


    useEffect(() => {
        setBoxStyle(props.boxStyle || {});

    }, []);
    
    
    useEffect(() => {
        setChecked(props.checked);

        const label = $(labelRef.current!);
        if (props.checked) 
            label.css("backgroundColor", props.checkedBackgroundColor || "");

        else 
            label.css("backgroundColor", props.boxStyle?.backgroundColor || "");

    }, [props.checked]);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);

    }, [props.disabled]);


    function handleDisabledChange(disabled: boolean): void {

        if (disabled) {
            $(labelRef.current!).addClass("disabled");
            $(childrenRef.current!).addClass("disabled");
            $(inputRef.current!).addClass("disabled");

        } else {
            $(labelRef.current!).removeClass("disabled");
            $(childrenRef.current!).removeClass("disabled");
            $(inputRef.current!).removeClass("disabled");
        }
    }


    function handleSelect(event): void {

        if (disabled)
            return;

        props.handleSelect(!checked);
    }


    function handleMouseOver(): void {

        if (disabled)
            return;

        const label = $(labelRef.current!);

        if (!checked)
            label.css("backgroundColor", props.hoverBackgroundColor || "");
    }

    
    function handleMouseOut(): void {

        const label = $(labelRef.current!);

        if (!checked)
            label.css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    function handleMouseDown(event): void {

        if (props.onMouseDown)
            props.onMouseDown(event);
    }
    

    return (
        <div id={id} className={className} style={props.componentStyle} onClick={handleSelect} title={props.title}>
            <label id={labelId} 
                   className={labelClassName} 
                   ref={labelRef}
                   style={checked ? {...boxStyle, ...SELECTED_STYLE} : boxStyle}
                   htmlFor={id} 
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}
                   onMouseDown={handleMouseDown}
                   title={props.title}
                   >
                <input id={"checkboxInput" + props.id}  
                       ref={inputRef}
                       className="checkboxInput" 
                       type="checkbox"
                       readOnly
                       checked={checked} 
                       disabled={disabled}
                       />

                <div className="checkboxChildren dontMarkText flexCenter" ref={childrenRef} style={props.childrenStyle}>
                    {props.children}
                </div>
            </label>
        </div>
    )
}