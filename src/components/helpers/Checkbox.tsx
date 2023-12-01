import React, { useContext, useEffect, useRef, useState } from "react";
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
    disabled?: boolean,
    handleSelect,
    children?
}) {

    const id = "Checkbox" + props.id;
    const className = props.className ? "Checkbox " + props.className : "Checkbox";

    const [checked, setChecked] = useState(props.checked);
    const [disabled, setDisabled] = useState(props.disabled);

    const labelRef = useRef(null);

    const labelClassName = "checkboxLabel";
    const labelId = labelClassName + props.id;

    const checkedStyle:React.CSSProperties = {
        borderColor: "aqua"
    }
    

    useEffect(() => {
        initStyles();

    }, []);
    
    
    useEffect(() => {
        setChecked(props.checked);

        const label = $(labelRef.current!);
        if (props.checked)
            label.css("backgroundColor", props.checkedBackgroundColor || "");
        
        else 
            label.css("backgroundColor", props.backgroundColor || "");

    }, [props.checked]);


    useEffect(() => {
        setDisabled(props.disabled);

    }, [props.disabled]);


    function initStyles(): void {

        if (disabled)
            return;

        const label = $(labelRef.current!);

        label.css("color", props.color || "");
        label.css("backgroundColor", props.backgroundColor || "");
        label.css("border", props.border || "");
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
            label.css("backgroundColor", props.backgroundColor || "");
    }
    

    return (
        <div id={id} className={className} onClick={handleSelect}>
            <label id={labelId} 
                   className={labelClassName} 
                   ref={labelRef}
                   htmlFor={id} 
                   style={checked ? checkedStyle : {}}
                   onMouseOver={handleMouseOver}
                   onMouseOut={handleMouseOut}
                   >
                <input id={"checkboxInput" + props.id}  
                       className="checkboxInput" 
                       type="checkbox"
                       readOnly
                       checked={checked} 
                       disabled={disabled}/>

                <div className="checkboxChildren dontMarkText flexCenter">
                    {props.children}
                </div>
            </label>
        </div>
    )
}