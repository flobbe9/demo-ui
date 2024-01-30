import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/RadioButton.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equalsIgnoreCase, log } from "../../utils/basicUtils";


/**
 * Custom radio button. Stylable through components.
 * Wether a button is checked or not is determined by ```props.radioGroupValue === props.value``` where 
 * ```radioGroupValue``` is the value of the radio button currently selected and ```value``` is the value of this radio button.
 * 
 * @since 0.0.5
 */
export default function RadioButton(props: {
    id: string,
    name: string,
    value: any,
    radioGroupValue: any,
    handleSelect: Function,
    
    hoverBackgroundColor?: string,
    checkedStyle?: React.CSSProperties,

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

    const [checked, setChecked] = useState(equalsIgnoreCase(props.value, props.radioGroupValue));
    const [disabled, setDisabled] = useState(props.disabled);

    const boxRef = useRef(null);
    const inputRef = useRef(null);
    const childrenRef = useRef(null);


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
            $(boxRef.current!).addClass("disabled");
            $(childrenRef.current!).addClass("disabled");
            $(inputRef.current!).addClass("disabled");
            $(boxRef.current!).addClass("disabled");

        } else {
            $(boxRef.current!).removeClass("disabled");
            $(childrenRef.current!).removeClass("disabled");
            $(inputRef.current!).removeClass("disabled");
            $(boxRef.current!).removeClass("disabled");
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
                   htmlFor={"radioInput" + props.id}
                   style={checked ? {...props.boxStyle, ...props.checkedStyle} : props.boxStyle}
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
                       title={props.title}
                       checked={checked}
                       disabled={disabled}
                       readOnly
                       />

                <div className={childrenClassName} 
                     ref={childrenRef} 
                     style={props.childrenStyle}
                     title={props.title}
                     >
                    {props.children}
                </div>
            </label>
        </div>
    )
}