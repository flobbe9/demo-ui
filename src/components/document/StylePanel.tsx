import React, { Ref, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
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
import { FONT_FAMILIES, RAW_FONT_SIZES } from "../../globalVariables";
import Button from "../helpers/Button";
import Popup from "../popups/Popup";
import PopupColumnConfig from "../popups/PopupColumnConfig";
import PopupOrientationConfig from "../popups/PopupOrientationConfig";
import { getCSSValueAsNumber, isTextLongerThanInput } from "../../utils/documentBuilderUtils";
import PopupContainer from "../popups/PopupContainer";
import SubtlePopup from "../popups/SubtlePopup";


/**
 * Panel on top of <Document /> with all document options (styling etc.).
 * 
 * @since 0.0.1
 */
// TODO: add hide option, or dont fix

export default forwardRef(function StylePanel(props: {
    id?: string,
    className?: string
}, subtlePopupContainerRef: Ref<HTMLDivElement>) {

    const id = "StylePanel" + (props.id || "");
    const className = "StylePanel " + (props.className || "");

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [disabled, setDisabled] = useState(true);

    const stylePanelRef = useRef(null);
    const sectionContainerRef = useRef(null);
    const subtlePopupRef = useRef(null);

    // make ref passed by 'forwardRef' usable inside this component
    useImperativeHandle(subtlePopupContainerRef, () => subtlePopupRef.current!, []);

    const boxBackgroundColor = "rgb(255, 255, 255)";
    const boxBorder = "1px solid rgb(200, 200, 200)";
    const hoverBackgroundColor = "rgb(245, 245, 245)";
    const checkedBackgroundColor = "rgb(233, 233, 233)";


    useEffect(() => {
        if (disabled && !isBlank(documentContext.selectedTextInputId))
            setDisabled(false);
        
    }, [documentContext.selectedTextInputId]);

    
    useEffect(() => {
        setCssVariable("stylePanelOverflow", (appContext.isMobileView ? "auto" : "none"));

    }, [appContext.isMobileView]);

    
    function handleFontFamilySelect(fontFamily: string): void {

        documentContext.selectedTextInputStyle.fontFamily = fontFamily;
        documentContext.setSelectedTextInputStyle({...documentContext.selectedTextInputStyle});
    }


    // TODO: note if font size is out of bounds
    // TODO: handle key down for select font size input, validate
    function handleFontSizeSelect(fontSize: string): void {
        
        // case: text too long for text input length      
        const isFontSizeTooLargeForTextInput = isTextLongerThanInput(documentContext.selectedTextInputId, "", fontSize + "px");
        if (isFontSizeTooLargeForTextInput) {
            documentContext.showSubtlePopup("Kann Schriftgröße nicht ändern", "Lösche ein paar der letzten Zeichen in der Zeile und versuche es dann erneut.", "Warn");
            return;
        }

        // handle font size change
        const diff = documentContext.subtractMSWordFontSizes(getCSSValueAsNumber(fontSize, 2), documentContext.selectedTextInputStyle.fontSize);
        documentContext.handleFontSizeChange(diff);

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


    return (
        <div id={id} className={className} ref={stylePanelRef}>
            <div className={"sectionContainer " + (appContext.isMobileView ? "flexLeft" : "flexCenter") + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection id="FontStyles1" hideRightBorder={true} componentStyle={{maxWidth: "215px"}}>
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

                <StylePanelSection id="FontStyles2" hideRightBorder={false} componentStyle={{maxWidth: "150px"}}>
                    <div className="flexCenter" style={{height: "50%"}}>
                        <Select id="FontSize"
                                label={documentContext.selectedTextInputStyle.fontSize.toString()}
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
                                    className="me-1"
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
                                    className="me-1 flexCenter"
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

                <StylePanelSection id={"Layout"} 
                                   buttonContainerClassName="flexCenter"
                                   componentStyle={{maxWidth: "260px"}}
                                   hideRightBorder={true}
                                   >
                    <Button id={"OrientationConfig"}
                            className="me-3"
                            boxStyle={{
                                backgroundColor: boxBackgroundColor,
                                border: boxBorder,
                                boxShadow: "none"
                            }}
                            hoverBackgroundColor={hoverBackgroundColor}
                            clickBackgroundColor={checkedBackgroundColor}
                            disabled={disabled}
                            title={"Ausrichtung der Seiten"}
                            onClick={handleOrientationConfigClick}
                            >
                        <div className={id + "IconContainer"}>
                            <img src="orientation.png" alt="orientation icon" height="50" />
                        </div>
                        Ausrichtung
                    </Button>

                    <Button id={"ColumnConfig"}
                            boxStyle={{
                                backgroundColor: boxBackgroundColor,
                                border: boxBorder,
                                boxShadow: "none",
                                height: "96px"
                            }}
                            hoverBackgroundColor={hoverBackgroundColor}
                            clickBackgroundColor={checkedBackgroundColor}
                            disabled={disabled}
                            title={"Anzahl der Spalten"}
                            onClick={handleColumnConfigClick}
                            >
                        <div className={id + "IconContainer mb-2"}>
                            <img src="columnIcon.png" alt="column icon" height="40" />
                        </div>
                        Spalten
                    </Button>
                </StylePanelSection>
            </div>
            
            {/* subtle popup */}
            <PopupContainer id={"SubtlePopup"} className="subtlePopupContainer" matchPopupDimensions={true} ref={subtlePopupRef}>
                <Popup id={"Subtle" + documentContext.subtlePopupType} 
                       className="Subtle dontHideSubtlePopup boxShadowGrey" 
                       height={"max-content"} 
                       width={"200px"}>
                    <SubtlePopup title={documentContext.subtlePopupTitle} message={documentContext.subtlePopupMessage} type={documentContext.subtlePopupType} hideThis={(duration) => $(subtlePopupRef.current!).fadeOut(duration)} />
                </Popup>
            </PopupContainer>
        </div>
    )
})