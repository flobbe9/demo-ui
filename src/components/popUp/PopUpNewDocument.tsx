import React, { useContext, useEffect, useState } from "react"; 
import "../../assets/styles/PopUpNewDocument.css";
import { AppContext } from "../../App";
import { Orientation } from "../../enums/Orientation";
import { log } from "../../utils/Utils";


export default function PopUpNewDocument(props) {

    const className = props.className ? "PopUpNewDocument " + props.classname : "PopUpNewDocument";
    const id = props.id ? "PopUpNewDocument " + props.id : "PopUpNewDocument";

    const [containerIndex, setContainerIndex] = useState(0);

    const appContext = useContext(AppContext);


    useEffect(() => {
        checkSlideButtons();
        
    }, [containerIndex])


    function handleSlideRight(event) {

        const currentContainer = $(getContainerClassByIndex(containerIndex));

        const rightContainerClass = getContainerClassByIndex(containerIndex - 1);

        // case: no container to the right
        if (rightContainerClass === "")
            return;

        const rightContainer = $(rightContainerClass);

        // move center to right
        currentContainer.animate({right: 0}, {duration: 100, easing: "linear"});
        currentContainer.animate({width: "toggle"}, {duration: 50, easing: "linear"});

        // move left to center after first animation
        setTimeout(() => {
            rightContainer.animate({width: "toggle"}, {duration: 50, easing: "linear"});
            rightContainer.animate({left: "11vi"}, {duration: 100, easing: "linear"});
            rightContainer.css("display", "flex");
        }, 150);

        setContainerIndex(containerIndex - 1);
    }


    function handleSlideLeft(event) {

        const currentContainer = $(getContainerClassByIndex(containerIndex));

        const rightContainerClass = getContainerClassByIndex(containerIndex + 1);

        // case: no container to the right
        if (rightContainerClass === "")
            return;

        const rightContainer = $(rightContainerClass);

        // move center to left
        currentContainer.animate({left: 0}, {duration: 100, easing: "linear"});
        currentContainer.animate({width: "toggle"}, {duration: 50, easing: "linear"});

        // move right to center after first animation
        setTimeout(() => {
            rightContainer.animate({width: "toggle"}, {duration: 50, easing: "linear"});
            rightContainer.animate({right: "11vi"}, {duration: 100, easing: "linear"});
            rightContainer.css("display", "flex");
        }, 150);

        setContainerIndex(containerIndex + 1);
    }


    /**
     * Disable / enable slide buttons depending on the current ```containerIndex``` state.
     */
    function checkSlideButtons() {

        const slideLeftButton = $(".slideLeftButton");
        if (getContainerClassByIndex(containerIndex + 1) === "")  
            slideLeftButton.prop("disabled", true);
        
        else 
            slideLeftButton.prop("disabled", false);
        
        const slideRightButton = $(".slideRightButton");
        if (getContainerClassByIndex(containerIndex - 1) === "") 
            slideRightButton.prop("disabled", true);

        else
            slideRightButton.prop("disabled", false);
    }


    function getContainerClassByIndex(index: number): string {

        switch (index) {
            case 0: 
                return ".orientationContainer";
            
            case 1:
                return ".numColumnsContainer";

            default:
                return "";
        }
    }


    // make sub components for:
        // orientation
        // num Columns
        // colum type


    return (
        <div id={id} className={className + " dontHidePopUp"}> 
            <div className="body flexCenter dontHidePopUp">
                <button onClick={handleSlideRight} className="slideButton slideRightButton dontHidePopUp">
                    <img src="arrowLeft.png" alt="arrow right" className="smallIconButton dontHidePopUp"/>
                </button>

                <div className="orientationContainer flexCenter dontHidePopUp">
                    {/* TODO: make these radio buttons :P */}
                    <button className="whiteButton whiteButtonPortrait dontHidePopUp"
                            onClick={() => appContext.setOrientation(Orientation.PORTRAIT)}>
                        Hoch-Format
                    </button>

                    <button className="whiteButton whiteButtonLandscape dontHidePopUp"
                            onClick={() => appContext.setOrientation(Orientation.LANDSCAPE)}>
                        Quer-Format
                    </button>
                </div>

                <div className="numColumnsContainer flexCenter dontHidePopUp">
                    <button className="whiteButton whiteButtonPortrait dontHidePopUp"
                            onClick={() => appContext.setOrientation(Orientation.PORTRAIT)}>
                        Hoch-Format
                    </button>

                    <button className="whiteButton whiteButtonLandscape dontHidePopUp"
                            onClick={() => appContext.setOrientation(Orientation.LANDSCAPE)}>
                        Quer-Format
                    </button>
                </div>

                <button onClick={handleSlideLeft} className="slideButton slideLeftButton dontHidePopUp">
                    <img src="arrowRight.png" alt="arrow right" className="smallIconButton dontHidePopUp"/>
                </button>
            </div>
        </div>
    )
}