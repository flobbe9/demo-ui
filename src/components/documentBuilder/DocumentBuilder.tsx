import React, { useRef, useState } from "react";
import sendHttpRequest from "../../utils/fetch/fetch";
import { testDocument } from "../../utils/testDocument";
import { saveAs } from "file-saver";
import "../styles/DocumentBuilder.css";
import Style from "./Style";
import DocumentForm from "./DocumentForm";


export default function DocumentBuilder(props) {

    const textInputId = useRef("builder");
    const setTextInputId = (newTextInputId: string) => {
        textInputId.current = newTextInputId;
    };

    return (
        <div className="DocumentBuilder">
            <div style={{textAlign: "center"}}>
                <h1 onClick={() => alert(textInputId.current)}>Document builder</h1><br />
            </div>

            <div className="container">

                <DocumentForm textInputId={textInputId} setTextInputId={setTextInputId} />

                <Style textInputId={textInputId} setTextInputId={setTextInputId}  />
            </div>   
        </div>
    )
}















const testStyle = {
    fontSize: 30, 
    fontWeight: "bold",
    fontStyle: "italic",
    textDecoration: "underline",
    textAlign: "center"
}


{/* <button onClick={() => createDocument()}>Send test data (not from the form below)</button><br />
            <button onClick={() => downloadDocument()}>Download document last created</button><br /><br /> */}
            

function createDocument() {

    return sendHttpRequest("http://localhost:4001/test/createDocument", "post", testDocument);
}


function downloadDocument(): void {

    saveAs("http://localhost:4001/test/download?pdf=false", "vorspiel.docx");
}