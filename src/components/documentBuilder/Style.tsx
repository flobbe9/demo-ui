import React, { useState } from "react";
import "../styles/Style.css"
import { wordDocument } from "./Document";


export default function Style(props) {

    const textInputId = props.textInputId;
    const setTextInputId= props.setTextInputId


    // TODO: this does not work
    function toggleInputType(type: string) {

        const textInput = document.getElementById(textInputId.current)!.querySelector("input");

        textInput!.type = type;

        alert(textInputId.current)
    }


    return (
        <div className="Style">
            <div className="inputTypeSwitch">
                <button className="text" onClick={() => toggleInputType("text")}>
                    Text
                </button>

                <button className="picture" onClick={() => toggleInputType("file")}>
                    Bild
                </button>

                <button className="_table">
                    Tabelle
                </button>
            </div>

            <div className="StylePanel" >

                <input className="styleInput" type="text" name="fontFamily" placeholder="Textart" /><br />

                <label className="styleLabel" htmlFor="">Color</label>
                <input className="styleInput" type="color" name="color" /><br />

                <label className="styleLabel" htmlFor="">Bold</label>
                <input className="styleInput" type="checkBox" name="bold" /><br />

                <label className="styleLabel" htmlFor="">Italic</label>
                <input className="styleInput" type="checkBox" name="italic" /><br />

                <label className="styleLabel" htmlFor="">Underline</label>
                <input className="styleInput" type="checkBox" name="underline" /><br />

                <label className="styleLabel" htmlFor="">Indent first line</label>
                <input className="styleInput" type="checkBox" name="indentFirstLine" /><br />

                <label className="styleLabel" htmlFor="">Indent paragraph</label>
                <input className="styleInput" type="checkBox" name="indentParagraph" /><br />

                <label className="styleLabel" htmlFor="">Text align</label>
                <select className="styleInput" name="textAlign" id="textAlign">
                    <option value="CENTER">CENTER</option>
                    <option value="LEFT">LEFT</option>
                    <option value="RIGHT">RIGHT</option>
                </select><br />

                <label className="styleLabel" htmlFor="">Break type</label>
                <select className="styleInput" name="breakType" id="breakType">
                    <option value="TEXT_WRAPPING">LINE</option>
                    <option value="COLUMN">COLUMN</option>
                    <option value="PAGE">PAGE</option>
                </select><br /><br />
            </div>
        </div>
    );
}