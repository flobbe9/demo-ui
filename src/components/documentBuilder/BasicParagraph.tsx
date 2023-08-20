import React, { useContext, useEffect, useState } from "react";
import { BasicStyle, getCurrentTextInput, getTextInputStyle, setCurrentBasicParagraphId } from "./DocumentBuilder";
import { BasicParagraphContext, setTextInputCount, textInputCount } from "./Document";
import { NO_TEXT_INPUT_SELECTED } from "../../utils/GlobalVariables";


export default function BasicParagraph(props: {
    id: string,
    key: string,
    propsKey: string,
    pageType: string
}) {

    const [buttonsDisplay, setButtonsDisplay] = useState("none");

    const {basicParagraphs, setBasicParagraphs} = useContext(BasicParagraphContext);


    useEffect(() => {
        // case: more than one bp on this page
        if (textInputCount > 3) {
            // get styles from prev text input
            transferTextInputStyle(props.id);

            // focus new text input
            document.getElementById(props.id)?.querySelector("input")?.focus();
        }
    }, [])


    function addBasicParagraphHelper(): void {

        addBasicParagraph(props.propsKey, props.pageType, basicParagraphs, setBasicParagraphs);
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

            <input className="basicParagraph" 
                   name={props.pageType}
                   type="text" 
                   placeholder="Text..." 
                   onFocus={() => {setCurrentBasicParagraphId(props.id)}} 
                   onClick={updateStylePanel}
                   onInput={handleInput}/>

            <div style={{display: buttonsDisplay}}>
                <button className="plusButton" onClick={addBasicParagraphHelper}>+</button>
                <button className="deleteButton" onClick={removeBasicParagraphHelper}>x</button><br />
            </div>
        </div>
    )
}


function addBasicParagraph(propsKey: string, pageType: string, basicParagraphs, setBasicParagraphs): void {

    const basicParagraphIndex = getCurrentBasicParagraphIndex(propsKey, basicParagraphs);
    const basicParagraphId = "basicParagraph-" + pageType + "-" + (textInputCount);
    const newKey = crypto.randomUUID();

    // case: normal text input
    basicParagraphs.splice(basicParagraphIndex + 1, 0, <BasicParagraph id={basicParagraphId} key={newKey} propsKey={newKey} pageType={pageType} />);
    setBasicParagraphs([...basicParagraphs]);

    setTextInputCount(textInputCount + 1);
}


function removeBasicParagraph(propsKey: string, basicParagraphs, setBasicParagraphs): void {

    const basicParagraphIndex = getCurrentBasicParagraphIndex(propsKey, basicParagraphs);

    // always leave one basic paragraph
    if (basicParagraphs.length === 1) 
        return;
    
    basicParagraphs.splice(basicParagraphIndex, 1);
    setBasicParagraphs([...basicParagraphs]);

    setTextInputCount(textInputCount - 1);
}


function getCurrentBasicParagraphIndex(propsKey: string, basicParagraphs): number {

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

    updateStylePanelInputTypeSwitch(currentTextInput);

    const currentTextInputStyle = getTextInputStyle(currentTextInput);

    Array.from(document.getElementsByClassName("stylePanelInput")).forEach(el => {
        const stylePanelInput = el as HTMLInputElement;
        const stylePanelInputType = stylePanelInput.type;
        let stylePanelStyleAttribute = stylePanelInput.name;

        // case: select
        if (stylePanelInputType === "select-one") {
            stylePanelInput.value = getCurrentTextInputStyleValueForSelect(stylePanelStyleAttribute, currentTextInputStyle);

        // case: checkbox
        } else if (stylePanelInputType === "checkbox") {
            stylePanelInput.checked = currentTextInputStyle[stylePanelStyleAttribute];

        // case: color
        } else if (stylePanelInputType === "color")
            stylePanelInput.value = "#" + currentTextInputStyle[stylePanelStyleAttribute];
    });
}


function updateStylePanelInputTypeSwitch(currentTextInput: HTMLInputElement): void {

    const currentTextInputType = currentTextInput.type;

    if (currentTextInputType === "text") {
        (document.getElementById("textInputTypeSwitch-text") as HTMLInputElement)!.checked = true;

    } else if (currentTextInputType === "file")
        (document.getElementById("textInputTypeSwitch-file") as HTMLInputElement)!.checked = true;
}


function getCurrentTextInputStyleValueForSelect(stylePanelStyleAttribute: string, currentTextInputStyle: BasicStyle): string {

    // case: indent
    if (stylePanelStyleAttribute === "indent") {
        return getMarginFromIndent(currentTextInputStyle);

    // case: fontSize
    } else if (stylePanelStyleAttribute === "fontSize")  {
        return currentTextInputStyle[stylePanelStyleAttribute] + "px";

    // case: any other
    } else
        return currentTextInputStyle[stylePanelStyleAttribute];
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
// TODO: should use text input above as "currentTextInput" instead of "getCurrentTextInput()"
function transferTextInputStyle(newBasicParagraphId: string): void {

    // case: only one bp on this page                                    
    if (textInputCount === 1)
        return;

    const currentTextInput = getCurrentTextInput();
    if (!currentTextInput)
        return;

    const newTextInput = document.getElementById(newBasicParagraphId)?.querySelector("input");
    if (!newTextInput)
        return;

    // set each style attribute of new text input to current text input style
    newTextInput.style.fontSize = currentTextInput.style.fontSize;
    newTextInput.style.fontFamily = currentTextInput.style.fontFamily;
    newTextInput.style.color = currentTextInput.style.color;
    newTextInput.style.fontWeight = currentTextInput.style.fontWeight;
    newTextInput.style.fontStyle = currentTextInput.style.fontStyle;
    newTextInput.style.textDecoration = currentTextInput.style.textDecoration;
    newTextInput.style.marginLeft = currentTextInput.style.marginLeft;
    newTextInput.style.textAlign = currentTextInput.style.textAlign;
}