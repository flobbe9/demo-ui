import React from "react";
import "../../styles/StylePanel.css";
import { NO_TEXT_INPUT_SELECTED, fontFamilies } from "../../../utils/GlobalVariables";
import { getCurrentTextInput } from "../DocumentBuilder";
import StylePanelCheckbox from "./StylePanelCheckbox";
import StylePanelSelect from "./StylePanelSelect";
import StylePanelRadioButton from "./StylePanelRadioButton";


// TODO: consider applying textAlign to input tag, not to it's value
// TODO: add disabled conditions
    // no style for picture type inputs
    // reset styles on picture type click
// TODO: make checkboxes buttons like in word
// BUG: textInput gets smaller when decreasing fontSize
export default function StylePanel(props) {

    return (
        <div className="Style">
            <div className="inputTypeSwitch">
                <StylePanelRadioButton label="Text" inputType="text" onClick={updateCurrentTextInputType} />

                <StylePanelRadioButton label="Bild" inputType="file" onClick={updateCurrentTextInputType} />
                
                {/* TODO:  */}
                {/* <StylePanelRadioButton label="Tabelle" textInputType="table" onClick={updateCurrentTextInputType} /> */}
            </div>

            <div className="stylePanel">
                <StylePanelSelect label="Schriftgröße" styleAttributeBackend="fontSize" styleAttributeCSS="font-size" styleValueDefault="16px" optionsArray={getFontSizeSelectOptions} onChange={updateCurrentTextInputStyle} />

                <StylePanelSelect label="Schriftart" styleAttributeBackend="fontFamily" styleAttributeCSS="font-family" styleValueDefault="Calibri" optionsArray={getFontFamilySelectOptions} onChange={updateCurrentTextInputStyle} />

                <label className="stylePanelLabel" htmlFor="color">Farbe</label>
                <input className="stylePanelInput" 
                       type="color" 
                       name="color" 
                       // only for alert if no input selected
                       onMouseDown={getCurrentTextInput}
                       onChange={(event) => updateCurrentTextInputStyle(event, "color", "#000000")} />
                
                <StylePanelCheckbox label="Fett" styleValue="bold" styleAttributeCSS="font-weight" styleValueDefault="normal" onChange={updateCurrentTextInputStyle} />
                
                <StylePanelCheckbox label="Kursiv" styleValue="italic" styleAttributeCSS="font-style" styleValueDefault="normal" onChange={updateCurrentTextInputStyle} />
                
                <StylePanelCheckbox label="Unterstrichen" styleValue="underline"  styleAttributeCSS="text-decoration" styleValueDefault="none" onChange={updateCurrentTextInputStyle} />

                <StylePanelSelect label="Einrückungen" styleAttributeBackend="indent" styleAttributeCSS="margin-left" styleValueDefault="0px" optionsArray={() => indentSelectOptions} onChange={updateCurrentTextInputStyle} />

                <StylePanelSelect label="Text Ausrichtung" styleAttributeBackend="textAlign" styleAttributeCSS="text-align" styleValueDefault="LEFT" optionsArray={() => textAlignSelectOptions} onChange={updateCurrentTextInputStyle} />
            </div>
        </div>
    );
}


function updateCurrentTextInputType(event, textInputType: string): void {
        
    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput) {
        alert(NO_TEXT_INPUT_SELECTED)
        event.preventDefault();
        return;
    }

    // case: trying to assign header/footer different type than "text"
    if (isHeaderFooter(currentTextInput) && textInputType !== "text") {
        event.preventDefault();
        alert("Header and footer fields can only by of type 'Text'.");
        return;
    }

    currentTextInput.type = textInputType;
}


function updateCurrentTextInputStyle(event, styleAttributeCSS: string, styleValueDefault: string, styleValueCheckbox?: string): void {

    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput) {
        // TODO: consider popup style
        alert(NO_TEXT_INPUT_SELECTED)
        event.preventDefault();
        return;
    }

    const stylePanelInput = event.target as HTMLInputElement;
    
    let stylePanelInputValue: string | boolean = stylePanelInput.value;

    // case: checkbox
    if (stylePanelInput.type === "checkbox") 
        stylePanelInputValue = stylePanelInput.checked ? styleValueCheckbox! : styleValueDefault;

    // case: headerFooter
    if (isHeaderFooter(currentTextInput)) {
        Array.from(document.getElementsByClassName(currentTextInput.className)).forEach(textInput => 
            (textInput as HTMLInputElement).style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault);

    // case: basicParagraph
    } else
        currentTextInput.style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault;
}


function isHeaderFooter(textInput: HTMLInputElement): boolean {

    return !textInput || textInput.className === "header" || textInput.className === "footer";
}


/**
 * Return font-size select options from 8 to 72. Use "16" as default
 * 
 * @returns array with option tags
 */
function getFontSizeSelectOptions(): React.JSX.Element[] {

    const options = [<option key={crypto.randomUUID()} value="8px">8</option>]

    for (let i = 9; i <= 72; i++) {
        options.push(<option key={crypto.randomUUID()} value={i + "px"}>{i}</option>)
        
        // start going up by two from here (like 12, 14, 16...)
        if (i >= 12)
            i++;
    }

    return options;
}


/**
 * Return a few font-family select options. Use "Calibri as default".
 * 
 * @returns array with option tags
 */
function getFontFamilySelectOptions(): React.JSX.Element[] {

    const options = [<option key={crypto.randomUUID()} value="Calibri" style={{fontFamily: "calibri"}}>Calibri</option>]
    
    fontFamilies.forEach(fontFamily => {
        options.push(<option key={crypto.randomUUID()} value={fontFamily} style={{fontFamily: fontFamily}}>{fontFamily}</option>)
    });

    return options;
}


const indentSelectOptions = [<option key={crypto.randomUUID()} value="0px">0</option>, 
                             <option key={crypto.randomUUID()} value="30px">1</option>, 
                             <option key={crypto.randomUUID()} value="60px">2</option>];


const textAlignSelectOptions = [<option key={crypto.randomUUID()} value="LEFT">Links</option>, 
                                <option key={crypto.randomUUID()} value="CENTER">Mitte</option>, 
                                <option key={crypto.randomUUID()} value="RIGHT">Rechts</option>];