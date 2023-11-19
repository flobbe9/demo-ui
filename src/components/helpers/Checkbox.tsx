import React, { useEffect, useState } from "react";
import "../../assets/styles/Checkbox.css"


export default function Checkbox(props: {
    id: string, 
    className?: string,
    handleSelect?,
    children?
}) {

    const id = "Checkbox" + props.id;
    const className = props.className ? "Checkbox " + props.className : "Checkbox";
    
    const [checked, setChecked] = useState(false);


    useEffect(() => {
        toggleCheckboxStyle();
    }, [checked])

    
    /**
     * Check radio button and call ```props.handleSelect()``` callback.
     */
    function handleClick(event) {

        // toggle
        setChecked(!checked);

        // call handler
        if (props.handleSelect)
            props.handleSelect(!checked);
    }


    function toggleCheckboxStyle(): void {

        if (checked)
            $("#" + id).children(".checkboxLabel").addClass("checkboxInputChecked");

        else
            $("#" + id).children(".checkboxLabel").removeClass("checkboxInputChecked")
    }


    return (
        <div id={id} className={className} onClick={handleClick}>
            <label className="checkboxLabel" htmlFor={id}>
                <input id={"checkboxInput" + props.id}  
                       className="checkboxInput" 
                       type="checkbox"
                       readOnly
                       checked={checked} />

                <div className="checkboxChildren dontMarkText flexCenter">
                    {props.children}
                </div>
            </label>
        </div>
    )
}