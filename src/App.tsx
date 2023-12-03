import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Document from "./components/document/Document";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import PopUp from "./components/PopUp";
import { hidePopUp, isBlank, log, togglePopUp } from "./utils/Utils";
import { Orientation } from "./enums/Orientation";
import Style, { getDefaultStyle } from "./abstract/Style";


export default function App() {

    // use this when backend login is implemented (https://www.baeldung.com/spring-security-csrf)
    // const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    const [escapePopUp, setEscapePopUp] = useState(true);
    const [popUpContent, setPopUpContent] = useState(<></>);

    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);
    const [numColumns, setNumColumns] = useState(1);

    const [selectedTextInputId, setSelectedTextInputId] = useState("");
    const [selectedTextInputStyle, setSelectedTextInputStyle] = useState(getDefaultStyle());

    const [keyCombinationActive, setKeyCombinationActive] = useState(false);

    const appRef = useRef(null);

    const context = {
        setEscapePopUp: setEscapePopUp,
        setPopUpContent: setPopUpContent,

        orientation: orientation,
        setOrientation: setOrientation,
        numColumns: numColumns,
        setNumColumns: setNumColumns,

        selectedTextInputId: selectedTextInputId,
        setSelectedTextInputId: setSelectedTextInputId,
        selectedTextInputStyle: selectedTextInputStyle,
        setSelectedTextInputStyle: setSelectedTextInputStyle,
        focusSelectedTextInput: focusSelectedTextInput,

        keyCombinationActive: keyCombinationActive
    }


    useEffect(() => {
        document.addEventListener("keydown", (event) => handleGlobalKeyDown(event));
        document.addEventListener("keyup", (event) => handleGlobalKeyUp(event));

    }, []);


    function handleClick(event): void {

        // hide popup
        if (event.target.className.includes("hidePopUp") && escapePopUp)
            hidePopUp(setPopUpContent);

        // hide select options
        if (!event.target.className.includes("dontHideSelect")) 
            hideSelectOptions();

        // hide nav menu mobile
        if (!event.target.className.includes("dontHideNavSectionRightMobile")) 
            $(".navSectionRightMobile").slideUp(200);
    }


    function handleGlobalKeyDown(event): void {

        if (event.key === "Escape") 
            hidePopUp(setPopUpContent);

        if (event.key === "Control")
            setKeyCombinationActive(true);
    }


    function handleGlobalKeyUp(event): void {

        if (event.key === "Control")
            setKeyCombinationActive(false);
    }


    function focusSelectedTextInput(): void {
        
        // case: no textinput id selected yet
        if (isBlank(selectedTextInputId))
            return;

        $("#" + selectedTextInputId).trigger("focus");
    }


    function hideSelectOptions(): void {

        const selectOptionsBox = $(".selectOptionsBox");

        if (selectOptionsBox.css("display") !== "none") {
            selectOptionsBox.slideUp(100, "linear");
            focusSelectedTextInput();
        }
    }

    
    return (
        <div className="App" ref={appRef} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={context}>

                    <NavBar />

                    <div className="appOverlay hidePopUp"></div>

                    <div className="content">
                        <div className="flexCenter">
                            <PopUp>{popUpContent}</PopUp>
                        </div>

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
    setNumColumns: (numColumns: number) => {},

    selectedTextInputId: "",
    setSelectedTextInputId: (id: string) => {},
    selectedTextInputStyle: getDefaultStyle(),
    setSelectedTextInputStyle: (style: Style) => {},
    focusSelectedTextInput: () => {},

    keyCombinationActive: false
})