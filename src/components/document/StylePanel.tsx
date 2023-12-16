import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/StylePanel.css";
import StylePanelSection from "./StylePanelSection";
import Checkbox from "../helpers/Checkbox";
import Select from "../helpers/Select";
import ColorPicker from "../helpers/ColorPicker";
import { AppContext } from "../../App";
import RadioButton from "../helpers/RadioButton";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { flashBorder, getCSSValueAsNumber, getDocumentId, getPartFromDocumentId, isBlank, isTextLongerThanInput, log, logWarn, stringToNumber, togglePopUp } from "../../utils/Utils";
import { DocumentContext } from "./Document";
import Button from "../helpers/Button";
import PopupHeadingConfig from "../popups/PopupHeadingConfig";
import Popup from "../Popup";
import WarnIcon from "../helpers/WarnIcon";


// TODO: add key combinations for most buttons
    // set title to combination

export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";

    const appContext = useContext(AppContext);
    const documentContext = useContext(DocumentContext);

    const [disabled, setDisabled] = useState(true);

    const [fontSizeHeading1, setFontSizeHeading1] = useState(documentContext.columnHeading1FontSize);
    const [fontSizeHeading2, setFontSizeHeading2] = useState(documentContext.columnHeading2FontSize);
    const [fontSizeHeading3, setFontSizeHeading3] = useState(documentContext.columnHeading3FontSize);

    const stylePanelRef = useRef(null);
    const sectionContainerRef = useRef(null);


    useEffect(() => {
        if (disabled && !isBlank(appContext.selectedTextInputId))
            setDisabled(false);
        
    }, [appContext.selectedTextInputId]);

    
    useEffect(() => {
        // set heading font size
        setHeadingFontSize();

    }, [fontSizeHeading1, fontSizeHeading2, fontSizeHeading3]);


    /**
     * Set font size of all heading text inputs offered by ```<PopupHeadingConfig />```.
     */
    function setHeadingFontSize(): void {

        const columnId = appContext.getSelectedColumnId();
        // case: no text input selected yet
        if (isBlank(columnId))
            return;
    
        // find first three text inputs
        const columnTextInputs = $("#" + columnId + " .paragraphContainer .Paragraph .TextInput");

        const heading1 = columnTextInputs.get(0)
        if (heading1)
            heading1.style.fontSize = fontSizeHeading1;

        const heading2 = columnTextInputs.get(1)
        if (heading2)
            heading2.style.fontSize = fontSizeHeading2;

        const heading3 = columnTextInputs.get(2)
        if (heading3)
            heading3.style.fontSize = fontSizeHeading3;
    }
    

    function handleFontFamilySelect(fontFamily: string): void {

        appContext.selectedTextInputStyle.fontFamily = fontFamily;
        appContext.setSelectedTextInputStyle({...appContext.selectedTextInputStyle});
    }


    function handleFontSizeSelect(fontSize: string): void {

        const selectedColumnId = appContext.getSelectedColumnId();

        if (isBlank(selectedColumnId))
            return;

        documentContext.setRenderColumn(true);
        documentContext.setColumnFontSize(fontSize);
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


    function handleHeadingClick(event): void {

        // configure popup
        appContext.setPopupContent(
            <Popup height="small" width="large">
                <PopupHeadingConfig handleSelect={() => {}}
                                    fontSizeHeading1={fontSizeHeading1}
                                    fontSizeHeading2={fontSizeHeading2}
                                    fontSizeHeading3={fontSizeHeading3}
                                    setFontSizeHeading1={setFontSizeHeading1}
                                    setFontSizeHeading2={setFontSizeHeading2}
                                    setFontSizeHeading3={setFontSizeHeading3}
                />
            </Popup>
        );

        // toggle
        togglePopUp(appContext.setPopupContent);
    }


    return (
        <div id={id} className={className + " flexCenter"} ref={stylePanelRef} >
            <div className={"sectionContainer flexLeft row " + (disabled ? " disabled" : "")} ref={sectionContainerRef}>
                <StylePanelSection hideRightBorder={false} 
                                    className="col-6 col-lg-4"
                                    buttonContainerClassName="flexCenter"
                                    >
                    {/* <h6 className="textCenter">Spalte</h6> */}
                    <div className="flexCenter align-items-start row">
                        <div className="flexCenter col-sm-4 col-md-6">
                            <WarnIcon 
                                componentStyle={{
                                    visibility: documentContext.isSelectedColumnEmpty ? "hidden" : "visible",
                                }}
                                iconContainerStyle={{
                                    borderColor: "grey",
                                    color: "grey",
                                    height: "24px",
                                    marginRight: "2px",
                                    padding: "7px",
                                    width: "24px"
                                }}
                                popupStyle={{
                                    backgroundColor: "white",
                                    borderRadius: "3px",
                                    boxShadow: "0 0 3px 1px rgb(200, 200, 200)",
                                    fontSize: "0.8em",
                                    marginTop: "2px",
                                    padding: "3px",
                                    width: "120px",
                                    zIndex: 1
                                }}
                                showPopUpOnHover={true}
                                title="Schriftgöße ändern"
                            >
                                Um die Schriftgröße zu verändern, lösche allen Text in der Spalte
                            </WarnIcon>

                            <Select id="FontSize"
                                    label={getCSSValueAsNumber(documentContext.columnFontSize, 2).toString()}
                                    disabled={disabled || !documentContext.isSelectedColumnEmpty}
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    className="mr-sm-5 mr-md-3"
                                    boxStyle={{borderColor: "rgb(200, 200, 200)", width: "70px"}}
                                    optionsBoxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                    handleSelect={handleFontSizeSelect}
                                    title="Schriftgröße"
                                    options={[
                                        ["10px", "10"],
                                        ["11px", "11"],
                                        ["12px", "12"],
                                        ["14px", "14"],
                                        ["16px", "16"],
                                        ["18px", "18"],
                                        ["20px", "20"]
                                    ]}
                                    />
                        </div>

                        <div className="col-sm-4 col-md-3 mt-2 mt-sm-0 flexCenter">
                            <Button id={"HeadingConfig"}
                                    handleClick={handleHeadingClick}
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    clickBackgroundColor="rgb(200, 200, 200)"
                                    boxStyle={{
                                        border: "1px solid rgb(200, 200, 200)",
                                        borderRadius: "3px",
                                        boxShadow: "none",
                                    }}
                                    disabled={disabled || !documentContext.isSelectedColumnEmpty}
                                    >
                                <div style={{fontSize: "16px"}}>Überschrift</div>
                                <div style={{fontSize: "12px"}}>Überschrift</div>
                            </Button>
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
                                optionsBoxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                boxStyle={{borderColor: "rgb(200, 200, 200)"}}
                                handleSelect={handleFontFamilySelect}
                                title="Schriftart"
                                options={[
                                    ["Calibri", "Calibri"],
                                    ["Arial", "Arial"],
                                    ["Times new roman", "Times new roman"]
                                ]}
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

                <StylePanelSection 
                                className="col-6 col-lg-2"
                                hideRightBorder={false} 
                                buttonContainerClassName="flexCenter"
                                >
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
                                    className="col-6 col-lg-2"
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