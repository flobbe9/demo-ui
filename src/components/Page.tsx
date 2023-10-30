import React from "react";
import "../assets/styles/Page.css";
import Column from "./Column";
import TextInput from "./TextInput";


export default function Page(props) {

    return (
        <div id="Page" className="Page">
            <div className="headingContainer">
                <TextInput id="heading" />
            </div>

            <div className="columnContainer">
                <Column />

                {/* <Column /> */}
                
                <Column />
            </div>
        </div>
    )
}