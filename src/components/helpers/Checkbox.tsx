import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/Checkbox.css"


// TODO: test
export default function Checkbox(props: {
    id: string, 
    checked: boolean,

    color?: string,
    backgroundColor?: string,
    hoverBackgroundColor?: string,
    checkedBackgroundColor?: string,
    border?: string,

    className?: string,
    handleSelect,
    children?
}) {

    const id = "Checkbox" + props.id;
    const className = props.className ? "Checkbox " + props.className : "Checkbox";

    const [checked, setChecked] = useState(props.checked)

    const labelClassName = "checkboxLabel";
    const labelId = labelClassName + props.id;

    const checkedStyle:React.CSSProperties = {
        borderColor: "aqua"
    }
    

    useEffect(() => {
        const label = $("#" + labelId);;

        label.css("color", props.color || "");
        label.css("backgroundColor", props.backgroundColor || "");
        label.css("border", props.border || "");
        
    }, []);
    
    
    useEffect(() => {
        setChecked(props.checked);

        const label = $("#" + labelId);
        if (props.checked)
            label.css("backgroundColor", props.checkedBackgroundColor || "");
        
        else 
            label.css("backgroundColor", props.backgroundColor || "");

    }, [props.checked]);


    function handleMouseOver(): void {

        if (!checked)
            $("#" + labelId).css("backgroundColor", props.hoverBackgroundColor || "");
    }

    function handleMouseOut(): void {

        if (!checked)
            $("#" + labelId).css("backgroundColor", props.backgroundColor || "");
    }
    

    return (
        <div id={id} className={className} onClick={() => props.handleSelect(!checked)}>
            <label id={labelId} 
                   className={labelClassName} 
                   htmlFor={id} 
                   style={checked ? checkedStyle : {}}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}
                   >
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