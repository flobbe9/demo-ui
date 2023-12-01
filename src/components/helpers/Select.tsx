import React, { useEffect } from "react";
import "../../assets/styles/Select.css"
import { log } from "../../utils/Utils";


export default function Select(props: {
    id: string, 
    width: string,
    selectedValue: string,
    handleSelect?,
    className?: string,
    disabled?: boolean,
    children?
}) {

    const id = "Select" + props.id;
    const className = props.className ? "Select " + props.className : "Select";


    useEffect(() => {
        // set component width
        const thisSelect = $("#" + id);
        thisSelect.css("width", props.width)
        thisSelect.children(".selectOptionsBox").css("width", props.width);
    }, []);


    function toggleOptionsBox(): void {

        $("#" + id).children(".selectOptionsBox").slideToggle(100, "linear");
    }


    return (
        <div id={id} className={className + " dontHideSelect"}>
            <div className="selectBox flexLeft dontHideSelect" onClick={toggleOptionsBox}>
                {/* <option> somehow solves the overflow problem xd */}
                <option className="selectLabel dontMarkText dontHideSelect" title={props.selectedValue}>{props.selectedValue}</option>
                <img className="arrowDownIcon dontHideSelect dontMarkText" src="arrowDown.png" alt="arrow down" />
            </div>

            <div className="selectOptionsBox dontMarkText dontHideSelect">
                {props.children}
            </div>
        </div>
    )
}