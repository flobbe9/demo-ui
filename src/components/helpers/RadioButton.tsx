import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/RadioButton.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";
import { SELECTED_STYLE } from "../../utils/GlobalVariables";


export default function RadioButton(props: {
    id: string,
    name: string,
    value: any,
    radioGroupValue: any,
    handleSelect: Function,
    
    hoverBackgroundColor?: string,
    checkedBackgroundColor?: string,

    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    childrenStyle?: React.CSSProperties,

    title?: string,
    className?: string,
    labelClassName?: string,
    childrenClassName?: string,
    disabled?: boolean,
    children?,
    style?
}) {

    const id = "RadioButton" + props.id;
    const className = props.className ? "RadioButton " + props.className : "RadioButton";
    const labelClassName = props.labelClassName ? "radioLabel " + props.labelClassName : "radioLabel";
    const labelId = labelClassName + props.id;
    const childrenClassName = props.childrenClassName ? "radioChildren " + props.childrenClassName : "radioChildren";

    const [checked, setChecked] = useState(props.value === props.radioGroupValue);
    const [disabled, setDisabled] = useState(props.disabled);
    const [boxStyle, setBoxStyle] = useState<React.CSSProperties>();

    const boxRef = useRef(null);
    const inputRef = useRef(null);
    const childrenRef = useRef(null);


    // set prop styles
    useEffect(() => {
        setBoxStyle(props.boxStyle || {});

    }, []);


    // handle select
    useEffect(() => {
        handleValueChange();

    }, [props.radioGroupValue]);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);

    }, [props.disabled]);


    function handleDisabledChange(disabled: boolean): void {

        if (disabled) {
            $(boxRef.current!).css("cursor", "inherit");
            $(childrenRef.current!).css("cursor", "inherit");
            $(inputRef.current!).css("cursor", "inherit");
            $(boxRef.current!).css("opacity", 0.5);

        } else {
            $(boxRef.current!).css("cursor", "pointer");
            $(childrenRef.current!).css("cursor", "pointer");
            $(inputRef.current!).css("cursor", "pointer");
            $(boxRef.current!).css("opacity", 1);
        }
    }



    function handleSelect(event): void {

        if (disabled)
            return;

        props.handleSelect(props.value)
    }


    function handleValueChange(): void {

        const checked = props.value === props.radioGroupValue;
        setChecked(checked);

        const label = $(boxRef.current!);
        if (checked)
            label.css("backgroundColor", props.checkedBackgroundColor || "");
        
        else 
            label.css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    function handleMouseOver(): void {

        if (disabled)
            return;

        if (!checked)
            $(boxRef.current!).css("backgroundColor", props.hoverBackgroundColor || "");
    }


    function handleMouseOut(): void {

        if (!checked)
            $(boxRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    return (
        <div id={id} className={className} style={props.componentStyle} title={props.title}>
            <label id={labelId} 
                   className={labelClassName}
                   ref={boxRef}
                   htmlFor={props.name}
                   style={checked ? {...boxStyle, ...SELECTED_STYLE} : boxStyle}
                   onClick={handleSelect}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}
                   title={props.title}
                   >
                <input id={"radioInput" + props.id} 
                       ref={inputRef}
                       className="radioInput " 
                       type="radio" 
                       name={props.name} 
                       checked={checked}
                       disabled={disabled}
                       readOnly
                       />

                <div className={childrenClassName} ref={childrenRef} style={props.childrenStyle}>{props.children}</div>
            </label>
        </div>
    )
}