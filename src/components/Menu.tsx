import React, { useContext, useState } from "react";
import "../assets/styles/Menu.css";
import { log, togglePopUp } from "../utils/Utils";
import {v4 as uuid} from "uuid";
import { AppContext } from "../App";


export default function Menu(props) {

    const id = props.id ? "Menu" + props.id : "Menu";
    const className = props.className ? "Menu " + props.className : "Menu";

    const [savedDocuments, setSavedDocuments] = useState(initSavedDocuments());

    const appContext = useContext(AppContext);



    // TODO: fetch saved documents from backend
    function initSavedDocuments(): React.JSX.Element[] {

        const temp1 = <div key={uuid()} className="savedDocument">File 1</div>;
        const temp2 = <div key={uuid()} className="savedDocument">File 2</div>;

        return [temp1, temp2];
    }


    function handleNewDocument(event: any): void {
        
        // append child to popup
        // append classNames to popup
                //         <div className="footer">
                //     <button className="blackButton blackButtonContained buttonSmall" 
                //             onClick={handleWindowClose}>
                //         Schließen
                //     </button>
                // </div>
        togglePopUp();
    }


    return (
        <div id={id} className={className}>
            <div className="leftSideBar">
                <button id="newDocumentButton" 
                        className="leftSideBarButton newDocumentButton" 
                        onClick={handleNewDocument}>+</button>
            </div>

            <div className="rightSideBar">
                {savedDocuments}
            </div>
        </div>
    )
}