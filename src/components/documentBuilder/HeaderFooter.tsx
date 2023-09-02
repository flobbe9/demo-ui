import React from "react";
import { setCurrentBasicParagraphId } from "./DocumentBuilder";
import { updateStylePanel } from "./BasicParagraph";
import "../styles/HeaderFooter.css";


/**
 * Component defining a header or footer text input in the {@link Document}.
 * 
 * @param props.id component id
 * @param props.type either "header" or "footer"
 * @param props.placeholder of the text input
 * @since 0.0.1
 */
export default function HeaderFooter(props: {
    id: string,
    type: string,
    placeholder: string
}) {

    return (
        <div id={props.id} className="HeaderFooter">

            <input className={props.type + " textInput"}
                    type="text" 
                    placeholder={props.placeholder}
                    onKeyUp={(event) => keyUpHeaderFooter(event, props.type)}
                    onFocus={() => setCurrentBasicParagraphId(props.id)} 
                    onClick={updateStylePanel} />     
        </div>
    )
}


/**
 * Synchronize inner HTML in all headers or footers on user input.
 * 
 * @param event keyUp
 * @param type either "header" or "footer"
 */
function keyUpHeaderFooter(event, type: string) {

    // replace values of all other header / footer inputs
    Array.from(document.getElementsByClassName("HeaderFooter")).forEach(headerFooter => {
        const textInput = headerFooter.querySelector("input");

        // check type (header or footer)
        if ((textInput as HTMLInputElement).className.startsWith(type))
            (textInput as HTMLInputElement).value = event.target.value;
    })
}