import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equalsIgnoreCase, isBlank, isKeyAlphaNumeric, log, matchesAll, stringToNumber } from "../../utils/Utils";
import { AppContext } from "../App";
import { FONT_SIZES, isMobileWidth } from "../../utils/GlobalVariables";


/**
 * Custom select input. Styleable through props.
 * Pass select options as 2D array formatted like ```[value, label]``` where ```value``` will be passed inside the 
 * select handler and ```label``` will be displayed as select option.
 * 
 * @since 0.0.5
 */
// TODO: make box an input
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
    title?: string,
    /** will be used for the input label */
    pattern?: RegExp,
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";

    const [disabled, setDisabled] = useState(props.disabled);

    const componentRef = useRef(null);
    const boxRef = useRef(null);
    const labelRef = useRef(null);
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


    useEffect(() => {
        setInputLabel(props.label);
        
    }, [props.label]);


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

        if (!event.target.className.includes("selectLabel"))
            toggleOptionsBox();
    }


    function handleSelect(event, value: string, label: string): void {

        props.handleSelect(value);

        setInputLabel(label);
    }


    function toggleOptionsBox(): void {

        if (disabled)
            return;

        $(optionsBoxRef.current!).slideToggle(100, "linear");
    }
    

    function handleBoxMouseOver(): void {

        if (disabled)
            return;

        $(boxRef.current!).css("backgroundColor", props.hoverBackgroundColor || "");
    }


    function handleBoxMouseOut(): void {

        $(boxRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    function setInputLabel(label: string): void {

        $(labelRef.current!).prop("value", label);
    }


    function handleLabelKeyUp(event): void {

        if (event.key === "Enter")
            appContext.hideSelectOptions();
        
        const newLabel = $(labelRef.current!).prop("value");

        const isFontSize = equalsIgnoreCase(id, "selectFontSize");

        // edge case: font size
        const isValid = isFontSize ? isFontSizeValid(newLabel) : validateLabelInput(newLabel, !isFontSize);
        
        // select if is valid
        if (isValid) {
            const value = isFontSize ? newLabel + "px" : getOptionsBoxValueByLabel(newLabel, true);
            handleSelect(event, value, newLabel);

            // refocus on select input
            if (isKeyAlphaNumeric(event.keyCode) || event.key === "Shift" || event.key === "CapsLock") 
                setTimeout(() => {
                    $(labelRef.current!).trigger("focus")
                }, 50)
        }
    }


    /**
     * @param label in selectLabel box to validate
     * @param checkIsInOptionsList if true, the label will be searched in ```props.options``` (ignoring the case)
     * @returns true if pattern matches and label exists in options list (the latter check can be disabled)
     */
    function validateLabelInput(label: string, checkIsInOptionsList = true): boolean {

        // map labels
        const optionLabels: string[] = props.options.map(option => option[1].trim().toLowerCase());

        // label is in options list
        const labelExistsInList = checkIsInOptionsList ? optionLabels.includes(label.trim().toLowerCase()) : true;

        // matches pattern completely
        const labelMatchesPattern = props.pattern ? matchesAll(label, props.pattern) : true;

        return labelExistsInList && labelMatchesPattern;
    }


    /**
     * @param value options box value (i.e. "16px")
     * @param ignoreCase if true, the case of the label will be ignored when searching, default is false
     * @returns matching label to given value (i.e. ```value = "16px" => "16"```)
     */
    function getOptionsBoxLabelByValue(value: string, ignoreCase = false): string {

        if (!value)
            return "";

        const results = props.options.find(([key, label]) => 
            ignoreCase ? equalsIgnoreCase(key, value) : key === value);

        return results ? results[0] : "";
    }


    /**
     * @param label options box label (i.e. "16")
     * @param ignoreCase if true, the case of the label will be ignored when searching, default is false
     * @returns matching value to given label (i.e. ```label = "16" => "16px"```)
     */
    function getOptionsBoxValueByLabel(label: string, ignoreCase = false): string {

        if (!label)
            return "";

        const results = props.options.find(([value, optionsLabel]) =>
            ignoreCase ? equalsIgnoreCase(optionsLabel, label) : optionsLabel === label);

        return results ? results[0] : "";
    }


    /**
     * @param fontSize to validate
     * @returns true if ```validateLabelInput(fontSize, false)``` is true and fontSize is in bounds of min and max values
     */
    function isFontSizeValid(fontSize: string): boolean {

        const minFontSize = FONT_SIZES[0];
        const maxFontSize = FONT_SIZES[FONT_SIZES.length - 1];

        return validateLabelInput(fontSize, false) &&
               stringToNumber(fontSize) >= minFontSize && 
               stringToNumber(fontSize) <= maxFontSize;
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
                 onMouseOver={handleBoxMouseOver}
                 onMouseOut={handleBoxMouseOut}
                 >
                {/* <option> somehow solves the overflow problem xd */}
                <input className="selectLabel dontMarkText dontHideSelect" 
                       ref={labelRef}
                       title={props.label}
                       defaultValue={props.label}
                       onKeyUp={handleLabelKeyUp}
                       />
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
                                        onClick={(event) => handleSelect(event, value, label)}
                                        >
                                    {label}
                                </option>
                    })
                }
            </div>
        </div>
    )
}