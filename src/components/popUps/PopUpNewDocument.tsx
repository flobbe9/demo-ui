import React, { useContext, useEffect, useState } from "react"; 
import "../../assets/styles/PopUpNewDocument.css";
import { AppContext } from "../../App";
import { Orientation } from "../../enums/Orientation";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hidePopUp, log } from "../../utils/Utils";
import { Link } from "react-router-dom";


export default function PopUpNewDocument(props) {

    const className = props.className ? "PopUpNewDocument " + props.classname : "PopUpNewDocument";
    const id = props.id ? "PopUpNewDocument " + props.id : "PopUpNewDocument";

    const [containerIndex, setContainerIndex] = useState(0);
    const [isContinue, setIsContinue] = useState(false);
    const [selectedOrientation, setSelectedOrientation] = useState(false);
    const [selectedNumColumns, setSelectedNumColumns] = useState(false);
    const [orientationClassName, setOrientationClassName] = useState("whiteButtonPortrait");

    const appContext = useContext(AppContext);


    useEffect(() => {
        if (containerIndex === 0) {
            if (selectedOrientation)
                setIsContinue(true);

            else 
                setIsContinue(false);
        
        } else if (containerIndex === 1) {
            if (selectedNumColumns)
                setIsContinue(true)

            else 
                setIsContinue(false);
        }
        
    }, [containerIndex, selectedOrientation, selectedNumColumns]);


    useEffect(() => {
        if (appContext.orientation === Orientation.PORTRAIT.toString())
            setOrientationClassName("whiteButtonPortrait")
        
        else    
            setOrientationClassName("whiteButtonLandscape");

    }, [appContext.orientation])


    /**
     * Toggle current and next container and update container index state.
     * 
     * @param prev if true move to previous container, else move to next one
     */
    function handleNextContainer(prev: boolean): void {

        const currentContainer = $(getContainerIdByIndex(containerIndex));

        const otherContainerClass = getContainerIdByIndex(prev ? containerIndex - 1 : containerIndex + 1);

        // case: no container in given direction
        if (otherContainerClass === "")
            return;

        const otherContainer = $(otherContainerClass);
    
        // toggle containers
        currentContainer.toggle();
        setTimeout(() => {
            otherContainer.toggle();
            otherContainer.css("display", "flex");
        }, 10);

        // update current index
        setContainerIndex(prev ? containerIndex - 1 : containerIndex + 1);
    }


    function getContainerIdByIndex(index: number): string {

        switch (index) {
            case 0: 
                return "#orientationContainer";
            
            case 1:
                return "#numColumnsContainer";

            default:
                return "";
        }
    }


    function handleSelectOrientation(orientation: Orientation): void {

        appContext.setOrientation(orientation);
        setSelectedOrientation(true);
    }


    function handleSelectNumColumns(numColumns: number): void {

        appContext.setNumColumns(numColumns);
        setSelectedNumColumns(true);
    }


    const nextButton = <button id="nextButton"
                                className={"slideButton slideLeftButton blackButton blackButtonContained buttonSmall" + (containerIndex === 1 ? " hidePopUp" : "")}// last container
                                onClick={() => handleNextContainer(false)}>
                            {/* last container */}
                            {containerIndex === 1 ? "Fertig" : "Weiter"}
                        </button>;


    return (
        <div id={id} className={className}> 
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp dontMarkText"/>
            </div>
            
            <div className="body flexCenter">
                <div id="orientationContainer" className="orientationContainer flexCenter dontMarkText">
                    <RadioButton id="Portrait"
                                 className="radioContainer" 
                                 labelClassName="whiteButton whiteButtonPortrait"
                                 name="Orientation" 
                                 value={Orientation.PORTRAIT}
                                 radioGroupValue={appContext.orientation}
                                 handleSelect={(value: Orientation) => handleSelectOrientation(value)}
                                 checkedBackgroundColor="rgb(230, 230, 230)"
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 >
                        Hoch-Format
                    </RadioButton>
                    
                    <RadioButton id="Landscape"
                                 className="radioContainer"
                                 labelClassName="whiteButton whiteButtonLandscape"
                                 name="Orientation"
                                 value={Orientation.LANDSCAPE}
                                 radioGroupValue={appContext.orientation}
                                 handleSelect={(value: Orientation) => handleSelectOrientation(value)}
                                 checkedBackgroundColor="rgb(230, 230, 230)"
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 >
                        Quer-Format
                    </RadioButton>
                </div>

                <div id="numColumnsContainer" className="numColumnsContainer flexCenter dontMarkText">
                    <div className="radioContainer">
                        <RadioButton id="OneColumn" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    name="NumColumns"
                                    value={1}
                                    radioGroupValue={appContext.numColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    checkedBackgroundColor="rgb(230, 230, 230)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                            <div style={{height: "100%"}}>Lorem ipsum</div>
                        </RadioButton>
                        <span>1 Spalte / Seite</span>
                    </div>

                    <div className="radioContainer">
                        <RadioButton id="TwoColumns" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    name="NumColumns"
                                    value={2}
                                    radioGroupValue={appContext.numColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    checkedBackgroundColor="rgb(230, 230, 230)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                            <div className="verticalBorderRightDotted" style={{width: "50%"}}>
                                Lorem ipsum
                            </div>
                            <div style={{width: "50%"}}></div>
                        </RadioButton>
                        <span>2 Spalten / Seite</span>
                    </div>

                    <div className="radioContainer">
                        <RadioButton id="ThreeColumns" 
                                    labelClassName={"whiteButton " + orientationClassName}
                                    name="NumColumns"
                                    value={3}
                                    radioGroupValue={appContext.numColumns}
                                    handleSelect={(value: number) => handleSelectNumColumns(value)}
                                    checkedBackgroundColor="rgb(230, 230, 230)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                            <div className="verticalBorderRightDotted" style={{width: "33%"}}>
                                Lorem ipsum
                            </div>
                            <div className="verticalBorderRightDotted" style={{width: "33%"}}></div>
                            <div style={{width: "33%"}}></div>
                        </RadioButton>
                        <span>3 Spalten / Seite</span>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="flexLeft">
                    <button id="prevButton"
                            className="slideButton slideRightButton blackButton blackButtonContained buttonSmall"
                            onClick={() => handleNextContainer(true)}
                            disabled={containerIndex === 0}>
                        Zurück
                    </button>
                </div>

                <div className="flexRight">
                    {/* case: last container */}
                    {containerIndex === 1 ? 
                        <Link to="/build" className="whiteLink">{nextButton}</Link> : nextButton
                    }       
                </div>
            </div>
        </div>
    )
}