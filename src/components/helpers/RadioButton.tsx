import React, { useEffect, useState } from "react";
import "../../assets/styles/RadioButton.css";
import { log } from "../../utils/Utils";


// TODO: test
export default function RadioButton(props: {
    id: string,
    name: string,
    value: any,
    radioGroupValue: any,
    handleSelect: Function,
    
    color?: string,
    backgroundColor?: string,
    hoverBackgroundColor?: string,
    checkedBackgroundColor?: string,
    border?: string,

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

    // TODO: continue here (not sure what I was doing though)
    // const 

    const checkedStyle:React.CSSProperties = {
        borderColor: "aqua"
    }


    // set prop styles
    useEffect(() => {
        initStyles();

    }, []);


    // handle select
    useEffect(() => {
        handleValueChange();

    }, [props.radioGroupValue]);


    useEffect(() => {
        setDisabled(props.disabled);

    }, [props.disabled]);


    function initStyles(): void {

        const radioLabel = $("#" + labelClassName + props.id);

        radioLabel.css("color", props.color || "");
        radioLabel.css("backgroundColor", props.backgroundColor || "");
        if (props.border)
            radioLabel.css("border", props.border);
    }


    function handleSelect(event): void {

        if (disabled)
            return;

        props.handleSelect(props.value)
    }


    function handleValueChange(): void {

        const checked = props.value === props.radioGroupValue;
        setChecked(checked);

        const label = $("#" + labelId);
        if (checked)
            label.css("backgroundColor", props.checkedBackgroundColor || "");
        
        else 
            label.css("backgroundColor", props.backgroundColor || "");
    }


    function handleMouseOver(): void {

        if (disabled)
            return;

        if (!checked)
            $("#" + labelId).css("backgroundColor", props.hoverBackgroundColor || "");
    }

    function handleMouseOut(): void {

        if (!checked)
            $("#" + labelId).css("backgroundColor", props.backgroundColor || "");
    }


    return (
        <div id={id} className={className} style={props.style} title={props.title}>
            <label id={labelClassName + props.id} className={labelClassName} 
                   htmlFor={props.name}
                   style={checked ? checkedStyle : {}}
                   onClick={handleSelect}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}>
                <input id={"radioInput" + props.id} 
                       className="radioInput " 
                       type="radio" 
                       name={props.name} 
                       checked={checked}
                       disabled={disabled}
                       readOnly
                       />

                <div className={childrenClassName}>{props.children}</div>
            </label>
        </div>
    )
}