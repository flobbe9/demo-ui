import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashClass, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, isBlank, isTextLongerThanInput, log, logWarn, stringToNumber, togglePopup } from "../../utils/Utils";
import { DocumentContext } from "./Document";
import { FONT_FAMILIES, FONT_SIZES, RAW_FONT_SIZES } from "../../utils/GlobalVariables";


// TODO: add key combinations for most buttons
    // set title to combination

// TODO: switch num columns and orientation buttons
export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [disabled, setDisabled] = useState(true);

    const stylePanelRef = useRef(null);
    const sectionContainerRef = useRef(null);


    useEffect(() => {
        if (disabled && !isBlank(appContext.selectedTextInputId))
            setDisabled(false);
        
    }, [appContext.selectedTextInputId]);

    
    function handleFontFamilySelect(fontFamily: string): void {

        appContext.selectedTextInputStyle.fontFamily = fontFamily;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleFontSizeSelect(fontSize: string): void {

        // TODO: calculation is inaccurate (off by two?)
        // case: max line space in column reached
        const diff = getCSSValueAsNumber(fontSize, 2) - appContext.selectedTextInputStyle.fontSize;
        const checkFontSize = documentContext.isFontSizeTooLarge(appContext.selectedTextInputId, diff);
        const isFontSizeTooLarge = checkFontSize[0];
        if (isFontSizeTooLarge) 
            // case: dont increase font size
            if (!documentContext.handleFontSizeTooLarge(true, checkFontSize[1]))
               return;

        appContext.selectedTextInputStyle.fontSize = getCSSValueAsNumber(fontSize, 2);
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


    function handleTab(event): void {

        documentContext.handleTab(event);

        appContext.focusSelectedTextInput();
    }


    return (
        <div id={id} className={className + " flexCenter"} ref={stylePanelRef} >
            <div className={"sectionContainer flexLeft row " + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection hideRightBorder={false} 
                                    className="col-6 col-lg-4"
                                    buttonContainerClassName="flexCenter"
                                    >
                    <div className="flexCenter align-items-start row">
                        <div className="flexCenter col-sm-4 col-md-6">
                            <Select id="FontSize"
                                    label={appContext.selectedTextInputStyle.fontSize}
                                    disabled={disabled}
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    className="mr-sm-5 mr-md-3"
                                    boxStyle={{borderColor: "rgb(200, 200, 200)", width: "70px"}}
                                    optionsBoxStyle={{borderColor: "rgb(200, 200, 200)", maxHeight: "50vb"}}
                                    handleSelect={handleFontSizeSelect}
                                    title="Schriftgröße"
                                    options={RAW_FONT_SIZES.map(fontSize => [fontSize + "px", fontSize.toString()])}
                                    pattern={/[0-9]/}
                                    />
                        </div>
                    </div>
                </StylePanelSection>
                
                <StylePanelSection className="col-6 col-lg-3" 
                                    hideRightBorder={false} 
                                    buttonContainerClassName="pl-4 pr-4"
                                    >
                    <div className="flexLeft" style={{height: "50%"}}>
                        <Select id="FontFamily" 
                                label={appContext.selectedTextInputStyle.fontFamily}
                                disabled={disabled}
                                hoverBackgroundColor="rgb(245, 245, 245)"
                                componentStyle={{width: "100%"}}
                                optionsBoxStyle={{borderColor: "rgb(200, 200, 200)", maxHeight: "50vb"}}
                                boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                handleSelect={handleFontFamilySelect}
                                title="Schriftart"
                                options={FONT_FAMILIES.sort().map(font => [font, font])}
                                />
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

                <StylePanelSection className="col-6 col-lg-2"
                                hideRightBorder={false} 
                                buttonContainerClassName="flexCenter"
                                >
                    <RadioButton id={"Left"} 
                                 childrenClassName="flexCenter dontMarkText" 
                                 name={"TextAlign"} 
                                 value="START"
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
                                    className="col-6 col-lg-2"
                                   >
                    {/* <Button id={"Tab"} 
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
                    </Button> */}
                </StylePanelSection>
            </div>
        </div>
    )
}