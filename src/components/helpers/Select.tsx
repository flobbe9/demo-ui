import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { equalsIgnoreCase, flashClass, flashCss, getJQueryElementById, includesIgnoreCase, isBlank, isKeyAlphaNumeric, isNumberFalsy, log, logWarn, matchesAll, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { AppContext } from "../App";
import { MAX_FONT_SIZE, MIN_FONT_SIZE, isMobileWidth } from "../../globalVariables";
import { getBrowserFontSizeByMSWordFontSize, getCSSValueAsNumber, getMSWordFontSizeByBrowserFontSize } from "../../utils/documentBuilderUtils";
import { DocumentContext } from "../document/Document";


/**
 * Custom select input. Styleable through props.
 * Pass select options as 2D array formatted like ```[value, label]``` where ```value``` will be passed inside the 
 * select handler and ```label``` will be displayed as select option.
 * 
 * @since 0.0.5
 */
export default function Select(props: {
    id: string, 
    label: string,
    /** the value prop of the selected <option /> tag will be passed as param */
    handleSelect: (value: any) => void, 
    /** [option value, option label] */
    options: [string, any][],
    
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

    // this is quite risky, change this if necessary
    const [isFontSize, setIsFontSize] = useState(includesIgnoreCase(id, "fontsize"))

    const componentRef = useRef(null);
    const boxRef = useRef(null);
    const labelRef = useRef(null);
    const optionsBoxRef = useRef(null);

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    useEffect(() => {
        setCssVariable("selectBackgroundColor", props.boxStyle?.backgroundColor || "white");

    }, [])

    useEffect(() => {
        if (appContext.isMobileView)
            $(boxRef.current!).css("width", "100%");
    
        // place optionsBox exactly below selectBox and use same dimensions
        $(optionsBoxRef.current!).css("top", $(boxRef.current!).css("height"));
        $(optionsBoxRef.current!).css("width", $(boxRef.current!).css("width"));

    }, [appContext.windowSize]);


    useEffect(() => {
        setDisabled(props.disabled);

        handleDisabledChange(props.disabled!);

    }, [props.disabled]);


    useEffect(() => {
        setSelectLabel(props.label);
        
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


    function handleSelect(event, value: string, label: string | number): void {

        value = isFontSize ? getBrowserFontSizeByMSWordFontSize(getCSSValueAsNumber(value, 2)).toString() : getOptionsBoxValueByLabel(value, true);
        props.handleSelect(value);
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
        $(labelRef.current!).css("backgroundColor", "white");
    }


    function handleBoxMouseOut(): void {

        $(boxRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "");
        $(labelRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "");
    }


    function setSelectLabel(label: string | number): void {

        if (isFontSize) {
            $(labelRef.current!).prop("value", getMSWordFontSize(label));
            return;
        }
        
        $(labelRef.current!).prop("value", label);
    }


    function handleLabelKeyUp(event): void {

        if (event.key === "Enter")
            documentContext.hideSelectOptions();
        
        const inputValue = $(labelRef.current!).prop("value");

        let isValid = true;
        
        // edge case: font size
        if (isFontSize) {
            isValid = isFontSizeValid(inputValue);

        } else
            isValid = validateLabelInput(inputValue, !isFontSize);

        if (isValid) {
            // select
            handleSelect(event, isFontSize ? inputValue + "px" : inputValue, inputValue);

            // refocus on select input
            if (isKeyAlphaNumeric(event.keyCode) || event.key === "Shift" || event.key === "CapsLock") 
                setTimeout(() => $(labelRef.current!).trigger("focus"), 50)
        }
    }


    /**
     * @param label in selectLabel box to validate
     * @param checkIsInOptionsList if true, the label will be searched in ```props.options``` (ignoring the case)
     * @returns true if pattern matches and label exists in options list (the latter check can be disabled)
     */
    function validateLabelInput(label: string | number, checkIsInOptionsList = true): boolean {

        // map labels
        const optionLabels: string[] = props.options.map(option => option[1].trim().toLowerCase());

        // label is in options list
        const labelExistsInList = checkIsInOptionsList ? includesIgnoreCase(optionLabels, label) : true;

        // matches pattern completely
        const labelMatchesPattern = props.pattern ? matchesAll(label.toString(), props.pattern) : true;

        return labelExistsInList && labelMatchesPattern;
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
     * @returns true if ```validateLabelInput(fontSize, false)``` is true and fontSize is in bounds of {@link MIN_FONT_SIZE} and {@link MAX_FONT_SIZE}
     */
    function isFontSizeValid(fontSize: string | number): boolean {

        return validateLabelInput(fontSize, false) &&
               stringToNumber(fontSize) >= MIN_FONT_SIZE && 
               stringToNumber(fontSize) <= MAX_FONT_SIZE;
    }


    /**
     * Adds a certain value to given fontSize in order to display the fontSize almost like in MS Word.
     * 
     * @param browserFontSize to get the msWord fontSize of (is not altered)
     * @returns the given font size plus {@link getFontSizeDiffInWord()} or the browser fontSize, if state 
     *          ```isFontSize``` is false or ```browserFontSize``` is NaN
     * @see getFontSizeDiffInWord
     */
    function getMSWordFontSize(browserFontSize: string | number): number | string {

        if (!isFontSize)
            return browserFontSize;

        const browserFontSizeNumber = getCSSValueAsNumber(browserFontSize, 2);
        if (isNaN(browserFontSizeNumber)) {
            logWarn("'getMSWordFontSize()' failed. 'browserFontSizeNumber' is NaN. 'fontSize': " + browserFontSize);
            return browserFontSize;
        }

        const msWordFontSize = getMSWordFontSizeByBrowserFontSize(browserFontSizeNumber);

        return msWordFontSize;
    }

    
    return (
        <div id={id} 
             className={className} 
             ref={componentRef} 
             style={props.componentStyle}
             title={props.title}
             >

            {/* selected option box */}
            <div id={"selectBox" + props.id}
                 className="selectBox flexLeft dontHideSelect" 
                 ref={boxRef} 
                 style={props.boxStyle}
                 onClick={handleClick}
                 onMouseOver={handleBoxMouseOver}
                 onMouseOut={handleBoxMouseOut}
                 >
                <input id={"selectTextInput" + props.id}
                       className="selectLabel dontMarkText dontHideSelect" 
                       ref={labelRef}
                       title={isFontSize ? getMSWordFontSize(props.label).toString() : props.label}
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
                                        // has only an effect in case of fontFamily select
                                        style={{fontFamily: value}}
                                        >
                                    {label}
                                </option>
                    })
                }
            </div>
        </div>
    )
}