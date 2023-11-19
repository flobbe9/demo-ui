import React, { useContext, useEffect } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../../App";
import Style from "../../abstract/Style";
import { log, stringToNumber } from "../../utils/Utils";
import RadioButton from "../helpers/RadioButton";


export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);


    useEffect(() => {
        updateStylePanel(appContext.selectedTextInputStyle);

    }, [appContext.selectedTextInputId]);


    function handleFontFamilySelect(fontFamily: string): void {

        appContext.selectedTextInputStyle.fontFamily = fontFamily;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleFontSizeSelect(fontSize: number): void {

        appContext.selectedTextInputStyle.fontSize = fontSize;
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
        $("#ColorPickerStylePanelColor .colorChildren").css("text-decoration-color", color);

        appContext.selectedTextInputStyle.color = color;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleTextAlignSelect(textAlign: string): void {

        appContext.selectedTextInputStyle.textAlign = textAlign;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function updateStylePanel(style: Style): void {
        
        // TODO
    }


    return (
        <div id={id} className={className}>
            <div className="sectionContainer flexLeft">
                <StylePanelSection hideRightBorder={false}>
                    <div className="flexLeft">
                        <Select id="FontFamily" width="150px" handleSelect={handleFontFamilySelect}>
                            <option onClick={() => handleFontFamilySelect("Arial")} value="Arial">Arial</option>
                            <option onClick={() => handleFontFamilySelect("Calibri")} value="Calibri">Calibri</option>
                            <option onClick={() => handleFontFamilySelect("Times New Roman")} value="Times New Roman">Times New Roman</option>
                            <option onClick={() => handleFontFamilySelect("Sans Serif Collection")} value="Sans Serif Collection">Sans Serif Collection</option>
                        </Select>

                        {/* <Select id="FontSize" width={"50px"} handleSelect={handleFontSizeSelect}>
                            <option onClick={() => handleFontSizeSelect(8)} value="8">8</option>
                            <option onClick={() => handleFontSizeSelect(9)} value="9">9</option>
                            <option onClick={() => handleFontSizeSelect(10)} value="10">10</option>
                            <option onClick={() => handleFontSizeSelect(11)} value="11">11</option>
                            <option onClick={() => handleFontSizeSelect(12)} value="12">12</option>
                            <option onClick={() => handleFontSizeSelect(14)} value="14">14</option>
                            <option onClick={() => handleFontSizeSelect(16)} value="16">16</option>
                        </Select> */}
                    </div>

                    <div className="flexLeft">
                        <Checkbox id="Bold" handleSelect={handleBoldSelect}><strong title="Fett">F</strong></Checkbox>
                        <Checkbox id="Underline" handleSelect={handleUnderlineSelect}><u title="Unterstrichen">U</u></Checkbox>
                        <Checkbox id="Italic" handleSelect={handleItalicSelect}><i title="Kursiv">K</i></Checkbox>

                        <ColorPicker id="StylePanelColor" handleSelect={handleColorSelect}>
                            <span className="dontMarkText">A</span>
                        </ColorPicker>
                    </div>
                </StylePanelSection>

                <StylePanelSection buttonContainerClassName="flexLeft" hideRightBorder={false}>
                    <RadioButton id={"Left"} childrenClassName="flexCenter" name={"TextAlign"} title="Linksbündig" handleSelect={() => handleTextAlignSelect("LEFT")}>L</RadioButton>
                    <RadioButton id={"Center"} childrenClassName="flexCenter" name={"TextAlign"} title="Zentriert" handleSelect={() => handleTextAlignSelect("CENTER")}>M</RadioButton>
                    <RadioButton id={"Right"} childrenClassName="flexCenter" name={"TextAlign"} title="Rechtsbündig" handleSelect={() => handleTextAlignSelect("RIGHT")}>R</RadioButton>
                </StylePanelSection>
            </div>
        </div>
    )
}