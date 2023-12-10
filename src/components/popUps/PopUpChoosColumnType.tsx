import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopUpChooseColumnType.css";
import RadioButton from "../helpers/RadioButton";
import { AppContext } from "../../App";
import { ColumnContext } from "../document/Column";
import { getCSSValueAsNumber, hidePopUp, log } from "../../utils/Utils";
import Select from "../helpers/Select";


export default function PopUpChooseColumnType(props:{
    handleSelect,
    columnType: number,
    handleSubmit,
    id?,
    className?,
    style?
}) {

    // state columns
    const id = props.id ? "PopUpChooseColumnType" + props.id : "PopUpChooseColumnType";
    const className = props.className ? "PopUpChooseColumnType " + props.className : "PopUpChooseColumnType";

    const appContext = useContext(AppContext);
    const columnContext = useContext(ColumnContext);
    
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "whiteButtonPortrait" : "whiteButtonLandscape");
    const [columnType, setColumnType] = useState(props.columnType);

    const [fontSizeHeading, setFontSizeHeading] = useState("14px");


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [])


    function handleSelect(columnType: number): void {
        
        setColumnType(columnType);
        props.handleSelect(columnType);
    }


    function handleKeyDown(event): void {

        if (event.key === "Enter") {
            props.handleSubmit();
            hidePopUp(appContext.setPopupContent);
        }
    }

    
    function handleFontSizeSelect(fontSize: number): void {

        appContext.selectedTextInputStyle.fontSize = fontSize;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }

    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp dontMarkText"/>
            </div>

            <div className="body">
                <h2 className="textCenter">Spalte</h2><br />

                <div className="radioContainer textCenter">
                    {/* <div>
                        <h5>Textgröße</h5>
                        <Select id={"HeadingFontSize"} 
                                value={getCSSValueAsNumber(fontSizeHeading, 2).toString()}
                                className="flexCenter mb-5"
                                >
                            <option value="10px" onClick={() => setFontSizeHeading("10px")}>10</option>
                            <option value="11px" onClick={() => setFontSizeHeading("11px")}>11</option>
                            <option value="12px" onClick={() => setFontSizeHeading("12px")}>12</option>
                            <option value="14px" onClick={() => setFontSizeHeading("14px")}>14</option>
                            <option value="16px" onClick={() => setFontSizeHeading("16px")}>16</option>
                            <option value="18px" onClick={() => setFontSizeHeading("18px")}>18</option>
                            <option value="20px" onClick={() => setFontSizeHeading("20px")}>20</option>
                        </Select>
                    </div> */}

                    <div>
                        <h5>Überschrift</h5>
                        <div className="flexLeft">
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
                                            childrenStyle={{
                                                alignItems: "start",
                                                fontSize: fontSizeHeading
                                            }}
                                            >
                                <div className="textCenter">
                                    <p style={{fontSize: "20px"}}>Überschrift 1</p>
                                    <p>...</p>
                                    <p>...</p>
                                </div>
                            </RadioButton>
                            <Select id={"HeadingFontSize"} 
                                    label={getCSSValueAsNumber(fontSizeHeading, 2).toString()}
                                    className="flexCenter mb-5"
                                    >
                                <option value="10px" onClick={() => setFontSizeHeading("10px")}>10</option>
                                <option value="11px" onClick={() => setFontSizeHeading("11px")}>11</option>
                                <option value="12px" onClick={() => setFontSizeHeading("12px")}>12</option>
                                <option value="14px" onClick={() => setFontSizeHeading("14px")}>14</option>
                                <option value="16px" onClick={() => setFontSizeHeading("16px")}>16</option>
                                <option value="18px" onClick={() => setFontSizeHeading("18px")}>18</option>
                                <option value="20px" onClick={() => setFontSizeHeading("20px")}>20</option>
                            </Select>
                        </div>

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
                                                fontSize: fontSizeHeading
                                            }}
                                            >
                                <div className="textCenter">
                                    <p style={{fontSize: "20px"}}>Überschrift 1</p>
                                    <p style={{fontSize: "16px"}}>Überschrift 2</p>
                                    <p>...</p>
                                    <p>...</p>
                                </div>
                            </RadioButton>
                        </div>

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
                                            alignItems: "start",
                                            fontSize: fontSizeHeading
                                        }}
                                        >
                            <div className="textCenter">
                                <p style={{fontSize: "20px"}}>Überschrift 1</p>
                                <p style={{fontSize: "16px"}}>Überschrift 2</p>
                                <p style={{fontSize: "12px"}}>Überschrift 3</p>
                                <p>...</p>
                            </div>
                        </RadioButton>
                    </div>
                </div>
            </div>

            {/* TODO: focus on submit */}
            <div className="footer flexRight">
                <button className="blackButton blackButtonContained buttonMedium hidePopUp"
                        onClick={props.handleSubmit}>
                    OK
                </button>
            </div>
        </div>
    )
}