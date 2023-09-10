import React, { useEffect, useState } from "react";
import "../../styles/StylePanel.css";
import { NO_TEXT_INPUT_SELECTED, fontFamilies } from "../../../utils/GlobalVariables";
import { getCurrentTextInput } from "../DocumentBuilder";
import StylePanelCheckbox from "./StylePanelCheckbox";
import StylePanelSelect from "./StylePanelSelect";
import StylePanelRadioButton from "./StylePanelRadioButton";
import StylePanelColor from "./StylePanelColor";


// TODO: add disabled conditions
    // reset styles on picture type click
// TODO: add style reset
// TODO: make margin a public constant
// TODO: add info texts on hover
// IDEA: display images in frontend
// IDEA: save and load functionality (connected to login)
export default function StylePanel(props) {

    return (
        <div className="StylePanel">
            <div className="inputTypeSwitch borderRight">
                <StylePanelRadioButton radioButtonGroup="textInputTypeSwitch" 
                                       styleValue="text" 
                                       height="50px" 
                                       width="50px"
                                       styleValueDefault="text">
                    Text
                </StylePanelRadioButton>
                <StylePanelRadioButton radioButtonGroup="textInputTypeSwitch" 
                                       styleValue="file" 
                                       height="50px" 
                                       width="50px" 
                                       styleValueDefault="text">
                    Bild
                </StylePanelRadioButton>
                {/* TODO:  */}
                {/* <StylePanelRadioButton label="Tabelle" textstyleValue="table" onClick={updateCurrentTextInputType} /> */}
            </div>

            <div className="style">
                <div className="borderRight">
                    <div className="StylePanelFlex">
                        <StylePanelSelect label="Schriftart" styleAttributeBackend="fontFamily" styleAttributeCSS="font-family" styleValueDefault="Calibri" optionsArray={getFontFamilySelectOptions} />
                        <StylePanelSelect label="Schriftgröße" styleAttributeBackend="fontSize" styleAttributeCSS="font-size" styleValueDefault="16px" optionsArray={getFontSizeSelectOptions} />

                    </div>

                    <div className="StylePanelFlex">
                        <StylePanelCheckbox styleValue="bold" styleAttributeCSS="font-weight" styleValueDefault="normal" ><strong>F</strong></StylePanelCheckbox>
                        <StylePanelCheckbox styleValue="italic" styleAttributeCSS="font-style" styleValueDefault="normal"><i>K</i></StylePanelCheckbox>
                        <StylePanelCheckbox styleValue="underline"  styleAttributeCSS="text-decoration" styleValueDefault="none"><u>U</u></StylePanelCheckbox>
                        
                        <StylePanelColor styleAttributeCSS="color" styleValueDefault="#000000"/>
                    </div>
                </div>

                <div>
                    <div className="StylePanelFlex">
                        <StylePanelRadioButton radioButtonGroup="indent" 
                                               styleValue="0px" 
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="margin-left"
                                               styleValueDefault="0px">
                            <IndentIcon parentId="StylePanelRadioButton-0px" numIndents={0} alignment="left">
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>

                        <StylePanelRadioButton radioButtonGroup="indent" 
                                               styleValue="30px" 
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="margin-left"
                                               styleValueDefault="0px">
                            <IndentIcon parentId="StylePanelRadioButton-30px" numIndents={1} alignment="left">
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>

                        <StylePanelRadioButton radioButtonGroup="indent" 
                                               styleValue="60px"
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="margin-left"
                                               styleValueDefault="0px">
                            <IndentIcon parentId="StylePanelRadioButton-60px" numIndents={2} alignment="left">
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>
                    </div>

                    <div className="StylePanelFlex">
                        <StylePanelRadioButton radioButtonGroup="textAlign" 
                                               styleValue="left" 
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="text-align"
                                               styleValueDefault="left">
                            <IndentIcon parentId="StylePanelRadioButton-left" numIndents={0} alignment="left">
                                <hr className="indentLine" />
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>

                        <StylePanelRadioButton radioButtonGroup="textAlign" 
                                               styleValue="center" 
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="text-align"
                                               styleValueDefault="left">
                            <IndentIcon parentId="StylePanelRadioButton-center" numIndents={0} alignment="center">
                                <hr className="indentLine" />
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>

                        <StylePanelRadioButton radioButtonGroup="textAlign" 
                                               styleValue="right"
                                               height="30px" 
                                               width="40px"
                                               styleAttributeCSS="text-align"
                                               styleValueDefault="left">
                            <IndentIcon parentId="StylePanelRadioButton-right" numIndents={0} alignment="right">
                                <hr className="indentLine" />
                                <hr className="indentLine" />
                            </IndentIcon>
                        </StylePanelRadioButton>
                    </div>
                </div>
            </div>
        </div>
    );
}


function IndentIcon(props: {
    children?,
    numIndents: number,
    alignment: string
    parentId?: string,
}) {

    const [marginLeft, setMarginLeft] = useState("");


    useEffect(() => {
        // display flex align
        if (props.parentId) {
            const parent = document.getElementById(props.parentId)!;
            parent.style.justifyContent = props.alignment;
            parent.style.padding = "0";
        }

        if (props.numIndents === 1) {
            setMarginLeft("10px");
    
        } else if (props.numIndents === 2) {
            setMarginLeft("20px");
        }
    }, []);
    

    return (
        <div className="IndentIcon">
            {props.children}
            <hr className="indentLine" style={{marginLeft: marginLeft}}/>
        </div>
    )
}


export function updateCurrentTextInputType(event, textInputType: string): boolean {
        
    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput) {
        alert(NO_TEXT_INPUT_SELECTED)
        event.preventDefault();
        return false;
    }

    // case: trying to assign header/footer different type than "text"
    if (isHeaderFooter(currentTextInput) && textInputType !== "text") {
        event.preventDefault();
        alert("Kopf - und Fußzeilen können nur den Typ 'Text' haben.");
        return false;
    }

    currentTextInput.type = textInputType;

    return true;
}


export function updateCurrentTextInputStyle(event, styleAttributeCSS: string, styleValueDefault: string, styleValueCheckbox?: string): boolean {

    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput) {
        // TODO: consider popup style
        alert(NO_TEXT_INPUT_SELECTED)
        event.preventDefault();
        return false;
    }

    // case: is not "text" input
    if (currentTextInput.type !== "text")
        return false;

    const stylePanelInput = event.target as HTMLInputElement;
    
    let stylePanelInputValue: string | boolean = stylePanelInput.value;

    // case: checkbox
    if (stylePanelInput.type === "checkbox") 
        stylePanelInputValue = stylePanelInput.checked ? styleValueCheckbox! : styleValueDefault;

    // case: headerFooter
    if (isHeaderFooter(currentTextInput)) {
        Array.from(document.getElementsByClassName(currentTextInput.className)).forEach(textInput => 
            (textInput as HTMLInputElement).style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault);

    // case: any other styleInput
    } else {
        currentTextInput.style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault;

        // case: text-align, shift text and HTML input
        if (styleAttributeCSS === "text-align")
            currentTextInput.parentElement!.style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault;
    }

    return true;
}


export function isHeaderFooter(textInput: HTMLInputElement): boolean {

    return !textInput || textInput.className.startsWith("header") || textInput.className.startsWith("footer");
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

    const options = [<option key={crypto.randomUUID()} value="Calibri" style={{fontFamily: "Calibri"}}>Calibri</option>]
    
    fontFamilies.forEach(fontFamily => {
        options.push(<option key={crypto.randomUUID()} value={fontFamily} style={{fontFamily: fontFamily}}>{fontFamily}</option>)
    });

    return options;
}


/**
 * Handles mouseOver effect to HTMLElement of given id. This will only work if element has an input
 * that is "checkable" as child.
 * 
 * @param componentId if of component wrapping the hidden input
 */
export function handleMouseOver(componentId: string): void {

    let thisComponent = document.getElementById(componentId);

    if (!thisComponent)
        return;

    if (!isChecked(componentId))
        thisComponent.style.backgroundColor = "rgb(231, 231, 231)";
}


/**
 * Handles mouseOut effect to HTMLElement of given id. This will only work if element has an input
 * that is "checkable" as child.
 * 
 * @param componentId if of component wrapping the hidden input
 */
export function handleMouseOut(componentId: string): void {

    let thisComponent = document.getElementById(componentId);

    if (!thisComponent)
        return;

    if (!isChecked(componentId))
        thisComponent.style.backgroundColor = "rgb(238, 238, 238)";
}


/**
 * Query HTMLElement with given id for first child input element and return "checked" attribute on it.
 * 
 * @param componentId if of component wrapping the hidden input
 * @returns true if hidden input is checked, else false
 */
export function isChecked(componentId: string): boolean {

    const thisComponent = document.getElementById(componentId);

    if (!thisComponent)
        return false;

    const childInput = thisComponent.querySelector("input")
    if (!childInput)
        return false;
    
    return childInput.checked;
}
