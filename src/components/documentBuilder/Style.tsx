import React from "react";
import "../styles/Style.css"
import { fontFamilies } from "../../utils/GlobalVariables";


export default function Style(props) {
    // TODO: reset button? for everything or for each input?
    // TODO: consider applying textAlign to input tag, not to it's value
    // TODO: add disabled conditions
    // TODO: make checkboxes buttons like in word

    // TODO: what to do with table button??

    const getCurrentTextInput = props.getCurrentTextInput;


    function isHeaderFooter(textInput: HTMLInputElement): boolean {

        return !textInput || textInput.className === "header" || textInput.className === "footer";
    }


    // TODO: textInput gets smaller when decreasing fontSize
    function updateCurrentTextInputStyle(event, styleAttributeCSS: string, styleValueDefault: string, styleValueCheckbox?: string): void {

        const currentTextInput = getCurrentTextInput();

        if (!currentTextInput) {
            event.preventDefault();
            return;
        }

        const stylePanelInput = event.target as HTMLInputElement;
        
        let stylePanelInputValue: string | boolean = stylePanelInput.value;

        // case: checkbox
        if (stylePanelInput.type === "checkbox") {
            stylePanelInputValue = stylePanelInput.checked ? styleValueCheckbox! : styleValueDefault;
        }

        // case: headerFooter
        if (isHeaderFooter(currentTextInput)) {
            Array.from(document.getElementsByClassName(currentTextInput.className)).forEach(textInput => {
                (textInput as HTMLInputElement).style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault});

        // case: basicParagraph
        } else
            currentTextInput.style[styleAttributeCSS] = stylePanelInputValue || styleValueDefault;
    }


    function updateCurrentTextInputType(event, textInputType: string) {
        
        const textInput = getCurrentTextInput();

        if (!textInput) {
            event.preventDefault();
            return;
        }

        // case: trying to assign header/footer different type than "text"
        if (isHeaderFooter(textInput) && textInputType !== "text") {
            event.preventDefault();
            alert("Header and footer fields can only by of type 'Text'.");
            return;
        }

        textInput.type = textInputType;
    }


    function StylePanelRadioButton(props: {label: string, 
                                           textInputType: string, 
                                           onClick
                                        }) {

        return (
            <div className="StylePanelRadioButton">
                <label htmlFor="textInputTypeSwitch">{props.label}</label>
                <input id={"textInputTypeSwitch-" + props.textInputType} 
                       className="stylePanelInput" 
                       name="textInputTypeSwitch" 
                       type="radio" 
                       // only for alert if no input selected
                       onMouseDown={getCurrentTextInput}            
                       onClick={(event) => props.onClick(event, props.textInputType)} />
            </div>
        );
    }


    function StylePanelSelect(props: {
                                label?: string,
                                styleAttributeBackend: string,
                                styleAttributeCSS: string, 
                                styleValueDefault: string,
                                optionsArray: () => React.JSX.Element[], 
                                onChange
                            }) {

        return (
            <div className="StylePanelSelect">
                {props.label ? <label className="stylePanelLabel" htmlFor={props.styleAttributeBackend}>{props.label}</label> : null}
                <select className="stylePanelInput" 
                        name={props.styleAttributeBackend} 
                        // only for alert if no input selected
                        onMouseDown={getCurrentTextInput}
                        onChange={(event) => props.onChange(event, props.styleAttributeCSS, props.styleValueDefault)}>
                    {props.optionsArray()}
                </select>
            </div>
        );
    }


    function StylePanelCheckbox(props: {label: string, 
                                        styleValue: string,
                                        styleAttributeCSS: string, 
                                        styleValueDefault: string,
                                        onChange
                                    }) {

        return (
            <div className="StylePanelCheckbox">
                <label className="stylePanelLabel" htmlFor={props.styleValue}>{props.label}</label>
                <input className="stylePanelInput" 
                       type="checkbox" 
                       name={props.styleValue} 
                       onChange={(event) => props.onChange(event, props.styleAttributeCSS, props.styleValueDefault, props.styleValue)} />
            </div>
        );
    }


    return (
        <div className="Style">
            <div className="inputTypeSwitch">
                <StylePanelRadioButton label="Text" textInputType="text" onClick={updateCurrentTextInputType} />

                <StylePanelRadioButton label="Bild" textInputType="file" onClick={updateCurrentTextInputType} />
                
                <StylePanelRadioButton label="Tabelle" textInputType="text" onClick={updateCurrentTextInputType} />
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


/**
 * Return font-size select options from 8 to 72. Use "16" as default
 * 
 * @returns array with option tags
 */
function getFontSizeSelectOptions(): React.JSX.Element[] {

    const options = [<option value="8px">8</option>]

    for (let i = 9; i < 72; i++) {
        // use 16 as default
        if (i === 16) {
            options.push(<option value={i + "px"} selected>{i}</option>)

        } else
            options.push(<option value={i + "px"}>{i}</option>)
        
        // start going up by two from here (like 12, 14, 16...)
        if (i >= 12)
            i++;
    }

    return options
}


/**
 * Return a few font-family select options. Use "Calibri as default".
 * 
 * @returns array with option tags
 */
function getFontFamilySelectOptions(): React.JSX.Element[] {

    const options = [<option value="Calibri" style={{fontFamily: "calibri"}} selected>Calibri</option>]
    
    fontFamilies.forEach(fontFamily => {
        options.push(<option value={fontFamily} style={{fontFamily: fontFamily}}>{fontFamily}</option>)
    });

    return options;
}


const indentSelectOptions = [<option value="0px">0</option>, 
                             <option value="30px">1</option>, 
                             <option value="60px">2</option>];


const textAlignSelectOptions = [<option value="LEFT">Links</option>, 
                                <option value="CENTER">Mitte</option>, 
                                <option value="RIGHT">Rechts</option>];