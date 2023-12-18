import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopupHeadingConfig.css";
import { AppContext } from "../../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getPartFromDocumentId, hidePopUp, isBlank, log, stringToNumber } from "../../utils/Utils";
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
    
    const [fontSizeHeading1, setFontSizeHeading1] = useState(props.fontSizeHeading1);
    const [fontSizeHeading2, setFontSizeHeading2] = useState(props.fontSizeHeading2);
    const [fontSizeHeading3, setFontSizeHeading3] = useState(props.fontSizeHeading3);

    const [selectedColumnIndex, setSelectedColumnIndex] = useState(-1);


    useEffect(() => {
        props.setFontSizeHeading1(fontSizeHeading1);
        props.setFontSizeHeading2(fontSizeHeading2);
        props.setFontSizeHeading3(fontSizeHeading3);

    }, [fontSizeHeading1, fontSizeHeading2, fontSizeHeading3])


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        setSelectedColumnIndex(getSelectedColumnIndex());

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [])


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


    function getSelectedColumnIndex(): number {

        const columnId = appContext.getColumnIdByTextInputId(appContext.selectedTextInputId);
        if (isBlank(columnId))
            return -1;

        return stringToNumber(getPartFromDocumentId(columnId, 2));
    }

    
    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp dontMarkText"/>
            </div>

            <div className="body textCenter">
                <h2 className="textCenter">Spalte {selectedColumnIndex + 1}</h2><br />

                {/* heading 1 */}
                <div className="headingContainer flexCenter mb-3">
                    <div className="heading heading1" style={{
                        fontSize: fontSizeHeading1
                    }}>Überschrift 1</div>

                    <Select id={"Heading1FontSize"}
                            label={getCSSValueAsNumber(fontSizeHeading1, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
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

                {/* heading 2 */}
                <div className="headingContainer flexCenter mb-3">
                    <div className="heading heading1" style={{
                        fontSize: fontSizeHeading2
                    }}>Überschrift 2</div>

                    <Select id={"Heading2FontSize"}
                            label={getCSSValueAsNumber(fontSizeHeading2, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
                            handleSelect={setFontSizeHeading2}
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

                {/* heading 3 */}
                <div className="headingContainer flexCenter">
                    <div className="heading heading1" style={{
                        fontSize: fontSizeHeading3
                    }}>Überschrift 3</div>

                    <Select id={"Heading3FontSize"}
                            label={getCSSValueAsNumber(fontSizeHeading3, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
                            handleSelect={setFontSizeHeading3}
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