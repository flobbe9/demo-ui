import React, { useContext, useEffect, useState } from "react";
import { BasicStyle, getCurrentTextInput, getTextInputStyle, setCurrentBasicParagraphId } from "./DocumentBuilder";
import { BasicParagraphContext, setTextInputCount, textInputCount } from "./Document";
import { NO_TEXT_INPUT_SELECTED } from "../../utils/GlobalVariables";
import { toggleCheckboxStyle } from "./style/StylePanelCheckbox";
import { toggleColor } from "./style/StylePanelColor";
import { toggleRadioButtonStyle } from "./style/StylePanelRadioButton";
import "../styles/BasicParagraph.css";


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
export default function BasicParagraph(props: {
    id: string,
    key: string,
    propsKey: string,
    columnPosition: string
}) {

    const [buttonsDisplay, setButtonsDisplay] = useState("none");

    const {basicParagraphs, setBasicParagraphs} = useContext(BasicParagraphContext);


    useEffect(() => {
        // case: more than one bp on this page
        if (textInputCount > 3) {
            key = props.propsKey
            
            // get styles from prev text input
            transferTextInputStyle(props.id, basicParagraphs);

            // focus new text input
            document.getElementById(props.id)?.querySelector("input")?.focus();
        }
    }, [])


    function addBasicParagraphHelper(): void {

        addBasicParagraph(props.propsKey, props.columnPosition, basicParagraphs, setBasicParagraphs);
    }


    function removeBasicParagraphHelper(): void {

        removeBasicParagraph(props.propsKey, basicParagraphs, setBasicParagraphs);
    }
    

    function hoverButtons(): void {

        setButtonsDisplay(buttonsDisplay === "none" ? "block" : "none");
    }


    return (
        <div id={props.id}
             className="BasicParagraph"
             onMouseEnter={hoverButtons}
             onMouseLeave={hoverButtons}>

            <div className="basicParagraphInputContainer">
                <input className="basicParagraphInput"
                    name={props.columnPosition}
                    type="text" 
                    placeholder="Text..." 
                    onFocus={() => setCurrentBasicParagraphId(props.id)} 
                    onClick={updateStylePanel}
                    onInput={handleInput}/>
            </div>

            <div style={{display: buttonsDisplay}}>
                <button className="plusButton" onClick={addBasicParagraphHelper}>+</button>
                <button className="deleteButton" onClick={removeBasicParagraphHelper}>x</button><br />
            </div>
        </div>
    )
}


function addBasicParagraph(propsKey: string, columnPosition: string, basicParagraphs, setBasicParagraphs): void {

    const basicParagraphIndex = getBasicParagraphIndex(propsKey, basicParagraphs);
    const basicParagraphId = "BasicParagraph-" + columnPosition + "-" + (textInputCount);
    const newKey = crypto.randomUUID();

    // case: normal text input
    basicParagraphs.splice(basicParagraphIndex + 1, 0, <BasicParagraph id={basicParagraphId} key={newKey} propsKey={newKey} columnPosition={columnPosition} />);
    setBasicParagraphs([...basicParagraphs]);

    setTextInputCount(textInputCount + 1);
}


function removeBasicParagraph(key: string, basicParagraphs, setBasicParagraphs): void {

    const basicParagraphIndex = getBasicParagraphIndex(key, basicParagraphs);

    // always leave one basic paragraph
    if (basicParagraphs.length === 1) 
        return;
    
    basicParagraphs.splice(basicParagraphIndex, 1);
    setBasicParagraphs([...basicParagraphs]);

    setTextInputCount(textInputCount - 1);
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


function handleInput(): void {

    const currentTextInput = getCurrentTextInput();

    if (!currentTextInput)
        return;

    // TODO: does not work properly, don't use length
    currentTextInput.style.width = (currentTextInput.value.length + 1) + 'em';

    // TODO: this is crap :D
    if (Number.parseInt(currentTextInput.style.width.replace("em", "")) < 12)
        currentTextInput.style.width = "12em"
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
function transferTextInputStyle(newBasicParagraphId: string, basicParagraphs): void {

    // case: only one bp on this page
    if (textInputCount === 1)
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