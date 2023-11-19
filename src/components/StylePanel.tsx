import React, { useContext, useEffect } from "react";
import "../assets/styles/StylePanel.css";
import { log } from "../utils/Utils";
import { AppContext } from "../App";
import StylePanelSection from "./StylePanelSection";
import RadioButton from "./helpers/RadioButton";
import Checkbox from "./helpers/Checkbox";
import Select from "./helpers/Select";
import ColorPicker from "./helpers/ColorPicker";


export default function StylePanel(props) {

    const id = props.id ? "StylePanel" + props.id : "StylePanel";
    const className = props.className ? "StylePanel " + props.className : "StylePanel";


    function handleColorSelect(color: string): void {

        $("#ColorPickerStylePanelColor .colorChildren").css("color", color);
    }


    return (
        <div id={id} className={className}>
            <div className="sectionContainer flexLeft">
                <StylePanelSection buttonContainerClassName="flexCenter" hideRightBorder={false}>
                    <Checkbox id="Bold"><strong>F</strong></Checkbox>
                    <Checkbox id="Underline"><u>U</u></Checkbox>
                    <Checkbox id="Italic"><i>K</i></Checkbox>

                    <Select id="FontFamily" width="150px" >
                        <option value="Arial">Arial</option>
                        <option value="Calibri">Calibri</option>
                        <option value="Donno">Donno</option>
                    </Select>

                    <Select id="FontSize" width={"100px"}>
                        <option value="8">8px</option>
                    </Select>

                    <ColorPicker id="StylePanelColor" handleSelect={(color) => handleColorSelect(color)}>
                        <span>A</span>
                    </ColorPicker>
                </StylePanelSection>
            </div>
        </div>
    )
}