import React, { useEffect, useRef, useState } from "react";
import "../styles/DocumentForm.css";
import { wordDocument } from "./Document";


export default function DocumentForm(props) {

    // TODO: add set wordDocument functions
    const textInputId = props.textInputId;
    const setTextInputId = props.setTextInputId;
    
    
    function Page(props) {

        const pageType: string = props.pageType;

        const initialKey = crypto.randomUUID();
        
        const [textInputs, setTextInputs] = useState([<BasicParagraph id={"basicParagraph-" + pageType + "-" + 1} key={initialKey} propsKey={initialKey} />]);
        
        /** Starting at 3 becuase 0, 1 and 2 are used by the first 3 paragraphs */
        let textInputCount = useRef(3);


        function addBasicParagraph(propsKey: string): void {
            
            let basicParagraphIndex = getCurrentIndex(propsKey);
            
            const newKey = crypto.randomUUID();
            textInputs.splice(basicParagraphIndex + 1, 0, <BasicParagraph id={"basicParagraph-" + pageType + "-" + (textInputCount.current)} key={newKey} propsKey={newKey} />);
            setTextInputs([...textInputs]);

            textInputCount.current++;
        }


        function removeBasicParagraph(propsKey: string): void {

            let basicParagraphIndex = getCurrentIndex(propsKey);

            // always leave one paragraph
            if (textInputs.length === 1) 
                return;
            
            textInputs.splice(basicParagraphIndex, 1);
            setTextInputs([...textInputs]);
        }


        function getCurrentIndex(propsKey: string): number {

            let index = -1;

            textInputs.forEach((textInput, i) => {
                if (textInput.key === propsKey)  {
                    index = i;
                    return;
                }
            });

            return index;
        }


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
                            onFocus={() => setTextInputId(props.id)} />         
                </div>
            )
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

                    <input type="text" placeholder="Text..." onFocus={() => setTextInputId(props.id)} />

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
                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 0} type="header" placeholder="Kopfzeile..." />

                    {textInputs}

                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 2} type="footer" placeholder="Fußzeile..." />
                </div>
            </div>
        )
    }
    

    return (
        <div className="DocumentForm">
            <h3>Front page</h3>
            <Page pageType="front" />

            <h3>Page1</h3>
            <Page pageType="page1" />

            <h3>Page2</h3>
            <Page pageType="page2" />

            <h3>Back</h3>
            <Page pageType="back" />
            
            <div style={{textAlign: "right"}}>
                <button>Download</button>
            </div>
        </div>
    );
}