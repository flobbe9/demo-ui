import React from "react";
import "../assets/styles/RadioButton.css";


export default function RadioButton(props: {
    id: string,
    name: string,
    handleSelect,
    className?: string,
    labelClassName?: string,
    children?,
    style?
}) {

    const id ="RadioButton" + props.id;
    const className = props.className ? "RadioButton " + props.className : "RadioButton";
    const labelClassName = props.labelClassName ? "radioLabel flexCenter " + props.labelClassName : "radioLabel flexCenter";


    /**
     * Check radio button and call ```props.handleSelect()``` callback.
     */
    function handleClick(event) {

        $("#" + id).children().find("input").prop("checked", true);

        props.handleSelect();
    }


    return (
        <div id={id} className={className} onClick={handleClick} style={props.style}>
            <label className={labelClassName} htmlFor={props.name}>
                <input id={"radioInput" + props.id} 
                       className="radioInput " 
                       type="radio" 
                       name={props.name} />

                <div className="radioChildren flexCenter">{props.children}</div>
            </label>
        </div>
    )
}