import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Menu.css";
import { hidePopup, togglePopup } from "../utils/Utils";
import { AppContext } from "./App";
import Popup from "./helpers/popups/Popup";
import PopupNewDocument from "./helpers/popups/PopupNewDocument";
import Button from "./helpers/Button";

/**
 * Will be displayed at "/" root. Serves as start page.
 *
 * @since 0.0.5
 */
export default function Menu(props) {

    const id = props.id ? "Menu" + props.id : "Menu";
    const className = props.className ? "Menu " + props.className : "Menu";

    const [savedDocuments, setSavedDocuments] = useState(initSavedDocuments());

    const appContext = useContext(AppContext);


    useEffect(() => {
        hidePopup(appContext.setPopupContent);

        $(".App").css("backgroundColor", "rgb(228, 228, 228)");
    }, []);


    // TODO: fetch saved documents from backend
    function initSavedDocuments(): React.JSX.Element[] {

        const temp1 = <div key={0} className="savedDocument dontMarkText">File 1</div>;
        const temp2 = <div key={1} className="savedDocument dontMarkText">File 2</div>;

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
                <div className="newDocumentButtonContainer ">
                    <Button id={"NewDocument"}
                            boxStyle={{
                                height: "250px",
                                width: "100%", 
                            }}
                            childrenStyle={{
                                alignItems: "center",
                                display: "flex",
                                height: "100%",
                                justifyContent: "center",
                                width: "100%", 
                            }}
                            hoverBackgroundColor="rgb(245, 245, 245)"
                            clickBackgroundColor="rgb(230, 230, 230)"
                            handleClick={handleNewDocument}
                            >
                        <i className="fa-solid fa-plus"></i>
                    </Button>

                    <p className="textCenter dontMarkText">Neues Dokument</p>
                </div>
            </div>

            <div className="rightSideBar disabled">
                {savedDocuments}
            </div>
        </div>
    );
}
