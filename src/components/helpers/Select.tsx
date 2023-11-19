import React, { useEffect, useState } from "react";
import "../../assets/styles/Select.css"
import { log } from "../../utils/Utils";


export default function Select(props: {
    width: string,
    handleSelect?,
    id: string, 
    className?: string,
    children?
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";

    const [selectedOption, setSelectedOption] = useState("");


    useEffect(() => {
        // set component width
        document.documentElement.style.setProperty("--selectWidth", props.width);

        initOptions();
    }, [])


    /**
     * Add class and event listener for all ```<option>``` elements. Use first ```<option>``` element in array
     * as default. 
     */
    function initOptions(): void {

        Array.from($("#" + id).children(".selectOptionsBox")
                              .find("option"))
                              .forEach((option, i) => {
                                // dontHideSelect
                                if (!option.className.includes("dontHideSelect"))
                                    option.className += " dontHideSelect"

                                // onclick
                                option.onclick = () => handleClickOption(option);

                                // set default
                                if (i === 0) 
                                    setSelectedOption(option.value)
                              });
    }


    function handleClickOption(option: HTMLOptionElement): void {

        // update label
        setSelectedOption(option.value);

        // handle select
        if (props.handleSelect)
            props.handleSelect(selectedOption);
        
        // hide options
        toggleOptionsBox();
    }


    function toggleOptionsBox(): void {

        $("#" + id).children(".selectOptionsBox").slideToggle(100, "linear");
    }


    return (
        <div id={id} className={className + " dontHideSelect"}>
            <div className="selectBox flexLeft dontHideSelect" onClick={toggleOptionsBox}>
                <span className="selectLabel dontMarkText dontHideSelect">{selectedOption}</span>
                <img className="arrowDownIcon dontHideSelect" src="arrowDown.png" alt="arrow down" />
            </div>

            <div className="selectOptionsBox dontMarkText dontHideSelect">
                {props.children}
            </div>
        </div>
    )
}