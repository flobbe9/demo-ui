import React, { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./components/Document";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import PopUpWindow from "./components/PopUpWindow";
import { hidePopUp, log, togglePopUp } from "./utils/Utils";


export default function App() {

    // use this when backend login is implemented (https://www.baeldung.com/spring-security-csrf)
    // const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    const [escapePopUp, setEscapePopUp] = useState(true);


    function handleClick(event): void {

        log(event.target.className);

        if (event.target.className !== "popUpWindowContainer" && event.target.id !== "newDocumentButton" && escapePopUp)
            hidePopUp();
    }


    function handleKeyDown(event): void {

        if (event.key === "Escape")
            hidePopUp();
    }

    
    return (
        <div className="App" onKeyDown={handleKeyDown} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={{setEscapePopUp: setEscapePopUp}}>

                    <NavBar />

                    <div id="popUpWindowContainer">
                        <PopUpWindow />
                    </div>

                    <div className="content">
                        {/* For blur effect */}
                        <div className="overlay"></div>
                        <Routes>
                            <Route path="/" element={<Menu />} />
                            {/* <Route path="/" element={<Document />} /> */}
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
    setEscapePopUp: (escapePopUp: boolean) => {}
})