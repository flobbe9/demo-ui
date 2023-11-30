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
    children?,
    style?
}) {

    const id = "RadioButton" + props.id;
    const className = props.className ? "RadioButton " + props.className : "RadioButton";
    const labelClassName = props.labelClassName ? "radioLabel " + props.labelClassName : "radioLabel";
    const labelId = labelClassName + props.id;
    const childrenClassName = props.childrenClassName ? "radioChildren " + props.childrenClassName : "radioChildren";

    const [checked, setChecked] = useState(props.value === props.radioGroupValue);

    const checkedStyle:React.CSSProperties = {
        borderColor: "aqua"
    }


    // set prop styles
    useEffect(() => {
        const radioLabel = $("#" + labelClassName + props.id);

        radioLabel.css("color", props.color || "");
        radioLabel.css("backgroundColor", props.backgroundColor || "");
        if (props.border)
            radioLabel.css("border", props.border);
    }, []);


    // handle select
    useEffect(() => {
        const checked = props.value === props.radioGroupValue;
        setChecked(checked);

        const label = $("#" + labelId);
        if (checked)
            label.css("backgroundColor", props.checkedBackgroundColor || "");
        
        else 
            label.css("backgroundColor", props.backgroundColor || "");

    }, [props.radioGroupValue]);


    function handleMouseOver(): void {

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
                   onClick={() => props.handleSelect(props.value)}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}>
                <input id={"radioInput" + props.id} 
                       className="radioInput " 
                       type="radio" 
                       name={props.name} 
                       checked={checked}
                       readOnly
                       />

                <div className={childrenClassName}>{props.children}</div>
            </label>
        </div>
    )
}