import React, { useEffect } from "react";
import useState from "react-usestateref";
import "../styles/DocumentForm.css";
import { wordDocument } from "./Document";


export default function DocumentForm(props) {

    const [frontInputs, setFrontInputs, currentFrontInputs] = useState([<TextInput page="front" />]);
    const [page1Inputs, setPage1Inputs, currentPage1Inputs] = useState([<TextInput page="page1" />]);
    const [page2Inputs, setPage2Inputs, currentPage2Inputs] = useState([<TextInput page="page2" />]);
    const [backInputs, setBackInputs, currentBackInputs] = useState([<TextInput page="back" />]);


    function TextInput(props) {

        const [buttonsDisplay, setButtonsDisplay, currentButtonsDisplay] = useState("none");
        const [index, setIndex, currentIndex] = useState(0);
        
        const page:string = props.page;


        useEffect(() => {
            setIndex(currentFrontInputs.current.length - 1);
        }, []);


        function setInputs(newInputs: React.JSX.Element[], remove: boolean) {

            if (page === "front") {
                // TODO: set basicParagraph
                setFrontInputs(remove ? [...newInputs] : [...currentFrontInputs.current, ...newInputs]);

            } else if (page === "page1") {
                setPage1Inputs(remove ? [...newInputs] : [...currentPage1Inputs.current, ...newInputs]);

            } else if (page === "page2") {
                setPage2Inputs(remove ? [...newInputs] : [...currentPage2Inputs.current, ...newInputs]);

            } else if (page === "back")
                setBackInputs(remove ? [...newInputs] : [...currentBackInputs.current, ...newInputs]);
        }
        

        function switchButtonDisplay() {

            setButtonsDisplay(currentButtonsDisplay.current === "none" ? "block" : "none");
        }


        function addInput(): void {

            setInputs([<TextInput page={page} />], false);
        }


        function removeInput(): void {

            // case: first input
            if (currentIndex.current === 0)
                return;

            // remove current element
            const inputs = currentFrontInputs.current;
            inputs.splice(currentIndex.current, 1);

            // set updated inputs
            setInputs([...inputs], true);
        }


        return (
            <div className="TextInput" 
                 onMouseOver={switchButtonDisplay}
                 onMouseOut={switchButtonDisplay}>

                <input className="text" 
                       type="text" 
                       name="text" 
                       placeholder="Kopfzeile"/>

                <div style={{display: currentButtonsDisplay.current}}>
                    <button className="plusButton" onClick={addInput}>+</button>
                    <button className="deleteButton" onClick={removeInput}>x</button><br />
                </div>
            </div>
        )
    }
    

    return (
        <div className="DocumentForm">
            <div className="page">
                <section className="front">
                    <h3>Front page</h3>

                    {currentFrontInputs.current}
                </section>
            </div>

            <div className="page">
                <section className="pieces">
                    <h3>Page1</h3>

                    {page1Inputs}
                </section>
            </div>

            <div className="page">
                <section className="pieces">
                    <h3>Page2</h3>

                    {page2Inputs}
                </section>
            </div>

            <div className="page">
                <section className="back">
                    <h3>Back</h3>

                    {backInputs}
                </section>
            </div>

            <div style={{textAlign: "right"}}>
                <button>Download</button>
            </div>
        </div>
    );
}