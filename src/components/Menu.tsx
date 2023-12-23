import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Menu.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hidePopup, log, togglePopup } from "../utils/Utils";
import { AppContext } from "./App";
import Popup from "./helpers/popups/Popup";
import PopupNewDocument from "./helpers/popups/PopupNewDocument"; 


/**
 * Will be displayed at "/" root. Serves as start page.
 * 
 * @since 0.0.6
 */
export default function Menu(props) {

    const id = props.id ? "Menu" + props.id : "Menu";
    const className = props.className ? "Menu " + props.className : "Menu";

    const [savedDocuments, setSavedDocuments] = useState(initSavedDocuments());

    const appContext = useContext(AppContext);


    useEffect(() => {
        hidePopup(appContext.setPopupContent);

        $(".App").css("backgroundColor", "rgb(228, 228, 228)")
    }, []);


    // TODO: fetch saved documents from backend
    function initSavedDocuments(): React.JSX.Element[] {

        const temp1 = <div key={0} className="savedDocument">File 1</div>;
        const temp2 = <div key={1} className="savedDocument">File 2</div>;

        return [temp1, temp2];
    }


    function handleNewDocument(event: any): void {

        // define popup
        appContext.setPopupContent(
            <Popup width="large"
                    height="large">
                <PopupNewDocument />
            </Popup>
        );

        // toggle popup
        togglePopup(appContext.setPopupContent);
    }


    return (
        <div id={id} className={className}>
            <div className="leftSideBar">
                <button id="newDocumentButton" 
                        className="whiteButton whiteButtonPortrait newDocumentButton " 
                        onClick={handleNewDocument}>

                    <div className="">Neues Dokument</div>

                    <span className="" style={{fontSize: "30px"}}>+</span>
                </button>
            </div>

            <div className="rightSideBar">
                {savedDocuments}
                {/* <LoadingButton disabled={false} className="blackButton blackButtonOutlined navButton">
                    Registrieren
                </LoadingButton> */}
            </div>
        </div>
    )
}