import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";
import { AppContext } from "../../App";


export default function Select(props: {
    id: string, 
    selectedValue: string,

    hoverBackgroundColor?: string,

    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    optionsBoxStyle?: React.CSSProperties,

    handleSelect?,
    className?: string,
    disabled?: boolean,
    children?
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";

    const [disabled, setDisabled] = useState(props.disabled);

    const componentRef = useRef(null);
    const boxRef = useRef(null);
    const optionsBoxRef = useRef(null);

    const appContext = useContext(AppContext);


    useEffect(() => {
        setDisabled(props.disabled);

    }, [props.disabled]);


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

    // TODO: first option has blind spot on hover
    return (
        <div id={id} 
             className={className + " dontHideSelect"} 
             ref={componentRef} 
             style={props.componentStyle}
             >
            <div className="selectBox flexLeft dontHideSelect" 
                 ref={boxRef} 
                 style={props.boxStyle}
                 onClick={handleClick}
                 onMouseOver={handleMouseOver}
                 onMouseOut={handleMouseOut}
                 >
                {/* <option> somehow solves the overflow problem xd */}
                <option className="selectLabel dontMarkText dontHideSelect" title={props.selectedValue}>{props.selectedValue}</option>
                <img className="arrowDownIcon dontHideSelect dontMarkText" src="arrowDown.png" alt="arrow down" />
            </div>

            <div className="selectOptionsBox dontMarkText dontHideSelect" ref={optionsBoxRef} style={props.optionsBoxStyle}>
                {props.children}
            </div>
        </div>
    )
}