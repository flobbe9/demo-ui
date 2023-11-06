import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopUpChooseColumnType.css";
import RadioButton from "../RadioButton";
import { AppContext } from "../../App";


export default function PopUpChooseColumnType(props: {
    handleSelect,
    id?,
    className?,
    style?
}) {

    // state columns
    const id = props.id ? "PopUpChooseColumnType" + props.id : "PopUpChooseColumnType";
    const className = props.className ? "PopUpChooseColumnType " + props.className : "PopUpChooseColumnType";

    const appContext = useContext(AppContext);
    
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "whiteButtonPortrait" : "hiteButtonLandscape");


    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp"/>
            </div>

            <div className="body">
                <span className="flexCenter popUpHeading">Spalten Muster</span>
                <br />

                {/* TODO: make these components */}
                {/* TODO: simplify box model */}
                <div className="radioContainer flexCenter">
                    <RadioButton id={"Type1"} 
                                 className="flexCenter"
                                 labelClassName={"whiteButton " + orientationClassName}
                                 name={"ColumnType"} 
                                 handleSelect={props.handleSelect}>
                        <div className="mockColumn">
                            Lorem ipsum <br />
                            dolor sit <br />
                            amet consectetur <br />
                            adipisicing elit. <br />
                            Maxime mollitia <br />
                            ...
                        </div>
                    </RadioButton>
                </div>

                <div className="radioContainer flexCenter">
                    <RadioButton id={"Type2"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    name={"ColumnType"} 
                                    handleSelect={props.handleSelect}>
                        <div className="mockColumn">
                            Lorem ipsum <br />
                            dolor sit <br />
                            amet consectetur <br />
                            adipisicing elit. <br />
                            Maxime mollitia <br />
                            ...
                        </div>
                    </RadioButton>
                </div>

            </div>

            <div className="footer flexRight">
                <button id="prevButton"
                        className="slideButton slideRightButton blackButton blackButtonContained buttonSmall hidePopUp"
                        onClick={props.handleSelect}>
                    OK
                </button>
            </div>
        </div>
    )
}