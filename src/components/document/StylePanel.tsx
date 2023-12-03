import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashBorder, isBlank, isTextLongerThanInput, log, logWarn } from "../../utils/Utils";
import { DocumentContext } from "./Document";


// TODO: add key combinations for most buttons
    // set title to combination
export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const [disabled, setDisabled] = useState(true);

    const stylePanelRef = useRef(null);
    const sectionContainerRef = useRef(null);

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);


    useEffect(() => {
        if (!isBlank(appContext.selectedTextInputId))
            setDisabled(false);
        
    }, [appContext.selectedTextInputId]);


    function handleFontFamilySelect(fontFamily: string): void {

        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.fontFamily = fontFamily;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleBoldSelect(bold: boolean): void {

        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.bold = bold;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleUnderlineSelect(underline: boolean): void {
        
        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.underline = underline;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleItalicSelect(italic: boolean): void {
        
        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.italic = italic;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleColorSelect(color: string): void {
        
        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.color = color;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleTextAlignSelect(textAlign: string): void {

        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.textAlign = textAlign;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function toggleColorPickerStyle(color: string): void {
        
        appContext.focusSelectedTextInput();

        $("#ColorPickerStylePanelColor .colorChildren").css("text-decoration-color", color);
    }


    function handleTab(event): void {

        documentContext.handleTab(event);

        appContext.focusSelectedTextInput();
    }


    return (
        <div id={id} className={className + " flexCenter"} ref={stylePanelRef}>
            <div className={"sectionContainer flexLeft" + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection hideRightBorder={false}>
                    <div className="flexLeft" style={{height: "50%"}}>
                        <Select id="FontFamily" 
                                handleSelect={handleFontFamilySelect}
                                selectedValue={appContext.selectedTextInputStyle.fontFamily}
                                disabled={disabled}
                                hoverBackgroundColor="rgb(245, 245, 245)"
                                componentStyle={{width: "150px"}}
                                optionsBoxStyle={{width: "150px"}}
                                >
                            <option onClick={() => handleFontFamilySelect("Arial")} title="Arial" value="Arial">Arial</option>
                            <option onClick={() => handleFontFamilySelect("Calibri")} title="Calibri" value="Calibri">Calibri</option>
                            <option onClick={() => handleFontFamilySelect("Times New Roman")} title="Times New Roman" value="Times New Roman">Times New Roman</option>
                            <option onClick={() => handleFontFamilySelect("Sans Serif Collection")} title="Sans Serif Collection" value="Sans Serif Collection">Sans Serif Collection</option>
                        </Select>
                    </div>

                    <div className="flexLeft" style={{height: "50%"}}>
                        <Checkbox id="Bold" 
                                  handleSelect={handleBoldSelect}
                                  checked={appContext.selectedTextInputStyle.bold}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(200, 200, 200)"
                                  disabled={disabled}
                                  >
                            <strong title="Fett">F</strong>
                        </Checkbox>
                        <Checkbox id="Underline" 
                                  handleSelect={handleUnderlineSelect}
                                  checked={appContext.selectedTextInputStyle.underline}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(200, 200, 200)"
                                  disabled={disabled}
                                  ><u title="Unterstrichen">U</u></Checkbox>
                        <Checkbox id="Italic" 
                                  handleSelect={handleItalicSelect}
                                  checked={appContext.selectedTextInputStyle.italic}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(200, 200, 200)"
                                  disabled={disabled}
                                  ><i title="Kursiv">K</i></Checkbox>

                        <div className="flexRight" style={{width: "100%"}}>
                            <ColorPicker id="StylePanelColor" 
                                        handleSelect={handleColorSelect} 
                                        color={appContext.selectedTextInputStyle.color}
                                        toggleStyle={toggleColorPickerStyle}
                                        hoverBackgroundColor="rgb(245, 245, 245)"
                                        disabled={disabled}
                                        >
                                <span className="dontMarkText">A</span>
                            </ColorPicker>
                        </div>
                    </div>
                </StylePanelSection>

                <StylePanelSection buttonContainerClassName="flexLeft" hideRightBorder={false}>
                    <RadioButton id={"Left"} 
                                 childrenClassName="flexCenter" 
                                 name={"TextAlign"} 
                                 value="LEFT"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Linksbündig" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(200, 200, 200)"
                                 disabled={disabled}
                                 >L</RadioButton>
                    <RadioButton id={"Center"} 
                                 childrenClassName="flexCenter" 
                                 name={"TextAlign"} 
                                 value="CENTER"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Zentriert" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(200, 200, 200)"
                                 disabled={disabled}
                                 >M</RadioButton>
                    <RadioButton id={"Right"} 
                                 childrenClassName="flexCenter" 
                                 name={"TextAlign"} 
                                 value="RIGHT"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Rechtsbündig" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(200, 200, 200)"
                                 disabled={disabled}
                                 >R</RadioButton>
                </StylePanelSection>

                <StylePanelSection hideRightBorder={true}>
                    <button onClick={handleTab} disabled={disabled}>
                        <p>Einrückung (Tab)</p>
                        {/* TODO: replace this icon with actual tab icon */}
                        <i className="fa-solid fa-arrows-turn-right fa-2xl"></i>
                        <p></p>
                    </button>
                </StylePanelSection>
            </div>
        </div>
    )
}