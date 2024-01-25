import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./document/Document";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Home from "./Home";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, setCssVariable } from "../utils/basicUtils";
import PopupContainer from "./helpers/popups/PopupContainer";
import { WEBSITE_NAME, BUILDER_PATH, isMobileWidth} from "../globalVariables";
import NotFound from "./error_pages/NotFound";


/**
 * Document is structured like
 * ```
 *  <Document>
 *      <ControlPanel />
 *      <StylePanel />
 * 
 *      [<Page>
 *          [<Column>
 *              [<Paragraph>
 *                  [<TextInput />]
 *              </ Paragraph>]
 *          </ Column>]
 *      </ Page>]
 *  </ Document>
 * ```
 * @returns any content of this website
 * @since 0.0.1
 */
export default function App() {

    // use this when backend login is implemented (https://www.baeldung.com/spring-security-csrf)
    // const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    
    const [escapePopup, setEscapePopup] = useState(true);
    const [popupContent, setPopupContent] = useState(<></>);
    
    const [pressedKey, setPressedKey] = useState("");

    const [windowSize, setWindowSize] = useState([0, 0]);
    const [isMobileView, setIsMobileView] = useState(isMobileWidth());

    const appRef = useRef(null);
    const appPopupRef = useRef(null);
    const appOverlayRef = useRef(null);

    const context = {
        setEscapePopup,
        setPopupContent,
        togglePopup,
        hidePopup,
        hideStuff,

        pressedKey,

        windowSize,
        isMobileView,
    }


    useEffect(() => {
        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("keyup", handleGlobalKeyUp);
        $(window).on("resize", handleWindowResize);

        document.title = WEBSITE_NAME;

        // clean up
        return () => {
            document.removeEventListener("keydown", handleGlobalKeyDown);
            document.removeEventListener("keyup", handleGlobalKeyUp);
            document.removeEventListener("resize", handleWindowResize);
        }
    }, []);


    function handleClick(event): void {

        hideStuff(event);
    }


    function handleWindowResize(event): void {

        setWindowSize([window.innerWidth, window.innerHeight]);
        setIsMobileView(isMobileWidth());
    }


    function handleGlobalKeyDown(event): void {

        if (event.key === "Escape")
            if (escapePopup)
                hideAllPopups();

        if (event.key === "Control")
            setPressedKey("Control");

        if (event.key === "Shift")
            setPressedKey("Shift");
    }


    function handleGlobalKeyUp(event): void {

        if (event.key === "Control")
            setPressedKey("");

        if (event.key === "Shift")
            setPressedKey("");
    }


    /**
     * Hide popups, menus and such on event or, if not present, unconditionally.
     * 
     * @param event to use the className of
     */
    function hideStuff(event?): void {

        const targetClassName = event ? event.target.className : "";

        // hide all popups
        if (!event)
            hideAllPopups();

        // hide app popup
        if ((targetClassName.includes("hideAppPopup") && escapePopup))
            hidePopup();

        // hide nav menu mobile
        if (!targetClassName.includes("dontHideNavSectionRightMobile") || !event) 
            $(".navSectionRightMobile").slideUp(100);

        // hide warn info popup
        if (!targetClassName.includes("dontHideWarnIcon"))
            $(".WarnIcon .miniPopup").hide();

        // hide controlPanelMenu
        if (!targetClassName.includes("dontHideControlPanelMenu"))
            $(".ControlPanelMenu").slideUp(100);
    }
    

    function togglePopup(duration = 100): void {

        const appPopup = $(appPopupRef.current!);
        appPopup.fadeToggle(duration);
        $(appOverlayRef.current!).fadeToggle(duration);

        if (!appPopup.is(":visible"))
            resetPopup();
    }


    function hidePopup(duration = 100): void {

        $(appPopupRef.current!).fadeOut(duration);
        $(appOverlayRef.current!).fadeOut(duration);

        resetPopup(duration);
    }


    function hideAllPopups(duration = 100): void {

        // popups
        $(".PopupContainer").fadeOut(duration);

        // overlays
        $(".appOverlay").fadeOut(duration);
        $(".documentOverlay").fadeOut(duration);
        $(".popupOverlay").fadeOut(duration);
    }


    function resetPopup(duration = 100): void {

        setTimeout(() => setPopupContent(<></>), duration + 100);
    }

    
    return (
        <div className="App" ref={appRef} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={context}>

                    <NavBar />

                    <div className="appOverlay hideAppPopup" ref={appOverlayRef}></div>

                    <div className="content">
                        <div className="flexCenter">
                            <PopupContainer id={"App"} className="hideAppPopup" ref={appPopupRef}>
                                {popupContent}
                            </PopupContainer>
                        </div>

                        <Routes>
                            <Route path="/home" element={<Home />} />
                            <Route path={BUILDER_PATH} element={<Document />} />
                            {/* <Route path="/login" element={<Login />} /> */}
                            {/* <Route path="/confirmAccount" element={<AccountConfirmed />} /> */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                    
                    <Footer />
                    
                </AppContext.Provider>
            </BrowserRouter>
        </div>
    );
}


export const AppContext = createContext({
    setEscapePopup: (escapePopup: boolean) => {},
    setPopupContent: (popupContent: React.JSX.Element) => {},
    togglePopup: (duration?: number) => {},
    hidePopup: (duration?: number) => {},
    hideStuff: (event?) => {},

    isMobileView: false,

    windowSize: [0, 0],
    pressedKey: "",
});