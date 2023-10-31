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

    // ref for:
        // orientation
        // numColumns
        // columnType
    // pass refs into url, use in Document
    
    const context = {
        setEscapePopUp: setEscapePopUp,
        setPopUpContent: setPopUpContent,

        orientation: orientation,
        setOrientation: setOrientation
    }

    function handleClick(event): void {

        if (!event.target.className.includes("dontHidePopUp") && escapePopUp)
            hidePopUp(setPopUpContent);
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

                    <div style={{display: "flex", justifyContent: "center"}}>
                        <PopUp>
                            {popUpContent}
                        </PopUp>
                    </div>

                    <div className="content">
                        {/* For blur effect */}
                        <div className="overlay"></div>
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
    setOrientation: (orientation: Orientation) => {}
})