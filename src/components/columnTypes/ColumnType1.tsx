import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopUpChooseColumnType.css";
import RadioButton from "../RadioButton";
import { AppContext } from "../../App";


// TODO
export default function ColumnType1(props: {
    handleSelect,
    id?,
    className?,
    style?
}) {

    // state columns
    const id = props.id ? "ColumnType1" + props.id : "ColumnType1";
    const className = props.className ? "ColumnType1 " + props.className : "ColumnType1";

    const appContext = useContext(AppContext);
    
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "whiteButtonPortrait" : "hiteButtonLandscape");


    return (
        <RadioButton id={"Type1"} 
                        className="flexCenter"
                        labelClassName={"whiteButton " + orientationClassName}
                        name={"ColumnType"} 
                        handleSelect={props.handleSelect}>
            <div className="mockColumn">
                Lorem ipsum <br />
                dolor sit <br />
                amet consectetur <br />
            </div>
        </RadioButton>
    )
}