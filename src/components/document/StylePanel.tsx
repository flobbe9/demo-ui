import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashClass, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, isBlank, isTextLongerThanInput, log, logWarn, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { DocumentContext } from "./Document";
import { FONT_FAMILIES, FONT_SIZES, RAW_FONT_SIZES } from "../../globalVariables";
import Button from "../helpers/Button";
import Popup from "../helpers/popups/Popup";
import PopupColumnConfig from "../helpers/popups/PopupColumnConfig";
import PopupOrientationConfig from "../helpers/popups/PopupOrientationConfig";


// TODO: add key combinations for most buttons
    // set title to combination

export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [disabled, setDisabled] = useState(true);
    const [flexClass, setFlexClass] = useState("flexCenter");

    const stylePanelRef = useRef(null);
    const sectionContainerRef = useRef(null);

    const boxBackgroundColor = "rgb(240, 240, 240)";
    const boxBorder = "1px solid white";
    const hoverBackgroundColor = "rgb(225, 225, 225)";
    const checkedBackgroundColor = "rgb(200, 200, 200)";


    useEffect(() => {
        if (appContext.isWindowWidthTooSmall()) 
            handleWindowWidthTooSmall();
    }, []);


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
        const deleteCount = checkFontSize[1];

        if (isFontSizeTooLarge) {
            // case: dont increase font size
            if (!documentContext.handleFontSizeTooLarge(true, deleteCount))
                return;
        }

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


    function handleColumnConfig(event): void {

        documentContext.setPopupContent(
            <Popup id="ColumnConfig" width="large" height="large">
                <PopupColumnConfig />
            </Popup>
        );

        // toggle popup
        documentContext.togglePopup();
    }


    function handleOrientationConfig(event): void {

        documentContext.setPopupContent(
            <Popup id="Orientation" width="large" height="large">
                <PopupOrientationConfig />
            </Popup>
        );

        // toggle popup
        documentContext.togglePopup();
    }


    function handleWindowWidthTooSmall(): void {

        setFlexClass("flexLeft");
        setCssVariable("stylePanelOverflow", "auto");
    }


    return (
        <div id={id} className={className} ref={stylePanelRef}>
            <div className={"sectionContainer " + flexClass + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection hideRightBorder={true} componentStyle={{maxWidth: "215px"}}>
                    <div className="flexLeft" style={{height: "50%"}}>
                        <Select id="FontFamily" 
                                label={appContext.selectedTextInputStyle.fontFamily}
                                disabled={disabled}
                                hoverBackgroundColor={hoverBackgroundColor}
                                componentStyle={{width: "100%"}}
                                optionsBoxStyle={{
                                    border: boxBorder,
                                    backgroundColor: "rgb(235, 235, 235)",
                                    maxHeight: "50vb"}}
                                boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                }}
                                handleSelect={handleFontFamilySelect}
                                title="Schriftart"
                                options={FONT_FAMILIES.sort().map(font => [font, font])}
                                />
                    </div>

                    <div className="flexLeft" style={{height: "50%"}}>
                        <Checkbox id="Bold" 
                                  handleSelect={handleBoldSelect}
                                  checked={appContext.selectedTextInputStyle.bold}
                                  hoverBackgroundColor={hoverBackgroundColor}
                                  checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                  disabled={disabled}
                                  boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                  }}
                                  title="Fett"
                                  >
                            <strong>F</strong>
                        </Checkbox>
                        <Checkbox id="Underline" 
                                  handleSelect={handleUnderlineSelect}
                                  checked={appContext.selectedTextInputStyle.underline}
                                  hoverBackgroundColor={hoverBackgroundColor}
                                  checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                  disabled={disabled}
                                  boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                  }}
                                  title="Unterstrichen"
                                  >
                            <u>U</u>
                        </Checkbox>
                        <Checkbox id="Italic" 
                                  handleSelect={handleItalicSelect}
                                  checked={appContext.selectedTextInputStyle.italic}
                                  hoverBackgroundColor={hoverBackgroundColor}
                                  checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                  disabled={disabled}
                                  boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                  }}
                                  title="Kursiv"
                                  >
                            <i>K</i>
                        </Checkbox>

                        <div className="flexRight" style={{width: "100%"}}>
                            <ColorPicker id="StylePanelColor" 
                                        handleSelect={handleColorSelect} 
                                        color={appContext.selectedTextInputStyle.color}
                                        toggleStyle={toggleColorPickerStyle}
                                        hoverBackgroundColor={hoverBackgroundColor}
                                        disabled={disabled}
                                        boxStyle={{
                                            border: boxBorder,
                                            backgroundColor: boxBackgroundColor
                                        }}
                                        >
                                <span className="dontMarkText">A</span>
                            </ColorPicker>
                        </div>
                    </div>
                </StylePanelSection>

                <StylePanelSection hideRightBorder={false} componentStyle={{maxWidth: "150px"}}>
                    <div className="flexCenter" style={{height: "50%"}}>
                        <Select id="FontSize"
                                label={appContext.selectedTextInputStyle.fontSize}
                                disabled={disabled}
                                hoverBackgroundColor={hoverBackgroundColor}
                                boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                }}
                                optionsBoxStyle={{
                                    border: boxBorder,
                                    backgroundColor: "rgb(235, 235, 235)",                                    
                                    maxHeight: "50vb"}}
                                handleSelect={handleFontSizeSelect}
                                title="Schriftgröße"
                                options={RAW_FONT_SIZES.map(fontSize => [fontSize + "px", fontSize.toString()])}
                                pattern={/[0-9]/}
                                />
                    </div>

                    <div className="flexLeft" style={{height: "50%"}}>
                        <RadioButton id={"Left"} 
                                    childrenClassName="flexCenter dontMarkText" 
                                    name={"TextAlign"} 
                                    value="START"
                                    radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                    handleSelect={handleTextAlignSelect}
                                    title="Linksbündig" 
                                    disabled={disabled}
                                    componentStyle={{width: "33%"}}
                                    boxStyle={{
                                        border: boxBorder,
                                        backgroundColor: boxBackgroundColor
                                    }}
                                    hoverBackgroundColor={hoverBackgroundColor}
                                    checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                    >
                            L
                        </RadioButton>
                        <RadioButton id={"Center"} 
                                    className="flexCenter"
                                    childrenClassName="flexCenter dontMarkText" 
                                    name={"TextAlign"} 
                                    value="CENTER"
                                    radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                    handleSelect={handleTextAlignSelect}
                                    title="Zentriert" 
                                    disabled={disabled}
                                    componentStyle={{width: "33%"}}
                                    boxStyle={{
                                        border: boxBorder,
                                        backgroundColor: boxBackgroundColor
                                    }}
                                    hoverBackgroundColor={hoverBackgroundColor}
                                    checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                    >
                            M
                        </RadioButton>
                        <RadioButton id={"Right"} 
                                    className="flexRight"
                                    childrenClassName="flexCenter dontMarkText" 
                                    name={"TextAlign"} 
                                    value="RIGHT"
                                    radioGroupValue={appContext.selectedTextInputStyle.textAlign}
                                    handleSelect={handleTextAlignSelect}
                                    title="Rechtsbündig" 
                                    disabled={disabled}
                                    componentStyle={{width: "34%"}}
                                    boxStyle={{
                                        border: boxBorder,
                                        backgroundColor: boxBackgroundColor
                                    }}
                                    hoverBackgroundColor={hoverBackgroundColor}
                                    checkedStyle={{backgroundColor: checkedBackgroundColor}}
                                    >
                            R
                        </RadioButton>
                    </div>
                </StylePanelSection>

                <StylePanelSection id={"NumColumns"} 
                                   buttonContainerClassName="flexCenter"
                                   componentStyle={{maxWidth: "260px"}}
                                   hideRightBorder={true}
                                   >
                    <Button id={"OrientationConfig"}
                            className="mr-3"
                            
                            
                            boxStyle={{
                                backgroundColor: boxBackgroundColor,
                                border: boxBorder,
                                boxShadow: "none"
                            }}
                            hoverBackgroundColor={hoverBackgroundColor}
                            clickBackgroundColor={checkedBackgroundColor}

                            disabled={disabled}
                            title={"Ausrichtung"}
                            handleClick={handleOrientationConfig}
                            >
                        <div className={id + "IconContainer"}>
                            <img className={id + "Icon"} src="portraitSheet.png" alt="portrait mode"/>
                            <img className={id + "Icon"} src="landscapeSheet.png" alt="landscape mode"/>
                        </div>
                        Ausrichtung
                    </Button>

                    <Button id={"ColumnConfig"}

                            boxStyle={{
                                backgroundColor: boxBackgroundColor,
                                border: boxBorder,
                                boxShadow: "none"
                            }}
                            childrenStyle={{
                                paddingRight: "15px",
                                paddingLeft: "15px"
                            }}
                            hoverBackgroundColor={hoverBackgroundColor}
                            clickBackgroundColor={checkedBackgroundColor}

                            disabled={disabled}
                            title={"Spalten"}
                            handleClick={handleColumnConfig}
                            >
                        <div className={id + "IconContainer"}>
                            <img className={id + "Icon"} src="columnIcon.png" alt="column icon" style={{opacity: 0.7}}/>
                        </div>
                        Spalten
                    </Button>
                </StylePanelSection>
            </div>
        </div>
    )
}