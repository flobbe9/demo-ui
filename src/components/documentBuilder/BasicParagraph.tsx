import React, { useContext, useEffect, useState } from "react";
import { BasicStyle, getCurrentTextInput, getTextInputStyle, setCurrentBasicParagraphId } from "./DocumentBuilder";
import { NO_TEXT_INPUT_SELECTED } from "../../utils/GlobalVariables";
import { toggleCheckboxStyle } from "./style/StylePanelCheckbox";
import { toggleColor } from "./style/StylePanelColor";
import { toggleRadioButtonStyle } from "./style/StylePanelRadioButton";
import "../styles/BasicParagraph.css";
import { BasicParagraphContext } from "./PageColumn";


/** Key of the BasicParagraph currently selected. */
let key = "";


/**
 * Componnt defining a basic text input in the Document component that can be added multiple times.
 * 
 * @param props.id id of component
 * @param props.key unique key for each BasicParagraph in the Document component
 * @param props.propsKey identical with props.key. Exists because props.key cannot be accessed through props
 * @param props.columnPosition type of PageColumn component ("left" or "right")
 * @since 0.0.1
 */
// TODO: make inputs the size of a column but not resizable
export default function BasicParagraph(props: {
    id: string,
    key: string,
    propsKey: string,
    columnPosition: string
}) {

    const [buttonsDisplay, setButtonsDisplay] = useState("none");

    const {basicParagraphs, setBasicParagraphs, pageNumber, basicParagraphCount, setBasicParagraphCount} = useContext(BasicParagraphContext);


    useEffect(() => {
        // case: more than one bp on this page
        if (basicParagraphCount > 1) {
            key = props.propsKey
            
            // get styles from prev text input
            transferTextInputStyle(props.id, basicParagraphs, basicParagraphCount);

            // focus new text input
            document.getElementById(props.id)?.querySelector("input")?.focus();
        }
    }, [])


    function addBasicParagraphHelper(): void {

        addBasicParagraph(props.propsKey, pageNumber, props.columnPosition, basicParagraphs, setBasicParagraphs, basicParagraphCount, setBasicParagraphCount);
    }


    function removeBasicParagraphHelper(): void {

        removeBasicParagraph(props.propsKey, basicParagraphs, setBasicParagraphs, basicParagraphCount, setBasicParagraphCount);
    }
    

    function hoverButtons(): void {

        setButtonsDisplay(buttonsDisplay === "none" ? "block" : "none");
    }


    // TODO: handle "Tab" for "indent"
    function handleKeyDown(event): void {
        
        if (event.key === "Enter")
            addBasicParagraphHelper();
    }

    return (
        <div id={props.id}
             className="BasicParagraph"
             onMouseEnter={hoverButtons}
             onMouseLeave={hoverButtons}>

            <div className="basicParagraphInputContainer">
                <input className="basicParagraphInput textInput"
                        name={props.id}
                        type="text" 
                        // placeholder="Text..." 
                        onFocus={() => setCurrentBasicParagraphId(props.id)} 
                        onClick={updateStylePanel}
                        onKeyDown={handleKeyDown}/>
            </div>

            <div style={{display: buttonsDisplay}}>
                <button className="plusButton" onClick={addBasicParagraphHelper}>+</button>
                <button className="deleteButton" onClick={removeBasicParagraphHelper}>x</button><br />
            </div>
        </div>
    )
}


function addBasicParagraph(propsKey: string, pageNumber: number, columnPosition: string, basicParagraphs, setBasicParagraphs, basicParagraphCount, setBasicParagraphCount): void {
    
    const basicParagraphIndex = getBasicParagraphIndex(propsKey, basicParagraphs);
    const basicParagraphId = "BasicParagraph-" + pageNumber + "-" + columnPosition + "-" + (basicParagraphCount + 1);
    const newKey = crypto.randomUUID();
    
    // case: normal text input
    basicParagraphs.splice(basicParagraphIndex + 1, 0, <BasicParagraph id={basicParagraphId} key={newKey} propsKey={newKey} columnPosition={columnPosition} />);
    setBasicParagraphs([...basicParagraphs]);

    setBasicParagraphCount(basicParagraphCount + 1);
}


function removeBasicParagraph(key: string, basicParagraphs, setBasicParagraphs, basicParagraphCount, setBasicParagraphCount): void {

    const basicParagraphIndex = getBasicParagraphIndex(key, basicParagraphs);

    // always leave one basic paragraph
    if (basicParagraphs.length === 1) 
        return;
    
    basicParagraphs.splice(basicParagraphIndex, 1);
    setBasicParagraphs([...basicParagraphs]);

    setBasicParagraphCount(basicParagraphCount - 1);
}


function getBasicParagraphIndex(propsKey: string, basicParagraphs): number {

    let index = -1;

    basicParagraphs.forEach((basicParagraph, i) => {
        if (basicParagraph.key === propsKey)  {
            index = i;
            return;
        }
    });

    return index;
}


export function updateStylePanel(): void {

    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput) {
        alert(NO_TEXT_INPUT_SELECTED)
        return;
    }

    updateStylePanelInputs(currentTextInput);
}


/**
 * Updates the StylePanel's input fields according to given text input.
 * 
 * @param currentTextInput text input currently selected
 */
function updateStylePanelInputs(currentTextInput: HTMLInputElement) {

    const currentTextInputStyle = getTextInputStyle(currentTextInput)!;

    Array.from(document.getElementsByClassName("stylePanelInput")).forEach(el => {
        const stylePanelInput = el as HTMLInputElement;
        const stylePanelInputType = stylePanelInput.type;
        const stylePanelStyleAttribute = stylePanelInput.name;

        // case: select
        if (stylePanelInputType === "select-one") {
            stylePanelInput.value = getCurrentTextInputStyleValueByBasicStyle(stylePanelStyleAttribute, currentTextInputStyle);

        // case: checkbox
        } else if (stylePanelInputType === "checkbox") {
            stylePanelInput.checked = currentTextInputStyle[stylePanelStyleAttribute];
            toggleCheckboxStyle(stylePanelInput.parentElement!.id);

        // case: color
        } else if (stylePanelInputType === "color") {
            stylePanelInput.value = "#" + currentTextInputStyle[stylePanelStyleAttribute];
            toggleColor("#" + currentTextInputStyle[stylePanelStyleAttribute]);
            
        } else if (stylePanelInputType === "radio") {
            let checked = getCurrentTextInputStyleValueByBasicStyle(stylePanelStyleAttribute, currentTextInputStyle) === stylePanelInput.value;
            
            // case: type switch
            if (stylePanelStyleAttribute === "textInputTypeSwitch")
                checked = currentTextInput.type === stylePanelInput.value;

            if (checked) {
                toggleRadioButtonStyle("StylePanelRadioButton-" + stylePanelInput.value, stylePanelInput.name)
                stylePanelInput.checked = checked;
            }
        }
    });
}


function getCurrentTextInputStyleValueByBasicStyle(basicStyleAttribute: string, currentTextInputStyle: BasicStyle): string {

    // case: indent
    if (basicStyleAttribute === "indent") {
        return getMarginFromIndent(currentTextInputStyle);

    // case: fontSize
    } else if (basicStyleAttribute === "fontSize")  {
        return currentTextInputStyle[basicStyleAttribute] + "px";

    // case: any other
    } else {
        let currentStyleValue = currentTextInputStyle[basicStyleAttribute];

        // ignore case
        if (currentStyleValue)
            currentStyleValue = currentStyleValue.toLowerCase();

        return currentStyleValue;
    }
}


function getMarginFromIndent(style: BasicStyle): string {

    // case: no indent
    if (!style.indentFirstLine && !style.indentParagraph) {
        return "0px";

    // case: one indent
    } else if (style.indentFirstLine && !style.indentParagraph) {
        return "30px";
    
    // case: two indents
    } else
        return "60px";
}


/**
 * Transfer certain styles from text input currently selected to a newly created text input.
 * 
 * @param newBasicParagraphId id of the basicParagraph holding the new text input to apply the styles to
 */
function transferTextInputStyle(newBasicParagraphId: string, basicParagraphs, basicParagraphCount): void {

    // case: only one bp on this page
    if (basicParagraphCount === 1)
        return;

    const textInputAbove = getTextInputAbove(basicParagraphs);
    if (!textInputAbove)
        return;

    const newTextInput = document.getElementById(newBasicParagraphId)?.querySelector("input");
    if (!newTextInput)
        return;

    // set each style attribute of new text input to current text input style
    newTextInput.style.fontSize = textInputAbove.style.fontSize;
    newTextInput.style.fontFamily = textInputAbove.style.fontFamily;
    newTextInput.style.color = textInputAbove.style.color;
    newTextInput.style.fontWeight = textInputAbove.style.fontWeight;
    newTextInput.style.fontStyle = textInputAbove.style.fontStyle;
    newTextInput.style.textDecoration = textInputAbove.style.textDecoration;
    newTextInput.style.marginLeft = textInputAbove.style.marginLeft;
    newTextInput.style.textAlign = textInputAbove.style.textAlign;
    newTextInput.parentElement!.style.textAlign = textInputAbove.style.textAlign;
}


/**
 * Get the text input above the BP that was created last.
 * 
 * @param basicParagraphs see state of {@link BasicParagraph}
 * @returns the text input of the BP above or null if not found
 */
function getTextInputAbove(basicParagraphs): HTMLInputElement | null {

    // index of BP last created
    const newBasicParagraphIndex = getBasicParagraphIndex(key, basicParagraphs);

    // get as HTMLElement
    const basicParagraphAbove = document.getElementById(basicParagraphs[newBasicParagraphIndex - 1].props.id);

    // get input element
    return basicParagraphAbove ? basicParagraphAbove.querySelector("input") : null;
}


export function getLastBasicParagraphIdInColumn(pageNumber: number, columnPosition: string): string {

    const pageColumn = pageNumber + "-" + columnPosition;

    // iterate pageColumn
    const basicParagraphsInPageColumn = Array.from(document.getElementsByClassName("BasicParagraph"))
                                             .filter(bp => bp.id.startsWith("BasicParagraph-" + pageColumn));

    // case: falsy columnPosition
    if (basicParagraphsInPageColumn.length === 0)
        return "";

    // return id of last bp in list
    return basicParagraphsInPageColumn[basicParagraphsInPageColumn.length - 1].id;
}


export function getPageNumberByBasicParagraphId(basicParagraphId: string): number {

    const pageNumber = basicParagraphId.split("-")[1];

    return Number.parseInt(pageNumber);
}


export function getColumnPositionByBasicParagraphId(basicParagraphId: string): string {
    
    return basicParagraphId.split("-")[2];
}