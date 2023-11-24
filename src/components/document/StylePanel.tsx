import React, { useContext } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../../App";
import RadioButton from "../helpers/RadioButton";


export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);


    function handleFontFamilySelect(fontFamily: string): void {

        appContext.selectedTextInputStyle.fontFamily = fontFamily;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleBoldSelect(bold: boolean): void {

        appContext.selectedTextInputStyle.bold = bold;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleUnderlineSelect(underline: boolean): void {

        appContext.selectedTextInputStyle.underline = underline;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleItalicSelect(italic: boolean): void {

        appContext.selectedTextInputStyle.italic = italic;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleColorSelect(color: string): void {

        // TODO: stop left border from coloring
        appContext.selectedTextInputStyle.color = color;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleTextAlignSelect(textAlign: string): void {

        appContext.selectedTextInputStyle.textAlign = textAlign;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function toggleColorPickerStyle(color: string): void {

        $("#ColorPickerStylePanelColor .colorChildren").css("text-decoration-color", color);
    }


    return (
        <div id={id} className={className}>
            <div className="sectionContainer flexLeft">
                <StylePanelSection hideRightBorder={false}>
                    <div className="flexLeft">
                        <Select id="FontFamily" 
                                width="150px" 
                                handleSelect={handleFontFamilySelect}
                                selectedValue={appContext.selectedTextInputStyle.fontFamily}>
                            <option onClick={() => handleFontFamilySelect("Arial")} title="Arial" value="Arial">Arial</option>
                            <option onClick={() => handleFontFamilySelect("Calibri")} title="Calibri" value="Calibri">Calibri</option>
                            <option onClick={() => handleFontFamilySelect("Times New Roman")} title="Times New Roman" value="Times New Roman">Times New Roman</option>
                            <option onClick={() => handleFontFamilySelect("Sans Serif Collection")} title="Sans Serif Collection" value="Sans Serif Collection">Sans Serif Collection</option>
                        </Select>
                    </div>

                    <div className="flexLeft">
                        <Checkbox id="Bold" 
                                  handleSelect={handleBoldSelect}
                                  checked={appContext.selectedTextInputStyle.bold}
                                  ><strong title="Fett">F</strong></Checkbox>
                        <Checkbox id="Underline" 
                                  handleSelect={handleUnderlineSelect}
                                  checked={appContext.selectedTextInputStyle.underline}
                                  ><u title="Unterstrichen">U</u></Checkbox>
                        <Checkbox id="Italic" 
                                  handleSelect={handleItalicSelect}
                                  checked={appContext.selectedTextInputStyle.italic}
                                  ><i title="Kursiv">K</i></Checkbox>

                        <ColorPicker id="StylePanelColor" 
                                     handleSelect={handleColorSelect} 
                                     color={appContext.selectedTextInputStyle.color}
                                     toggleStyle={toggleColorPickerStyle}
                                     >
                            <span className="dontMarkText">A</span>
                        </ColorPicker>
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
                                 >L</RadioButton>
                    <RadioButton id={"Center"} 
                                 childrenClassName="flexCenter" 
                                 name={"TextAlign"} 
                                 value="CENTER"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Zentriert" 
                                 >M</RadioButton>
                    <RadioButton id={"Right"} 
                                 childrenClassName="flexCenter" 
                                 name={"TextAlign"} 
                                 value="RIGHT"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Rechtsbündig" 
                                 >R</RadioButton>
                </StylePanelSection>
            </div>
        </div>
    )
}