import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./document/Document";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Menu from "./Menu";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, getPartFromDocumentId, isBlank, log, stringToNumber } from "../utils/basicUtils";
import { Orientation } from "../enums/Orientation";
import Style, { StyleProp, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "../abstract/Style";
import PopupContainer from "./helpers/popups/PopupContainer";
import { WEBSITE_NAME, BUILDER_PATH, DOCUMENT_SUFFIX, NUM_PAGES } from "../globalVariables";
import Version from "./Version";
import Page from "./document/Page";
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

    const [pages, setPages] = useState<React.JSX.Element[]>(initPages());

    const [escapePopup, setEscapePopup] = useState(true);
    const [popupContent, setPopupContent] = useState(<></>);
    
    const [selectedTextInputId, setSelectedTextInputId] = useState("");
    const [selectedTextInputStyle, setSelectedTextInputStyleState] = useState(getDefaultStyle());

    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);
    const [numColumns, setNumColumns] = useState(1);
    const [numLinesAsSingleColumn, setNumLinesAsSingleColumn] = useState(0);
    
    const [pressedKey, setPressedKey] = useState("");

    const [documentFileName, setDocumentFileName] = useState("Dokument_1.docx");

    const appRef = useRef(null);
    const appPopupRef = useRef(null);
    const appOverlayRef = useRef(null);

    const context = {
        pages,
        setPages,
        initPages,

        setEscapePopup,
        setPopupContent,
        togglePopup,
        hidePopup,

        hideSelectOptions,

        orientation,
        setOrientation,
        numColumns,
        setNumColumns,
        numLinesAsSingleColumn, 
        setNumLinesAsSingleColumn,
        getColumnIdByDocumentId,
        getPageIdByTextInputId,

        selectedTextInputId,
        setSelectedTextInputId,
        selectedTextInputStyle,
        setSelectedTextInputStyle,
        focusTextInput,
        unFocusTextInput,
        isTextInputIdValid,

        pressedKey,

        documentFileName,
        setDocumentFileName,

        isWindowWidthTooSmall,
        adjustDocumentFileName,
    }


    useEffect(() => {
        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("keyup", handleGlobalKeyUp);

        document.title = WEBSITE_NAME;
    }, []);


    /**
     * @param style to update selectedTextInputStyle with
     * @param stylePropsToOverride style props to override in ```style``` param
     */
    function setSelectedTextInputStyle(style: Style, stylePropsToOverride?: [StyleProp, string | number][]): void {

        // set specific props
        if (stylePropsToOverride) 
            stylePropsToOverride.forEach(([styleProp, value]) => style[styleProp.toString()] = value);
        
        setSelectedTextInputStyleState(style);
    }
    

    function getPageIdByTextInputId(textInputId: string): string {

        // case: no text input selected yet
        if (isBlank(textInputId))
            return "";

        const pageIndex = getPartFromDocumentId(textInputId, 1);

        return getDocumentId("Page", stringToNumber(pageIndex), "");
    }


    function getColumnIdByDocumentId(documentId: string): string | null {

        // case: no text input selected yet
        if (isBlank(documentId))
            return null;

        const pageIndex = getPartFromDocumentId(documentId, 1);
        const columnIndex = getPartFromDocumentId(documentId, 2);

        return getDocumentId("Column", stringToNumber(pageIndex), "", stringToNumber(columnIndex));
    }
    

    function initPages(): React.JSX.Element[] {

        const pages: React.JSX.Element[] = [];

        for (let i = 0; i < NUM_PAGES; i++)
            pages.push((
                <div className="flexCenter" key={i}>
                    <Page pageIndex={i} />
                </div>
            ));

        return pages;
    }


    function handleClick(event): void {

        const targetClassName = event.target.className;

        // hide popup
        if (targetClassName.includes("hideAppPopup") && escapePopup)
            hidePopup();

        // hide select options
        // TOOD: do this inside document
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


    /**
     * @param textInputId id of valid ```<TextInput />``` to focus
     * @param updateSelectedTextInputStyle if true, the ```selectedTextInputStyle``` state will be updated with focused text input style
     * @param updateSelectedTextInputStyle if true, the ```selectedTextInputStyle``` will be applied to text input with ```selectedTextInputId```
     * @param stylePropsToOverride list of style properties to override when copying styles 
     */
    function focusTextInput(textInputId: string, 
                            updateSelectedTextInputStyle = true, 
                            applySelectedTextInputStyle = true,
                            stylePropsToOverride?: [StyleProp, string | number][]): void {

        if (!isTextInputIdValid(textInputId))
            return;

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return;
    
        textInput.addClass("textInputFocus");

        // id state
        setSelectedTextInputId(textInputId);
        
        // style state
        if (updateSelectedTextInputStyle) 
            setSelectedTextInputStyle(getTextInputStyle(textInput), stylePropsToOverride);

        // style text input
        if (applySelectedTextInputStyle)
            applyTextInputStyle(textInputId, selectedTextInputStyle);

        textInput.trigger("focus");
    }


    function unFocusTextInput(textInputId: string): void {

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return;

        textInput.removeClass("textInputFocus");
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
     * @param textInputId id of ```<TextInput />``` to check
     * @returns true if element with given id exists in document and has className 'TextInput', else false
     */
    function isTextInputIdValid(textInputId: string): boolean {

        const textInput = getJQueryElementById(textInputId);
        if (!textInput)
            return false;

        // case: is no TextInput
        if (!textInput.prop("className").includes("TextInput"))
            return false;

        return true;
    }
    

    /**
     * @returns true if window width is smaller thatn landscape page width
     */
    function isWindowWidthTooSmall(): boolean {

        return document.documentElement.clientWidth < 1014;
    }


    /**
     * Append {@link DOCUMENT_SUFFIX} if last chars dont match it.
     * 
     * @param documentFileName to adjust
     * @returns fixed document file name (not altering givn param)
     */
    function adjustDocumentFileName(documentFileName: string): string {

        let fileName = documentFileName.trim();

        fileName = fileName.replaceAll(" ", "_");

        return fileName;
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

        // TODO: replac with ref
        $(".PopupContainer").parent(".flexCenter").fadeOut(duration);
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
                        <div className="flexCenter" ref={appPopupRef}>
                            <PopupContainer id={"App"} className="hideAppPopup">{popupContent}</PopupContainer>
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