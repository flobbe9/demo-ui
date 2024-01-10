import React, { useContext, useEffect, useState } from "react";
import "../assets/styles/Menu.css";
import { hideGlobalPopup, setCssVariable, toggleGlobalPopup } from "../utils/basicUtils";
import { AppContext } from "./App";
import Button from "./helpers/Button";
import { BUILDER_PATH } from "../globalVariables";
import { Link } from "react-router-dom";

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
        hideGlobalPopup(appContext.setPopupContent);

        setCssVariable("appBackgroundColor", "rgb(228, 228, 228)");

    }, []);


    // TODO: fetch saved documents from backend
    function initSavedDocuments(): React.JSX.Element[] {

        const temp1 = <div key={0} className="savedDocument dontMarkText">File 1</div>;
        const temp2 = <div key={1} className="savedDocument dontMarkText">File 2</div>;

        return [temp1, temp2];
    }


    return (
        <div id={id} className={className}>
            <div className="leftSideBar">
                <div className="newDocumentButtonContainer ">
                    <Link to={BUILDER_PATH}>
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
                                title="Leeres Dokument"
                                >
                            <i className="fa-solid fa-plus"></i>
                        </Button>
                    </Link>

                    <p className="textCenter dontMarkText">Leeres Dokument</p>
                </div>
            </div>

            <div className="rightSideBar disabled">
                {savedDocuments}
            </div>
        </div>
    );
}
