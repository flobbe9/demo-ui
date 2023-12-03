import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopUpChooseColumnType.css";
import RadioButton from "../helpers/RadioButton";
import { AppContext } from "../../App";
import { ColumnContext } from "../document/Column";
import { hidePopUp, log } from "../../utils/Utils";


// TODO: escape key does not work
// TODO: continue here, columnType changes with delay
export default function PopUpChooseColumnType(props:{
    handleSelect,
    columnType: number,
    handleSubmit,
    id?,
    className?,
    style?
}) {

    // state columns
    const id = props.id ? "PopUpChooseColumnType" + props.id : "PopUpChooseColumnType";
    const className = props.className ? "PopUpChooseColumnType " + props.className : "PopUpChooseColumnType";

    const appContext = useContext(AppContext);
    const columnContext = useContext(ColumnContext);
    
    const [orientationClassName, setOrientationClassName] = useState(appContext.orientation === "portrait" ? "whiteButtonPortrait" : "whiteButtonLandscape");
    const [columnType, setColumnType] = useState(props.columnType);


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [])


    function handleSelect(columnType: number): void {
        
        setColumnType(columnType);
        props.handleSelect(columnType);
    }


    function handleKeyDown(event): void {

        if (event.key === "Enter") {
            props.handleSubmit();
            hidePopUp(appContext.setPopUpContent);
        }
    }

    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp dontMarkText"/>
            </div>

            <div className="body">
                <span className="flexCenter popUpHeading">Spalten Muster</span>
                <br />

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type1"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textLeft dontMarkText"}
                                    name={"ColumnType"} 
                                    value={1}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        Lorem ipsum <br />
                        dolor sit <br />
                        amet consectetur <br />
                        adipisicing elit. <br />
                        Maxime mollitia <br />
                        ...
                    </RadioButton>
                    Linksbündig
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type2"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textCenter dontMarkText"}
                                    name={"ColumnType"}
                                    value={2}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        Lorem ipsum <br />
                        dolor sit <br />
                        amet consectetur <br />
                        adipisicing elit. <br />
                        Maxime mollitia <br />
                        ...
                    </RadioButton>
                    Zentriert
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type3"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textRight dontMarkText"}
                                    name={"ColumnType"}
                                    value={3}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        Lorem ipsum <br />
                        dolor sit <br />
                        amet consectetur <br />
                        adipisicing elit. <br />
                        Maxime mollitia <br />
                        ...
                    </RadioButton>
                    Rechtsbündig
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type4"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textLeft dontMarkText"}
                                    name={"ColumnType"}
                                    value={4}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        <div>Lorem ipsum</div>
                            <div className="oneMockTab">dolor sit</div>
                                <div className="twoMockTabs">amet consectetur</div><br />

                        <div >adipisicing elit.</div>
                            <div className="oneMockTab">Maxime mollitia</div>
                                <div className="twoMockTabs">...</div>
                    </RadioButton>
                    Eingerückt, 3er Gruppen
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type5"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textLeft dontMarkText"}
                                    name={"ColumnType"}
                                    value={5}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        <div>Lorem ipsum</div>
                            <div className="oneMockTab">dolor sit</div>
                                <div className="twoMockTabs">amet consectetur</div>
                                    <div className="threeMockTabs">adipisicing elit</div><br />

                            <div>Maxime mollitia</div>
                                <div className="oneMockTab">...</div>
                    </RadioButton>
                    Eingerückt, 4er Gruppen
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type6"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="dontMarkText"
                                    name={"ColumnType"}
                                    value={6}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        <table className="mockTable">
                            <tbody>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">Lorem ipsum dolor</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">sit amet consectetur</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">adipisicing elit. Maxime</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">molestiae quas vel</td>
                                </tr>
                                <tr>
                                    <td>...</td>
                                </tr>
                            </tbody>
                        </table>
                    </RadioButton>
                    Tabelle 1 Spalte
                </div>
                
                <div className="radioContainer textCenter">
                    <RadioButton id={"Type7"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="dontMarkText"
                                    name={"ColumnType"}
                                    value={7}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        <table className="mockTable">
                            <tbody>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellTwoCols">Lorem ipsum</td>
                                    <td className="mockCell mockCellTwoCols">dolor sit</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellTwoCols">amet consectetur</td>
                                    <td className="mockCell mockCellTwoCols">adipisicing elit.</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellTwoCols">Maxime molestiae</td>
                                    <td className="mockCell mockCellTwoCols">quas vel</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellTwoCols">sint commodi</td>
                                    <td className="mockCell mockCellTwoCols">repudiandae consequuntur</td>
                                </tr>
                                <tr>
                                    <td>...</td>
                                </tr>
                            </tbody>
                        </table>
                    </RadioButton>
                    Tabelle 2 Spalten
                </div>

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type8"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName="dontMarkText"
                                    name={"ColumnType"}
                                    value={8}
                                    radioGroupValue={columnType}
                                    handleSelect={handleSelect}
                                    checkedBackgroundColor="rgb(240, 240, 240)"
                                    hoverBackgroundColor="rgb(245, 245, 245)"
                                    >
                        <table className="mockTable">
                            <tbody>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">Lorem</td>
                                    <td className="mockCell mockCellThreeCols">ipsum  </td>
                                    <td className="mockCell mockCellThreeCols">dolor</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">sit</td>
                                    <td className="mockCell mockCellThreeCols">amet</td>
                                    <td className="mockCell mockCellThreeCols">consectetur </td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">adipisicing</td>
                                    <td className="mockCell mockCellThreeCols">elit.</td>
                                    <td className="mockCell mockCellThreeCols">Maxime</td>
                                </tr>
                                <tr className="mockRow">
                                    <td className="mockCell mockCellThreeCols">molestiae </td>
                                    <td className="mockCell mockCellThreeCols">quas</td>
                                    <td className="mockCell mockCellThreeCols">vel</td>
                                </tr>
                                <tr>
                                    <td>...</td>
                                </tr>
                            </tbody>
                        </table>
                    </RadioButton>
                    Tabelle 3 Spalten
                </div>
            </div>

            {/* TODO: focus on submit */}
            <div className="footer flexRight">
                <button className="blackButton blackButtonContained buttonMedium hidePopUp"
                        onClick={props.handleSubmit}>
                    OK
                </button>
            </div>
        </div>
    )
}