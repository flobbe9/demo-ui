import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../../utils/Utils";
import { AppContext } from "../../App";
import { isMobileWidth } from "../../utils/GlobalVariables";


export default function Select(props: {
    id: string, 
    label: string,
    /** the value prop of the selected <option /> tag will be passed as param */
    handleSelect: (value: any) => void, 
    /** [option value, option label] */
    options: [string, string][],
    
    hoverBackgroundColor?: string,
    
    componentStyle?: React.CSSProperties,
    boxStyle?: React.CSSProperties,
    optionsBoxStyle?: React.CSSProperties,
    
    className?: string,
    disabled?: boolean,
    children?: React.JSX.Element[],
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
        if (isMobileWidth())
            $(boxRef.current!).css("width", "100%");
    
        // place optionsBox exactly below selectBox and use same dimensions
        $(optionsBoxRef.current!).css("top", $(boxRef.current!).css("height"));
        $(optionsBoxRef.current!).css("width", $(boxRef.current!).css("width"));

    }, []);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);

    }, [props.disabled]);


    function handleDisabledChange(disabled: boolean): void {

        if (disabled) {
            $(componentRef.current!).addClass("disabled");
            $(boxRef.current!).addClass("disabled");

        } else {
            $(componentRef.current!).removeClass("disabled");
            $(boxRef.current!).removeClass("disabled");
        }
    }


    function handleClick(event): void {

        toggleOptionsBox();
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

            {/* selected option box */}
            <div className="selectBox flexLeft dontHideSelect" 
                 ref={boxRef} 
                 style={props.boxStyle}
                 onClick={handleClick}
                 onMouseOver={handleMouseOver}
                 onMouseOut={handleMouseOut}
                 >
                {/* <option> somehow solves the overflow problem xd */}
                <div className="selectLabel dontMarkText dontHideSelect" title={props.label}>{props.label}</div>
                <i className="fa-solid fa-chevron-down dontHideSelect dontMarkText"></i>
            </div>

            {/* all options box */}
            <div id={"selectOptionsBox" + props.id} 
                 className="selectOptionsBox dontMarkText dontHideSelect" 
                 ref={optionsBoxRef} 
                 style={props.optionsBoxStyle}
                 >
                {// map options 
                    Array.from(props.options).map(([value, label], i) => {
                        return <option  key={i}
                                        value={value}
                                        title={label}
                                        onClick={() => props.handleSelect(value)}
                                        >
                                    {label}
                                </option>
                    })
                }
            </div>
        </div>
    )
}