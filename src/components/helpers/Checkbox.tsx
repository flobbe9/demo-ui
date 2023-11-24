import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/Checkbox.css"


export default function Checkbox(props: {
    id: string, 
    checked: boolean,
    className?: string,
    handleSelect,
    children?
}) {

    const id = "Checkbox" + props.id;
    const className = props.className ? "Checkbox " + props.className : "Checkbox";
    

    return (
        <div id={id} className={className} onClick={() => props.handleSelect(!props.checked)}>
            <label className={"checkboxLabel" + (props.checked ? " checkboxInputChecked" : "")} htmlFor={id}>
                <input id={"checkboxInput" + props.id}  
                       className="checkboxInput" 
                       type="checkbox"
                       readOnly
                       checked={props.checked} />

                <div className="checkboxChildren dontMarkText flexCenter">
                    {props.children}
                </div>
            </label>
        </div>
    )
}