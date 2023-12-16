import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopupHeadingConfig.css";
import RadioButton from "../helpers/RadioButton";
import { AppContext } from "../../App";
import { ColumnContext } from "../document/Column";
import { getCSSValueAsNumber, hidePopUp, log } from "../../utils/Utils";
import Select from "../helpers/Select";


export default function PopupHeadingConfig(props:{
    handleSelect,
    fontSizeHeading1: string,
    fontSizeHeading2: string,
    fontSizeHeading3: string,
    setFontSizeHeading1: (str: string) => void,
    setFontSizeHeading2: (str: string) => void,
    setFontSizeHeading3: (str: string) => void,
    handleSubmit?,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = props.id ? "PopupHeadingConfig" + props.id : "PopupHeadingConfig";
    const className = props.className ? "PopupHeadingConfig " + props.className : "PopupHeadingConfig";

    const appContext = useContext(AppContext);
    
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "whiteButtonPortrait" : "whiteButtonLandscape");
    const [columnType, setColumnType] = useState(1);

    const [fontSizeHeading1, setFontSizeHeading1] = useState(props.fontSizeHeading1);
    const [fontSizeHeading2, setFontSizeHeading2] = useState(props.fontSizeHeading2);
    const [fontSizeHeading3, setFontSizeHeading3] = useState(props.fontSizeHeading3);

    useEffect(() => {
        props.setFontSizeHeading1(fontSizeHeading1);
        props.setFontSizeHeading2(fontSizeHeading2);
        props.setFontSizeHeading3(fontSizeHeading3);

    }, [fontSizeHeading1, fontSizeHeading2, fontSizeHeading3])


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [])


    function handleSelect(columnType: number): void {
        
        setColumnType(columnType);
        props.handleSelect(columnType);
    }


    function handleSubmit(event): void {

        if (props.handleSubmit)
            props.handleSubmit(event);

        appContext.focusSelectedTextInput();
    }


    function handleKeyDown(event): void {

        if (event.key === "Enter") {
            event.preventDefault();
            if (props.handleSubmit)
                props.handleSubmit();

            hidePopUp(appContext.setPopupContent);
        }
    }

    
    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp dontMarkText"/>
            </div>


            <div className="body">
                <h2 className="textCenter">Spalte</h2><br />

                <div className="radioContainer textCenter">
                    <h5>Überschrift</h5>

                    {/* 1 Heading */}
                    <div className="flexCenter align-items-start">
                        <RadioButton id={"1Heading"} 
                                        className="mb-3"
                                        labelClassName={"whiteButton " + orientationClassName}
                                        childrenClassName={"textLeft dontMarkText flexCenter"}
                                        name={"NumHeadings"} 
                                        value={1}
                                        radioGroupValue={columnType}
                                        handleSelect={handleSelect}
                                        checkedBackgroundColor="rgb(240, 240, 240)"
                                        hoverBackgroundColor="rgb(245, 245, 245)"
                                        componentStyle={{
                                            width: "50%"
                                        }}
                                        childrenStyle={{
                                            alignItems: "start"
                                        }}
                                        >
                            <div className="textCenter">
                                <p style={{fontSize: fontSizeHeading1}}>Überschrift 1</p>
                                <p>...</p>
                                <p>...</p>
                            </div>
                        </RadioButton>

                        <Select id={"HeadingFontSize"}
                                label={getCSSValueAsNumber(fontSizeHeading1, 2).toString()}
                                className="flexCenter mb-5 mt-2"
                                componentStyle={{width: "10%"}} 
                                handleSelect={setFontSizeHeading1}
                                options={[
                                    ["10px", "10"],
                                    ["11px", "11"],
                                    ["12px", "12"],
                                    ["14px", "14"],
                                    ["16px", "16"],
                                    ["18px", "18"],
                                    ["20px", "20"]
                                ]}
                                />
                    </div>

                    {/* 2 headings */}
                    <div className="flexLeft">
                        <RadioButton id={"2Heading"} 
                                        className="flexCenter mb-3"
                                        labelClassName={"whiteButton " + orientationClassName}
                                        childrenClassName={"textLeft dontMarkText flexCenter"}
                                        name={"NumHeadings"} 
                                        value={2}
                                        radioGroupValue={columnType}
                                        handleSelect={handleSelect}
                                        checkedBackgroundColor="rgb(240, 240, 240)"
                                        hoverBackgroundColor="rgb(245, 245, 245)"
                                        childrenStyle={{
                                            alignItems: "start",
                                        }}
                                        >
                            <div className="textCenter">
                                <p style={{fontSize: fontSizeHeading1}}>Überschrift 1</p>
                                <p style={{fontSize: fontSizeHeading2}}>Überschrift 2</p>
                                <p>...</p>
                                <p>...</p>
                            </div>
                        </RadioButton>
                    </div>

                    {/* 3 headings */}
                    <div>
                        <RadioButton id={"3Heading"} 
                                        className="flexCenter mb-3"
                                        labelClassName={"whiteButton " + orientationClassName}
                                        childrenClassName={"textLeft dontMarkText flexCenter"}
                                        name={"NumHeadings"} 
                                        value={3}
                                        radioGroupValue={columnType}
                                        handleSelect={handleSelect}
                                        checkedBackgroundColor="rgb(240, 240, 240)"
                                        hoverBackgroundColor="rgb(245, 245, 245)"
                                        childrenStyle={{
                                            alignItems: "start"
                                        }}
                                        >
                            <div className="textCenter">
                                <p style={{fontSize: fontSizeHeading1}}>Überschrift 1</p>
                                <p style={{fontSize: fontSizeHeading2}}>Überschrift 2</p>
                                <p style={{fontSize: fontSizeHeading3}}>Überschrift 3</p>
                                <p>...</p>
                            </div>
                        </RadioButton>
                    </div>
                </div>
            </div>


            <div className="footer flexRight">
                <button className="blackButton blackButtonContained buttonMedium hidePopUp"
                        onClick={handleSubmit}>
                    OK
                </button>
            </div>
        </div>
    )
}