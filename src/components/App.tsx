import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./document/Document";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Menu from "./Menu";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, getPartFromDocumentId, isBlank, log, stringToNumber } from "../utils/basicUtils";
import PopupContainer from "./helpers/popups/PopupContainer";
import { WEBSITE_NAME, BUILDER_PATH} from "../globalVariables";
import Version from "./Version";
import { getJQueryElementByClassName, getJQueryElementById } from "../utils/documentUtils";


/**
 * Document is structured like
 * ```
 *  <Document>
 *      <ControlPanel />
 *      <StylePanel />
 * 
 *      <Page>
 *          <Column>
 *              <Paragraph>
 *                  <TextInput />
 *              </ Paragraph>
 *          </ Column>
 *      </ Page>
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

    const appRef = useRef(null);
    const appPopupRef = useRef(null);
    const appOverlayRef = useRef(null);

    const context = {
        setEscapePopup,
        setPopupContent,
        togglePopup,
        hidePopup,
        hideSelectOptions,
        pressedKey,
        isWindowWidthTooSmall
    }


    useEffect(() => {
        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("keyup", handleGlobalKeyUp);

        document.title = WEBSITE_NAME;
    }, []);



    function handleClick(event): void {

        const targetClassName = event.target.className;

        // hide popup
        if (targetClassName.includes("hideAppPopup") && escapePopup)
            hidePopup();

        // hide select options
        if (!targetClassName.includes("dontHideSelect")) 
            hideSelectOptions();

        // hide nav menu mobile
        if (!targetClassName.includes("dontHideNavSectionRightMobile")) 
            $(".navSectionRightMobile").slideUp(200);

        // hide warn info popup
        if (!targetClassName.includes("dontHideWarnIcon"))
            $(".WarnIcon .miniPopup").hide();
    }


    function handleGlobalKeyDown(event): void {

        if (event.key === "Escape") {
            if (escapePopup)
                hideAllPopups();

            hideSelectOptions();
        }

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


    function hideSelectOptions(selectComponentId?: string): void {

        const selectOptionsBoxes = selectComponentId ? getJQueryElementById(selectComponentId + " .selectOptionsBox") : 
                                                       getJQueryElementByClassName("selectOptionsBox");
        if (!selectOptionsBoxes)
            return;

        // iterate all select option boxes
        Array.from(selectOptionsBoxes).forEach(selectOptionsBoxElement => {
            // hide if not hidden already
            const selectOptionsBox = $(selectOptionsBoxElement);
            if (selectOptionsBox.css("display") !== "none")
                selectOptionsBox.slideUp(100, "linear");
        })
    }


    /**
     * @returns true if window width is smaller thatn landscape page width
     */
    function isWindowWidthTooSmall(): boolean {

        return document.documentElement.clientWidth < 1014;
    }
    

    function togglePopup(duration = 100): void {

        const appPopup = $(appPopupRef.current);
        appPopup.fadeToggle(duration);
        $(appOverlayRef.current).fadeToggle(duration);

        if (!appPopup.is(":visible"))
            resetPopup();
    }


    function hidePopup(duration = 100): void {

        $(appPopupRef.current).fadeOut(duration);
        $(appOverlayRef.current).fadeOut(duration);

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
                            <PopupContainer id={"App"} className="hideAppPopup" ref={appPopupRef}>{popupContent}</PopupContainer>
                        </div>

                        <Routes>
                            <Route path="/" element={<Menu />} />
                            <Route path={BUILDER_PATH} element={<Document />} />
                            <Route path={"/version"} element={<Version />} />
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


export const AppContext = createContext();