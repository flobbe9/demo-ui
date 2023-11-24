import React, { useEffect, useState } from "react";
import "../../assets/styles/RadioButton.css";
import { log } from "../../utils/Utils";


export default function RadioButton(props: {
    id: string,
    name: string,
    value: any,
    radioGroupValue: any,
    handleSelect: Function,
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
    const childrenClassName = props.childrenClassName ? "radioChildren " + props.childrenClassName : "radioChildren";


    return (
        <div id={id} className={className} onClick={() => props.handleSelect(props.value)} style={props.style} title={props.title}>
            <label className={labelClassName + (props.value === props.radioGroupValue ? " radioInputChecked" : "")} htmlFor={props.name}>
                <input id={"radioInput" + props.id} 
                       className="radioInput " 
                       type="radio" 
                       name={props.name} 
                       checked={props.value === props.radioGroupValue}
                       readOnly
                       />

                <div className={childrenClassName}>{props.children}</div>
            </label>
        </div>
    )
}