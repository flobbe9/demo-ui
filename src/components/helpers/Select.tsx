import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";
import { AppContext } from "../../App";


export default function Select(props: {
    id: string, 
    label: string,
    handleSelect,
    
    hoverBackgroundColor?: string,
    
    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    optionsBoxStyle?: React.CSSProperties,
    
    className?: string,
    disabled?: boolean,
    children?,
    title?: string
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";

    const [disabled, setDisabled] = useState(props.disabled);

    const componentRef = useRef(null);
    const boxRef = useRef(null);
    const optionsBoxRef = useRef(null);

    const appContext = useContext(AppContext);


    useEffect(() => {
        // place optionsBox exactly below selectBox and use same dimensions
        $(optionsBoxRef.current!).css("top", $(boxRef.current!).css("height"));
        $(optionsBoxRef.current!).css("width", $(boxRef.current!).css("width"));

        initOptionTags();
    }, []);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);


    }, [props.disabled]);


    /**
     * Set initial properties for option tags inside selectOptionsBox.
     */
    function initOptionTags(): void {

        // iterate option tags in options box
        Array.from($(optionsBoxRef.current!).find("option"))
            .forEach(optionTag => {
                // add select handler
                optionTag.addEventListener("click", () => props.handleSelect(optionTag.value));
                // add title
                optionTag.title = props.label;
        });
    }


    function handleDisabledChange(disabled: boolean): void {

        if (disabled) {
            $(boxRef.current!).css("cursor", "inherit");
            $(boxRef.current!).css("opacity", 0.5);

        } else {
            $(boxRef.current!).css("cursor", "pointer");
            $(boxRef.current!).css("opacity", 1);
        }
    }


    function handleClick(event): void {

        toggleOptionsBox();

        appContext.focusSelectedTextInput();
    }


    function toggleOptionsBox(): void {

        if (disabled)
            return;

        $(optionsBoxRef.current!).slideToggle(100, "linear");
    }
    

    function handleMouseOver(): void {

        if (disabled)
            return;

        $(boxRef.current!).css("backgroundColor", props.hoverBackgroundColor || "");
    }


    function handleMouseOut(): void {

        $(boxRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }

    
    return (
        <div id={id} 
             className={className} 
             ref={componentRef} 
             style={props.componentStyle}
             title={props.title}
             >
            <div className="selectBox flexLeft dontHideSelect" 
                 ref={boxRef} 
                 style={props.boxStyle}
                 onClick={handleClick}
                 onMouseOver={handleMouseOver}
                 onMouseOut={handleMouseOut}
                 >
                {/* <option> somehow solves the overflow problem xd */}
                <option className="selectLabel dontMarkText dontHideSelect" title={props.label}>{props.label}</option>
                <img className="arrowDownIcon dontHideSelect dontMarkText" src="arrowDown.png" alt="arrow down" />
            </div>

            <div id={"selectOptionsBox" + props.id} className="selectOptionsBox dontMarkText dontHideSelect" ref={optionsBoxRef} style={props.optionsBoxStyle}>
                {props.children}
            </div>
        </div>
    )
}