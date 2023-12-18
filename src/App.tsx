import React, { createContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./components/document/Document";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getDocumentId, getPartFromDocumentId, hidePopUp, isBlank, log, stringToNumber } from "./utils/Utils";
import { Orientation } from "./enums/Orientation";
import Style, { StyleProp, applyTextInputStyle, getDefaultStyle, getTextInputStyle } from "./abstract/Style";
import PopupContainer from "./components/PopupContainer";


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

    const [escapePopUp, setEscapePopUp] = useState(true);
    const [popupContent, setPopupContent] = useState(<></>);

    const [orientation, setOrientation] = useState(Orientation.PORTRAIT);
    const [numColumns, setNumColumns] = useState(1);

    const [selectedTextInputId, setSelectedTextInputId] = useState("");
    const [selectedTextInputStyle, setSelectedTextInputStyleState] = useState(getDefaultStyle());

    const [pressedKey, setPressedKey] = useState("");

    const appRef = useRef(null);

    const context = {
        setEscapePopUp: setEscapePopUp,
        setPopupContent: setPopupContent,

        orientation: orientation,
        setOrientation: setOrientation,
        numColumns: numColumns,
        setNumColumns: setNumColumns,
        getSelectedColumnId,
        getColumnIdByTextInputId,

        selectedTextInputId: selectedTextInputId,
        setSelectedTextInputId: setSelectedTextInputId,
        selectedTextInputStyle: selectedTextInputStyle,
        setSelectedTextInputStyle: setSelectedTextInputStyle,
        focusSelectedTextInput: focusSelectedTextInput,
        focusTextInput: focusTextInput,
        unFocusTextInput: unFocusTextInput,

        pressedKey: pressedKey
    }


    useEffect(() => {
        document.addEventListener("keydown", (event) => handleGlobalKeyDown(event));
        document.addEventListener("keyup", (event) => handleGlobalKeyUp(event));

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
    

    function getSelectedColumnId(): string {

        return getColumnIdByTextInputId(selectedTextInputId);
    }


    function getColumnIdByTextInputId(textInputId: string): string {

        // case: no text input selected yet
        if (isBlank(textInputId))
            return "";

        const pageIndex = getPartFromDocumentId(textInputId, 1);
        const columnIndex = getPartFromDocumentId(textInputId, 2);

        return getDocumentId("Column", stringToNumber(pageIndex), "", stringToNumber(columnIndex));
    }



    function handleClick(event): void {

        // hide popup
        if (event.target.className.includes("hidePopUp") && escapePopUp)
            hidePopUp(setPopupContent);

        // hide select options
        if (!event.target.className.includes("dontHideSelect")) 
            hideSelectOptions();

        // hide nav menu mobile
        if (!event.target.className.includes("dontHideNavSectionRightMobile")) 
            $(".navSectionRightMobile").slideUp(200);

        // hide warn info popup
        if (!event.target.className.includes("dontHideWarnIcon"))
            $(".WarnIcon .miniPopup").fadeOut(200);
    }


    function handleGlobalKeyDown(event): void {

        if (event.key === "Escape") 
            hidePopUp(setPopupContent);

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
     * @param stylePropsToOverride list of style properties to override when copying styles 
     */
    function focusTextInput(textInputId: string, updateSelectedTextInputStyle = true, stylePropsToOverride?: [StyleProp, string | number][]): void {

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

    
    return (
        <div className="App" ref={appRef} onClick={handleClick}>
            <BrowserRouter>
                <AppContext.Provider value={context}>

                    <NavBar />

                    <div className="appOverlay hidePopUp"></div>

                    <div className="content">
                        <div className="flexCenter">
                            <PopupContainer>{popupContent}</PopupContainer>
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
    setPopupContent: (content: React.JSX.Element) => {},

    orientation: Orientation.PORTRAIT,
    setOrientation: (orientation: Orientation) => {},
    numColumns: 1,
    setNumColumns: (numColumns: number) => {},
    getSelectedColumnId: (): string => {return ""},
    getColumnIdByTextInputId: (textInputId: string): string => {return ""},

    selectedTextInputId: "",
    setSelectedTextInputId: (id: string) => {},
    selectedTextInputStyle: getDefaultStyle(),
    setSelectedTextInputStyle: (style: Style, stylePropsToOverride?: [StyleProp, string | number][]) => {},

    focusSelectedTextInput: () => {},
    focusTextInput: (id: string, updateSelectedTextInputStyle?: boolean, stylePropsToOverride?: [StyleProp, string | number][]) => {},
    unFocusTextInput: (id: string) => {},

    pressedKey: ""
})