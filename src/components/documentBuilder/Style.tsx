import React, { useState } from "react";
import "../styles/Style.css"
import { wordDocument } from "./Document";


export default function Style(props) {

    // TODO: reset button? for everything or for each input?
    // TODO: add disabled conditions
    // TODO: change lables to german
    // TODO: add more font-families

    const textInputId = props.textInputId;


    function getCurrentTextInput(): HTMLInputElement | null {

        // TODO: consider message
        // TODO: consider popup style
        const component = document.getElementById(textInputId.current);
        if (!component) {
            alert("Please select an input fieled first")
            return null;
        }
        
        return component.querySelector("input");
    }


    function isHeaderFooter(textInput: HTMLInputElement): boolean {

        return textInput.className === "header" || textInput.className === "footer";
    }


    function updateStyle(event, styleAttribute: string): void {

        const styleInput = event.target as HTMLInputElement;

        const textInput = getCurrentTextInput();
        if (!textInput)
            return;

        // case: headerFooter
        if (isHeaderFooter(textInput)) {
            Array.from(document.getElementsByClassName(textInput.className)).forEach(textInput => {
                (textInput as HTMLInputElement).style[styleAttribute] = styleInput.value;});

            return;   
        }

        textInput.style[styleAttribute] = styleInput.value;
    }


    function toggleStyle(event, styleAttribute: string, defaultValue: string, value?: string): void {

        const styleInput = event.target as HTMLInputElement;
        const checkBoxValue = styleInput.checked;
        value = value? value : styleInput.name;

        const textInput = getCurrentTextInput();
        if (!textInput)
            return;

        // case: headerFooter
        if (isHeaderFooter(textInput)) {
            Array.from(document.getElementsByClassName(textInput.className)).forEach(textInput => {
                (textInput as HTMLInputElement).style[styleAttribute] = checkBoxValue ? value : defaultValue;});

            return;   
        }

        textInput.style[styleAttribute] = checkBoxValue ? value : defaultValue;
    }


    return (
        <div className="Style">
            <div className="inputTypeSwitch">
                <button className="text" onClick={() => getCurrentTextInput()!.type = "text"}>
                    Text
                </button>

                <button className="picture" onClick={() => getCurrentTextInput()!.type = "file"}>
                    Bild
                </button>

                <button className="_table" onClick={() => getCurrentTextInput()!.type = "text"}>
                    Tabelle
                </button>
            </div>

            <div className="StylePanel" >
                <select className="styleInput" placeholder="Schriftart" onChange={(event) => updateStyle(event, "fontFamily")}>
                    <option value="calibri">Calibri</option>
                    <option value="times new roman">Time New Roman</option>
                </select><br />

                <label className="styleLabel" htmlFor="">Color</label>
                <input className="styleInput" type="color" name="color" onChange={(event) => updateStyle(event, "color")} /><br />

                <label className="styleLabel" htmlFor="">Bold</label>
                <input className="styleInput" type="checkBox" name="bold" onChange={(event) => toggleStyle(event, "font-weight", "normal")} /><br />

                <label className="styleLabel" htmlFor="">Italic</label>
                <input className="styleInput" type="checkBox" name="italic" onChange={(event) => toggleStyle(event, "font-style", "normal")}/><br />

                <label className="styleLabel" htmlFor="">Underline</label>
                <input className="styleInput" type="checkBox" name="underline" onChange={(event) => toggleStyle(event, "text-decoration", "none")} /><br />

                <label className="styleLabel" htmlFor="">Indent</label>
                <select className="styleInput" name="indent" onChange={(event) => updateStyle(event, "margin-left")} >
                    <option value="0px">0</option>
                    <option value="30px">1</option>
                    <option value="60px">2</option>
                </select><br />

                <label className="styleLabel" htmlFor="">Text align</label>
                <select className="styleInput" name="textAlign" id="textAlign" onChange={(event) => updateStyle(event, "text-align")}>
                    <option value="LEFT">LEFT</option>
                    <option value="CENTER">CENTER</option>
                    <option value="RIGHT">RIGHT</option>
                </select><br />
{/* 
                <label className="styleLabel" htmlFor="">Break type</label>
                <select className="styleInput" name="breakType" id="breakType">
                    <option value="TEXT_WRAPPING">LINE</option>
                    <option value="COLUMN">COLUMN</option>
                    <option value="PAGE">PAGE</option>
                </select><br /><br /> */}
            </div>
        </div>
    );
}