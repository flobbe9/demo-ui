import React from "react";
import "../assets/styles/Column.css";
import TextInput from "./TextInput";
import { log } from "../utils/Utils";


export default function Column(props) {

    return (
        <div id="Column" className="Column">
            <div>
                <TextInput id={"-0"}/>
                <TextInput id={"-1"}/>
                <TextInput id={"-2"}/>
            </div>
            <div>
                <TextInput id={"-0"}/>
                <TextInput id={"-1"}/>
                <TextInput id={"-2"}/>
            </div>
            <div>
                <TextInput id={"-0"}/>
                <TextInput id={"-1"}/>
                <TextInput id={"-2"}/>
            </div>
        </div>
    )
}