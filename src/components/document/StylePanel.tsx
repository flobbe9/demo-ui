import React, { useContext, useEffect, useRef, useState } from "react";
import useCookie from "react-use-cookie";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashClass, isBlank, log, logWarn, setCssVariable, stringToNumber } from "../../utils/basicUtils";
import { DocumentContext } from "./Document";
import { DONT_SHOW_AGAIN_COOKIE_NAME, FONT_FAMILIES, RAW_FONT_SIZES } from "../../globalVariables";
import Button from "../helpers/Button";
import Popup from "../helpers/popups/Popup";
import PopupColumnConfig from "../helpers/popups/PopupColumnConfig";
import PopupOrientationConfig from "../helpers/popups/PopupOrientationConfig";
import { getCSSValueAsNumber } from "../../utils/documentBuilderUtils";


export default function StylePanel(props) {

    const id = "StylePanel" + (props.id || "");
    const className = "StylePanel " + (props.className || "");

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
        if (disabled && !isBlank(documentContext.selectedTextInputId))
            setDisabled(false);
        
    }, [documentContext.selectedTextInputId]);

    
    function handleFontFamilySelect(fontFamily: string): void {

        documentContext.selectedTextInputStyle.fontFamily = fontFamily;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleFontSizeSelect(fontSize: string): void {

        // TODO: calculation is inaccurate (off by two?)
        const diff = getCSSValueAsNumber(fontSize, 2) - documentContext.selectedTextInputStyle.fontSize;
        const checkFontSize = documentContext.isFontSizeTooLarge(documentContext.selectedTextInputId, diff);
        const isFontSizeTooLarge = checkFontSize[0];
        const deleteCount = checkFontSize[1];
        
        // case: line height too large for page
        if (isFontSizeTooLarge) {
            // case: dont increase font size
            if (!documentContext.handleFontSizeTooLarge(true, deleteCount))
                return;
        }

        documentContext.selectedTextInputStyle.fontSize = getCSSValueAsNumber(fontSize, 2);
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleBoldSelect(bold: boolean): void {

        documentContext.selectedTextInputStyle.bold = bold;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleUnderlineSelect(underline: boolean): void {
        
        documentContext.selectedTextInputStyle.underline = underline;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleItalicSelect(italic: boolean): void {
        
        documentContext.selectedTextInputStyle.italic = italic;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleColorSelect(color: string): void {
        
        documentContext.selectedTextInputStyle.color = color;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function handleTextAlignSelect(textAlign: string): void {

        documentContext.selectedTextInputStyle.textAlign = textAlign;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    function toggleColorPickerStyle(color: string): void {

        $("#ColorPickerStylePanelColor .colorChildren").css("text-decoration-color", color);
    }


    function handleColumnConfigClick(event): void {

        const warnPopupContainerIdPart = "ColumnConfigWarning";

        // toggle popup
        documentContext.togglePopup();

        documentContext.setPopupContent(
            // pass the id of inner <PoupContainer /> for toggle effect
            <Popup id="Column" width="large" height="large" handleOverlayClick={() => toggleWarnPopup("PopupContainer" + warnPopupContainerIdPart)}>
                <PopupColumnConfig toggleWarnPopup={toggleWarnPopup} warnPopupContainerIdPart={warnPopupContainerIdPart} />
            </Popup>
        );
    }


    function handleOrientationConfigClick(event): void {

        const warnPopupContainerIdPart = "OrientationConfigWarning";

        // toggle popup
        documentContext.togglePopup(100);

        documentContext.setPopupContent(
            // pass the id of inner <PoupContainer /> for toggle effect
            <Popup id="Orientation" width="large" height="large" handleOverlayClick={() => toggleWarnPopup("PopupContainer" + warnPopupContainerIdPart)}>
                <PopupOrientationConfig toggleWarnPopup={toggleWarnPopup} warnPopupContainerIdPart={warnPopupContainerIdPart} />
            </Popup>
        );
    }


    /**
     * Toggle element with given id and the popup overlays of all  ```<Popup />``` parents.
     * 
     * @param warnPopupId complete id of ```<Popup />``` component holding the ```<WarnPopup />```
     * @param duration of the jquery fade animation (in ms)
     */
    function toggleWarnPopup(warnPopupId: string, duration = 100): void {

        const warnPopup = $("#" + warnPopupId);
        warnPopup.fadeToggle(duration);
        warnPopup.css("display", "flex");

        const popupOverlay = warnPopup.parents(".Popup").children(".popupOverlay");
        popupOverlay.fadeToggle(duration);
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
                                label={documentContext.selectedTextInputStyle.fontFamily}
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
                                  checked={documentContext.selectedTextInputStyle.bold}
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
                                  checked={documentContext.selectedTextInputStyle.underline}
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
                                  checked={documentContext.selectedTextInputStyle.italic}
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
                                        color={documentContext.selectedTextInputStyle.color}
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
                                label={documentContext.selectedTextInputStyle.fontSize}
                                disabled={disabled}
                                hoverBackgroundColor={hoverBackgroundColor}
                                boxStyle={{
                                    border: boxBorder,
                                    backgroundColor: boxBackgroundColor
                                }}
                                optionsBoxStyle={{
                                    border: boxBorder,
                                    backgroundColor: "rgb(235, 235, 235)",                                    
                                    maxHeight: "50vb"
                                }}
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
                                    radioGroupValue={documentContext.selectedTextInputStyle.textAlign}
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
                                    radioGroupValue={documentContext.selectedTextInputStyle.textAlign}
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
                                    radioGroupValue={documentContext.selectedTextInputStyle.textAlign}
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
                            title={"Ausrichtung der Seiten"}
                            handleClick={handleOrientationConfigClick}
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
                            title={"Anzahl der Spalten"}
                            handleClick={handleColumnConfigClick}
                            >
                        <div className={id + "IconContainer"}>
                            <img className={id + "Icon"} src="columnIcon.png" alt="column icon" style={{opacity: 0.7}}/>
                        </div>
                        Spalten
                    </Button>
                </StylePanelSection>
            </div>
            
            {/* subtle popup */}
            <div className="subtlePopupContainer">
                <Popup id="SubtleWarn" className="Subtle dontHideSubtlePopup">
                    {documentContext.subtlePopupContent}
                </Popup>

                <Popup id="SubtleError" className="Subtle dontHideSubtlePopup" >
                    {documentContext.subtlePopupContent}
                </Popup>
            </div>
        </div>
    )
}