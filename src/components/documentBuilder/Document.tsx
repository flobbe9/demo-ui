import React, { useRef, useState } from "react";
import "../styles/Document.css";
import { Style, downloadWordDocument, getTextInputStyle } from "./DocumentBuilder";


export default function Document(props) {

    // TODO: addTextInput() should use styles of previous input
    // TODO: addTExtInput() should focus on new text input

    const setTextInputId = props.setTextInputId;
    const getCurrentTextInput = props.getCurrentTextInput;
    

    function HeaderFooter(props) {

        function keyUpHeaderFooter(event) {

            // replace values of all other header / footer inputs
            Array.from(document.getElementsByClassName("HeaderFooter")).forEach(headerFooter => {
                const textInput = headerFooter.querySelector("input");

                // check type (header or footer)
                if ((textInput as HTMLInputElement).className === props.type)
                    (textInput as HTMLInputElement).value = event.target.value;
            })
        }


        return (
            <div id={props.id} className="HeaderFooter">
                <input className={props.type}
                        type="text" 
                        placeholder={props.placeholder}
                        onKeyUp={(event) => keyUpHeaderFooter(event)}
                        onFocus={() => setTextInputId(props.id)} 
                        onClick={props.updateStylePanel} />         
            </div>
        )
    }

    
    /**
     * TODO: 
     * "textInput" refers to any text input on a page. <p>
     * "basicParagraph" refers to a normal text input from the array, thus not beeing a header, footer, style or table text input.
     * @param props 
     * @returns 
     */
    function Page(props) {

        const pageType: string = props.pageType;

        const initialKey = crypto.randomUUID();
        
        /** initial text inputs */
        const [basicParagraphs, setBasicParagraphs] = useState([<BasicParagraph id={"basicParagraph-" + pageType + "-" + 1} key={initialKey} propsKey={initialKey} />]);
        
        /** Starting at 3 becuase 0, 1 and 2 are used by the first 3 paragraphs */
        let textInputCount = useRef(3);


        function addBasicParagraph(propsKey: string): void {
            
            const basicParagraphIndex = getCurrentBasicParagraphIndex(propsKey);
            const basicParagraphId = "basicParagraph-" + pageType + "-" + (textInputCount.current);
            const newKey = crypto.randomUUID();

            basicParagraphs.splice(basicParagraphIndex + 1, 0, <BasicParagraph id={basicParagraphId} key={newKey} propsKey={newKey} />);
            setBasicParagraphs([...basicParagraphs]);

            textInputCount.current++;
        }


        function removeBasicParagraph(propsKey: string): void {

            const basicParagraphIndex = getCurrentBasicParagraphIndex(propsKey);

            // always leave one basic paragraph
            if (basicParagraphs.length === 1) 
                return;
            
            basicParagraphs.splice(basicParagraphIndex, 1);
            setBasicParagraphs([...basicParagraphs]);
        }


        function getCurrentBasicParagraphIndex(propsKey: string): number {

            let index = -1;

            basicParagraphs.forEach((textInput, i) => {
                if (textInput.key === propsKey)  {
                    index = i;
                    return;
                }
            });

            return index;
        }


        function updateStylePanel(): void {

            const currentTextInput = getCurrentTextInput();
    
            if (!currentTextInput)
                return;

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
        

        function updateStylePanelInputTypeSwitch(currentTextInput: HTMLInputElement) {

            const currentTextInputType = currentTextInput.type;

            if (currentTextInputType === "text") {
                (document.getElementById("textInputTypeSwitch-text") as HTMLInputElement)!.checked = true;

            } else if (currentTextInputType === "file") {
                (document.getElementById("textInputTypeSwitch-picture") as HTMLInputElement)!.checked = true;

            } else
            // TODO: reconsider this id
                (document.getElementById("textInputTypeSwitch-table") as HTMLInputElement)!.checked = true;
        }


        function getCurrentTextInputStyleValueForSelect(stylePanelStyleAttribute: string, currentTextInputStyle: Style): string {

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


        // TODO: make magic numbers global variables
        function getMarginFromIndent(style: Style): string {

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


        
        function BasicParagraph(props) {

            const [buttonsDisplay, setButtonsDisplay] = useState("none");


            function hoverButtons() {

                setButtonsDisplay(buttonsDisplay === "none" ? "block" : "none");
            }


            return (
                <div id={props.id}
                     className="BasicParagraph"
                     onMouseEnter={hoverButtons}
                     onMouseLeave={hoverButtons}>

                    <input className="basicParagraph" 
                           name={pageType}
                           type="text" 
                           placeholder="Text..." 
                           onFocus={() => {setTextInputId(props.id)}} 
                           onClick={updateStylePanel}/>

                    <div style={{display: buttonsDisplay}}>
                        <button className="plusButton" onClick={() => addBasicParagraph(props.propsKey)}>+</button>
                        <button className="deleteButton" onClick={() => removeBasicParagraph(props.propsKey)}>x</button><br />
                    </div>
                </div>
            )
        }


        return (
            <div className="Page">
                <div className={pageType}>
                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 0} type="header" placeholder="Kopfzeile..." updateStylePanel={updateStylePanel} />

                    {basicParagraphs}

                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 2} type="footer" placeholder="Fußzeile..." updateStylePanel={updateStylePanel} />
                </div>
            </div>
        )
    }
    

    return (
        <div className="Document">
            <h3>Back</h3>
            <Page pageType="back" />

            <h3>Front page</h3>
            <Page pageType="front" />

            <h3>Page2</h3>
            <Page pageType="page2" />

            <h3>Page1</h3>
            <Page pageType="page1" />
            
            <div style={{textAlign: "right"}}>
                {/* TODO: add some kind of "pending" button */}
                <button onClick={downloadWordDocument}>Download</button>
            </div>
        </div>
    );
}