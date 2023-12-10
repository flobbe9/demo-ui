import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashBorder, getCSSValueAsNumber, isBlank, isTextLongerThanInput, log, logWarn, togglePopUp } from "../../utils/Utils";
import { DocumentContext } from "./Document";
import Button from "../helpers/Button";
import PopupHeadingConfig from "../popups/PopupHeadingConfig";
import Popup from "../Popup";


// TODO: add key combinations for most buttons
    // set title to combination

// TODO: dimensions in mobile mode
// TODO: select is bad
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


    function handleFontSizeSelect(fontSize: string): void {

        appContext.focusSelectedTextInput();

        appContext.selectedTextInputStyle.fontSize = getCSSValueAsNumber(fontSize, 2);
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


    function handleHeadingClick(event): void {

        // configure popup
        appContext.setPopupContent(
            <Popup height="large"
                    width="full">
                <PopupHeadingConfig handleSelect={() => {}}/>
            </Popup>
        );

        // toggle
        togglePopUp(appContext.setPopupContent);
    }


    return (
        <div id={id} className={className + " flexCenter"} ref={stylePanelRef}>
            <div className={"sectionContainer flexLeft" + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection hideRightBorder={false}>
                    <h6 className="textCenter">Spalte</h6>
                    <div className="flexCenter">
                        <Select id="FontSize"
                                label={appContext.selectedTextInputStyle.fontSize.toString()}
                                disabled={disabled}
                                hoverBackgroundColor="rgb(245, 245, 245)"
                                className="mr-3"
                                boxStyle={{borderColor: "rgb(200, 200, 200)", width: "50px"}}
                                optionsBoxStyle={{borderColor: "rgb(200, 200, 200)", width: "50px"}}
                                handleSelect={handleFontSizeSelect}
                                title="Schriftgröße"
                                >
                            <option value="10px">10</option>
                            <option value="11px">11</option>
                            <option value="12px">12</option>
                            <option value="14px">14</option>
                            <option value="16px">16</option>
                            <option value="18px">18</option>
                            <option value="20px">20</option>
                        </Select>

                        <Button id={"HeadingConfig"}
                                handleClick={handleHeadingClick}
                                hoverBackgroundColor="rgb(245, 245, 245)"
                                clickBackgroundColor="rgb(200, 200, 200)"
                                boxStyle={{
                                    border: "1px solid rgb(200, 200, 200)",
                                    borderRadius: "3px",
                                    boxShadow: "none",
                                }}
                                >
                            <div style={{fontSize: "16px"}}>Überschrift</div>
                            <div style={{fontSize: "12px"}}>Überschrift</div>
                        </Button>
                    </div>
                </StylePanelSection>
                
                <StylePanelSection hideRightBorder={false}>
                    <div className="flexLeft" style={{height: "50%"}}>
                        <Select id="FontFamily" 
                                label={appContext.selectedTextInputStyle.fontFamily}
                                disabled={disabled}
                                hoverBackgroundColor="rgb(245, 245, 245)"
                                componentStyle={{width: "150px"}}
                                optionsBoxStyle={{borderColor: "rgb(200, 200, 200)", width: "150px"}}
                                boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                handleSelect={handleFontFamilySelect}
                                title="Schriftart"
                                >
                            <option value="Arial">Arial</option>
                            <option value="Calibri">Calibri</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Sans Serif Collection">Sans Serif Collection</option>
                        </Select>
                    </div>

                    <div className="flexLeft" style={{height: "50%"}}>
                        <Checkbox id="Bold" 
                                  handleSelect={handleBoldSelect}
                                  checked={appContext.selectedTextInputStyle.bold}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(230, 230, 230)"
                                  disabled={disabled}
                                  boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                  title="Fett"
                                  >
                            <strong>F</strong>
                        </Checkbox>
                        <Checkbox id="Underline" 
                                  handleSelect={handleUnderlineSelect}
                                  checked={appContext.selectedTextInputStyle.underline}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(230, 230, 230)"
                                  disabled={disabled}
                                  boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                  title="Unterstrichen"
                                  ><u>U</u></Checkbox>
                        <Checkbox id="Italic" 
                                  handleSelect={handleItalicSelect}
                                  checked={appContext.selectedTextInputStyle.italic}
                                  hoverBackgroundColor="rgb(245, 245, 245)"
                                  checkedBackgroundColor="rgb(230, 230, 230)"
                                  disabled={disabled}
                                  boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                  title="Kursiv"
                                  ><i>K</i></Checkbox>

                        <div className="flexRight" style={{width: "100%"}}>
                            <ColorPicker id="StylePanelColor" 
                                        handleSelect={handleColorSelect} 
                                        color={appContext.selectedTextInputStyle.color}
                                        toggleStyle={toggleColorPickerStyle}
                                        hoverBackgroundColor="rgb(245, 245, 245)"
                                        disabled={disabled}
                                        boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                        >
                                <span className="dontMarkText">A</span>
                            </ColorPicker>
                        </div>
                    </div>
                </StylePanelSection>

                <StylePanelSection buttonContainerClassName="flexLeft" hideRightBorder={false}>
                    <RadioButton id={"Left"} 
                                 childrenClassName="flexCenter dontMarkText" 
                                 name={"TextAlign"} 
                                 value="LEFT"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Linksbündig" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(230, 230, 230)"
                                 boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                 disabled={disabled}
                                 >
                        L
                    </RadioButton>
                    <RadioButton id={"Center"} 
                                 childrenClassName="flexCenter dontMarkText" 
                                 name={"TextAlign"} 
                                 value="CENTER"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Zentriert" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(230, 230, 230)"
                                 boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                 disabled={disabled}
                                 >
                        M
                    </RadioButton>
                    <RadioButton id={"Right"} 
                                 childrenClassName="flexCenter dontMarkText" 
                                 name={"TextAlign"} 
                                 value="RIGHT"
                                 radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                 handleSelect={handleTextAlignSelect}
                                 title="Rechtsbündig" 
                                 hoverBackgroundColor="rgb(245, 245, 245)"
                                 checkedBackgroundColor="rgb(230, 230, 230)"
                                 boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                 disabled={disabled}
                                 >
                        R
                    </RadioButton>
                </StylePanelSection>

                <StylePanelSection hideRightBorder={true}
                                   buttonContainerClassName="flexCenter"
                                   >
                    <Button id={"Tab"} 
                            hoverBackgroundColor="rgb(245, 245, 245)"
                            clickBackgroundColor="rgb(200, 200, 200)"
                            disabled={disabled} 
                            handleClick={handleTab}
                            title="Tab"
                            boxStyle={{
                                border: "1px solid rgb(200, 200, 200)",
                                borderRadius: "3px",
                                boxShadow: "none"
                            }}
                            >
                        <div>Einrückung</div>
                        <img src="tab_copy_2.png" alt="Tab key icon" title="Einrückung (Tab)" height={30} width={40}/>
                    </Button>
                </StylePanelSection>
            </div>
        </div>
    )
}