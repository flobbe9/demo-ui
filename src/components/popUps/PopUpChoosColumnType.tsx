import React, { useContext, useEffect, useState } from "react";
import "../../assets/styles/PopUpChooseColumnType.css";
import RadioButton from "../helpers/RadioButton";
import { AppContext } from "../../App";
import { ColumnContext } from "../Column";
import { hidePopUp, log } from "../../utils/Utils";


// TODO: escape key does not work
export default function PopUpChooseColumnType(props:{
    handleSelect,
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


    function handleKeyDown(event): void {

        // TODO: this does not work
        if (event.key === "Enter") {
            props.handleSubmit();
            hidePopUp(appContext.setPopUpContent);
        }
    }

    return (
        <div id={id} className={className} style={props.style}>
            <div className="header flexRight">
                <img src={"closeX.png"} alt="close icon" className="smallIconButton hidePopUp"/>
            </div>

            <div className="body">
                <span className="flexCenter popUpHeading">Spalten Muster</span>
                <br />

                <div className="radioContainer textCenter">
                    <RadioButton id={"Type1"} 
                                    className="flexCenter"
                                    labelClassName={"whiteButton " + orientationClassName}
                                    childrenClassName={"textLeft"}
                                    name={"ColumnType"} 
                                    handleSelect={() => props.handleSelect(1)}>
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
                                    childrenClassName={"textCenter"}
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(2)}>
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
                                    childrenClassName={"textRight"}
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(3)}>
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
                                    childrenClassName={"textLeft"}
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(4)}>
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
                                    childrenClassName={"textLeft"}
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(5)}>
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
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(6)}>
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
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(7)}>
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
                                    name={"ColumnType"}
                                    handleSelect={() => props.handleSelect(8)}>
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

            {/* TODO: disable button if nothing is selected */}
            {/* TODO: submit on enter */}
            <div className="footer flexRight">
                <button id="prevButton"
                        className="slideButton slideRightButton blackButton blackButtonContained buttonSmall hidePopUp"
                        onClick={props.handleSubmit}>
                    OK
                </button>
            </div>
        </div>
    )
}