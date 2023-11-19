import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/Select.css"
import { log } from "../../utils/Utils";


export default function Select(props: {
    id: string, 
    width: string,
    handleSelect?,
    className?: string,
    children?
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";

    const [selectedOption, setSelectedOption] = useState("");



    useEffect(() => {
        // set component width
        const thisSelect = $("#" + id);
        thisSelect.css("width", props.width)
        thisSelect.children(".selectOptionsBox").css("width", props.width)

        initOptions();
    }, []);


    /**
     * Add class and event listener for all ```<option>``` elements. Use first ```<option>``` element in array
     * as default. 
     */
    function initOptions(): void {

        Array.from($("#" + id).children(".selectOptionsBox")
                              .find("option"))
                              .forEach((option, i) => {
                                // option title
                                option.title = option.value;

                                // handle click
                                option.onclick = () => handleClickOption(option.value);

                                // set default
                                if (i === 0) 
                                    setSelectedOption(option.value)
                              });
    }


    function handleClickOption(value: string): void {

        // update label
        setSelectedOption(value);
    }


    function toggleOptionsBox(): void {

        $("#" + id).children(".selectOptionsBox").slideToggle(100, "linear");
    }


    return (
        <div id={id} className={className + " dontHideSelect"}>
            <div className="selectBox flexLeft dontHideSelect" onClick={toggleOptionsBox}>
                {/* <option> somehow solves the overflow problem xd */}
                <option className="selectLabel dontMarkText dontHideSelect" title={selectedOption}>{selectedOption}</option>
                <img className="arrowDownIcon dontHideSelect dontMarkText" src="arrowDown.png" alt="arrow down" />
            </div>

            <div className="selectOptionsBox dontMarkText dontHideSelect">
                {props.children}
            </div>
        </div>
    )
}