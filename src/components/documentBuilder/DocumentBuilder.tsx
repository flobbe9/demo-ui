import React from "react";
import sendHttpRequest from "../../utils/fetch/fetch";
import { testDocument } from "../../utils/testDocument";
import { saveAs } from "file-saver";
import "../styles/DocumentBuilder.css";
import Style from "./Style";
import DocumentForm from "./DocumentForm";


export default function DocumentBuilder(props) {
    
    return (
        <div className="DocumentBuilder">
            <div style={{textAlign: "center"}}>
                <h1>Document builder</h1><br />
            </div>

            <div className="container">

                <DocumentForm />

                <Style />
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


// <form className="builderForm" action="">
//                 {/* content */}
//                     {/* basicParagraph */}
//                         <div style={{marginLeft: "4%"}}>
//                             <label htmlFor="text">text</label>
//                             <input id="text" type="text" name="text" style={testStyle}/><br />
//                         </div>

//                         {/* style */}
//                         <label htmlFor="fontFamily">Font Family</label>
//                         <input type="text" name="fontFamily" /><br />

//                         <label htmlFor="">Color</label>
//                         <input type="text" name="color" /><br />

//                         <label htmlFor="">Bold</label>
//                         <input type="checkBox" name="bold" /><br />

//                         <label htmlFor="">Italic</label>
//                         <input type="checkBox" name="italic" /><br />

//                         <label htmlFor="">Underline</label>
//                         <input type="checkBox" name="underline" /><br />

//                         <label htmlFor="">Indent first line</label>
//                         <input type="checkBox" name="indentFirstLine" /><br />

//                         <label htmlFor="">Indent paragraph</label>
//                         <input type="checkBox" name="indentParagraph" /><br />

//                         <label htmlFor="">Text align</label>
//                         <select name="textAlign" id="textAlign">
//                             <option value="CENTER">CENTER</option>
//                             <option value="LEFT">LEFT</option>
//                             <option value="RIGHT">RIGHT</option>
//                         </select><br />

//                         <label htmlFor="">Break type</label>
//                         <select name="breakType" id="breakType"><br />
//                             <option value="TEXT_WRAPPING">LINE</option>
//                             <option value="COLUMN">COLUMN</option>
//                             <option value="PAGE">PAGE</option>
//                         </select><br /><br />


//                 {/* tableConfig */}
//                 <div>
//                     <h3>Table configuration</h3>
//                     <label htmlFor="numColumns">Number of columns</label>
//                     <input type="number" name="numColumns"/><br />

//                     <label htmlFor="numRows">Number of rows</label>
//                     <input type="number" name="numRows"/><br />

//                     <label htmlFor="startIndex">Start index</label>
//                     <input type="number" name="startIndex"/><br />

//                     <label htmlFor="numRows">End index</label>
//                     <input type="number" name="endIndex"/><br />
//                 </div>


//                 <button type="submit">
//                     Submit
//                 </button>
//             </form>