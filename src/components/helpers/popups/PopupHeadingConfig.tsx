import React, { useContext, useEffect, useState } from "react";
import "../../../assets/styles/PopupHeadingConfig.css";
import { AppContext } from "../../../App";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCSSValueAsNumber, getPartFromDocumentId, hidePopup, isBlank, log, stringToNumber } from "../../../utils/Utils";
import Select from "../../helpers/Select";
import { FONT_SIZES } from "../../../utils/GlobalVariables";


export default function PopupHeadingConfig(props:{
    handleSubmit?,
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = props.id ? "PopupHeadingConfig" + props.id : "PopupHeadingConfig";
    const className = props.className ? "PopupHeadingConfig " + props.className : "PopupHeadingConfig";

    const appContext = useContext(AppContext);
    
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(-1);
    

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

            hidePopup(appContext.setPopupContent);
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
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopup dontMarkText"/>
            </div>

            <div className="body textCenter">
                <h2 className="textCenter">Spalte {selectedColumnIndex + 1}</h2><br />

                {/* heading 1 */}
                <div className="headingContainer flexCenter mb-3">
                    <div className="heading heading1" 
                         style={{
                            fontSize: appContext.columnHeading1FontSize || appContext.columnFontSize
                        }}
                    >
                        Überschrift 1
                    </div>

                    <Select id={"Heading1FontSize"}
                            label={getCSSValueAsNumber(appContext.columnHeading1FontSize || appContext.columnFontSize, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
                            handleSelect={appContext.setColumnHeading1FontSize}
                            optionsBoxStyle={{maxHeight: "30vb"}}
                            options={FONT_SIZES.map(fontSize => [fontSize + "px", fontSize.toString()])}
                            />
                </div>

                {/* heading 2 */}
                <div className="headingContainer flexCenter mb-3">
                    <div className="heading heading1" 
                         style={{
                            fontSize: appContext.columnHeading2FontSize || appContext.columnFontSize
                        }}
                    >
                        Überschrift 2
                    </div>

                    <Select id={"Heading2FontSize"}
                            label={getCSSValueAsNumber(appContext.columnHeading2FontSize || appContext.columnFontSize, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
                            handleSelect={appContext.setColumnHeading2FontSize}
                            optionsBoxStyle={{maxHeight: "30vb"}}
                            options={FONT_SIZES.map(fontSize => [fontSize + "px", fontSize.toString()])}
                    />
                </div>

                {/* heading 3 */}
                <div className="headingContainer flexCenter">
                    <div className="heading heading1" style={{
                        fontSize: appContext.columnHeading3FontSize || appContext.columnFontSize
                    }}>
                        Überschrift 3   
                    </div>

                    <Select id={"Heading3FontSize"}
                            label={getCSSValueAsNumber(appContext.columnHeading3FontSize || appContext.columnFontSize, 2).toString()}
                            className="flexCenter"
                            componentStyle={{width: "30%"}} 
                            handleSelect={appContext.setColumnHeading3FontSize}
                            optionsBoxStyle={{maxHeight: "30vb"}}
                            options={FONT_SIZES.map(fontSize => [fontSize + "px", fontSize.toString()])}
                    />
                </div>

            </div>


            <div className="footer flexRight">
                <button className="blackButton blackButtonContained buttonMedium hidePopup"
                        onClick={handleSubmit}>
                    OK
                </button>
            </div>
        </div>
    )
}