import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./components/Document";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import PopUp from "./components/PopUp";
import { hidePopUp, log, togglePopUp } from "./utils/Utils";
import { Orientation } from "./enums/Orientation";


export default function App() {

    // use this when backend login is implemented (https://www.baeldung.com/spring-security-csrf)
    // const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    const [escapePopUp, setEscapePopUp] = useState(true);
    const [popUpContent, setPopUpContent] = useState(<></>);

    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);
    const [numColumns, setNumColumns] = useState(1);

    // pass refs into url, use in Document
    
    const context = {
        setEscapePopUp: setEscapePopUp,
        setPopUpContent: setPopUpContent,

        orientation: orientation,
        setOrientation: setOrientation,

        numColumns: numColumns,
        setNumColumns: setNumColumns
    }


    function handleClick(event): void {

        // popup
        if (event.target.className.includes("hidePopUp") && escapePopUp)
            hidePopUp(setPopUpContent);

        // select options
        if (!event.target.className.includes("dontHideSelect")) 
            $(".selectOptionsBox").slideUp(100, "linear");
    }


    function handleKeyDown(event): void {

        if (event.key === "Escape")
            hidePopUp(setPopUpContent);
    }

    
    return (
        <div className="App" onKeyDown={handleKeyDown} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={context}>

                    <NavBar />

                    <div className="content">
                        <div className="flexCenter">
                            <PopUp>
                                {popUpContent}
                            </PopUp>
                        </div>

                        {/* For blur effect */}
                        <div className="overlay hidePopUp"></div>
                        <Routes>
                            <Route path="/" element={<Menu />} />
                            <Route path="/build" element={<Document />} />
                            {/* <Route path="/login" element={<Login />} /> */}
                            {/* <Route path="/confirmAccount" element={<AccountConfirmed />} /> */}
                            {/* <Route path="*" element={<NotFound />} /> */}
                        </Routes>
                    </div>
                    
                    <Footer />
                    
                </AppContext.Provider>
            </BrowserRouter>
        </div>
    );
}


export const AppContext = createContext({
    setEscapePopUp: (escapePopUp: boolean) => {},
    setPopUpContent: (content: React.JSX.Element) => {},

    orientation: Orientation.PORTRAIT,
    setOrientation: (orientation: Orientation) => {},

    numColumns: 1,
    setNumColumns: (numColumns: number) => {}
})