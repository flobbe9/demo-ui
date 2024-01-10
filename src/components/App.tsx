import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./document/Document";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Menu from "./Menu";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, getPartFromDocumentId, hideGlobalPopup, isBlank, log, stringToNumber } from "../utils/basicUtils";
import { Orientation } from "../enums/Orientation";
import Style, { StyleProp, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "../abstract/Style";
import PopupContainer from "./helpers/popups/PopupContainer";
import { API_NAME, BUILDER_PATH, DOCUMENT_SUFFIX, NUM_PAGES } from "../globalVariables";
import Version from "./Version";
import Page from "./document/Page";


/**
 * Document is structured like
 * ```
 *  <Document>
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

    const windowScrollY = useRef(0);

    const appRef = useRef(null);

    const context = {
        pages,
        setPages,
        initPages,

        setEscapePopup,
        setPopupContent,

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
        focusSelectedTextInput,
        focusTextInput,
        unFocusTextInput,
        isTextInputIdValid,

        pressedKey,

        documentFileName,
        setDocumentFileName,

        isWindowWidthTooSmall,
        adjustDocumentFileName
    }


    useEffect(() => {
        document.addEventListener("keydown", handleGlobalKeyDown);
        document.addEventListener("keyup", handleGlobalKeyUp);
        window.addEventListener('scroll', handleScroll);

        document.title = API_NAME;
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

        // hide popup
        if (event.target.className.includes("hideGlobalPopup") && escapePopup)
            hideGlobalPopup(setPopupContent);

        // hide select options
        if (!event.target.className.includes("dontHideSelect")) 
            hideSelectOptions();

        // hide nav menu mobile
        if (!event.target.className.includes("dontHideNavSectionRightMobile")) 
            $(".navSectionRightMobile").slideUp(200);

        // hide warn info popup
        if (!event.target.className.includes("dontHideWarnIcon"))
            $(".WarnIcon .miniPopup").hide();
    }


    function handleGlobalKeyDown(event): void {

        if (event.key === "Escape") {
            hideGlobalPopup(setPopupContent);
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


    function focusSelectedTextInput(): void {
        
        // case: no textinput id selected yet
        if (isBlank(selectedTextInputId))
            return;

        focusTextInput(selectedTextInputId);
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

        const textInput = $("#" + textInputId);
    
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


    function unFocusSelectedTextInput(): void {

        if (!isBlank(selectedTextInputId))
            unFocusTextInput(selectedTextInputId);
    }


    function unFocusTextInput(textInputId: string): void {

        if (!isTextInputIdValid(textInputId))
            return;

        const textInput = $("#" + textInputId);

        textInput.removeClass("textInputFocus");
    }


    function hideSelectOptions(): void {

        const selectOptionsBoxes = $(".selectOptionsBox");

        // iterate all select option boxes
        Array.from(selectOptionsBoxes).forEach(selectOptionsBoxElement => {
            if (!selectOptionsBoxElement)
                return;

            // hide if not hidden already
            const selectOptionsBox = $("#" + selectOptionsBoxElement.id);
            if (selectOptionsBox.css("display") !== "none")
                selectOptionsBox.slideUp(100, "linear");
        })
    }


    function isTextInputIdValid(textInputId: string): boolean {

        if (isBlank(textInputId))
            return false;

        const textInput = $("#" + textInputId);
        // case: invalid id
        if (!textInput.length)
            return false;

        // case: is no TextInput
        if (!textInput.prop("className").includes("TextInput"))
            return false;

        return true;
    }
            

    function handleScroll(event): void {

        const currentScrollY = window.scrollY;

        const controlPanelHeight = $(".ControlPanel").css("height");
        const isScrollUp = windowScrollY.current > currentScrollY;

        // move controlPanel in view
        $(".StylePanel").css("top", isScrollUp ? controlPanelHeight : 0);
        
        // update ref
        windowScrollY.current = currentScrollY;
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

    
    return (
        <div className="App" ref={appRef} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={context}>

                    <NavBar />

                    <div className="appOverlay hideGlobalPopup"></div>

                    <div className="content">
                        <div className="flexCenter">
                            <PopupContainer>{popupContent}</PopupContainer>
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