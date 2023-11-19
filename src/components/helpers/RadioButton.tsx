import React from "react";
import "../../assets/styles/RadioButton.css";
import { log } from "../../utils/Utils";


export default function RadioButton(props: {
    id: string,
    name: string,
    handleSelect?: Function,
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


    /**
     * Check radio button and call ```props.handleSelect()``` callback.
     */
    function handleClick(event) {

        // select
        $("#" + id).children().find("input").prop("checked", true);

        // call handler
        if (props.handleSelect)
            props.handleSelect();

        // toggle style
        toggleRadioStyle();
    }


    function toggleRadioStyle(): void {

        // iterate all radio buttons
        Array.from($(".RadioButton")).forEach(radioButtonElement => {
            const radioButtonId = radioButtonElement.id;
            const radioButton = $("#" + radioButtonId);

            // case: this radio button
            if (id === radioButtonId)
                radioButton.children(".radioLabel").addClass("radioInputChecked");

            // case: any other radio button
            else 
                radioButton.children(".radioLabel").removeClass("radioInputChecked");
        })
    }


    return (
        <div id={id} className={className} onClick={handleClick} style={props.style}>
            <label className={labelClassName} htmlFor={props.name}>
                <input id={"radioInput" + props.id} 
                       className="radioInput " 
                       type="radio" 
                       name={props.name} 
                       />

                <div className={childrenClassName}>{props.children}</div>
            </label>
        </div>
    )
}