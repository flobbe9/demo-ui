import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/LoadingButton.css";
import { isBooleanFalsy, log } from "../../utils/Utils";


export default function LoadingButton(props: {
    id: string,
    color: string,
    backgroundColor: string,
    hoverBackgroundColor: string,
    clickBackgroundColor: string,
    border?: string,
    width?: string,
    padding?: string,
    handleClick?: () => Promise<any>,
    disabled?: boolean,
    rendered?: boolean,
    className?: string
    children?,
    style?
}) {

    const id = props.id ? "LoadingButton" + props.id : "LoadingButton";

    const [rendered, setRendered] = useState(isBooleanFalsy(props.rendered) ? true : props.rendered);
    const [disabled, setDisabled] = useState(isBooleanFalsy(props.disabled) ? false : props.disabled);
    const [className, setClassName] = useState("LoadingButton");


    useEffect(() => {
        if (props.className)
            appendClassName(props.className);

        if (!rendered)
            appendClassName("hidden");

        if (disabled)
            appendClassName("disabledButton");
    }, [])


    // set styles
    useEffect(() => {
        const thisButton = $("#" + id);
        const children = $("#loadingButtonChildren" + props.id);
        const overlay = $("#loadingButtonOverlay" + props.id);

        // button
        thisButton.css("backgroundColor", props.backgroundColor);
        if (props.border)
            thisButton.css("border", props.border);
        handleHover();

        // children
        children.css("color", props.color);
        if (props.width)
            children.css("width", props.width);

        if (props.padding)
            children.css("padding", props.padding);

        // overlay
        overlay.css("color", props.color);
        overlay.css("backgroundColor", props.clickBackgroundColor);
        if (props.width)
            overlay.css("width", props.width);

        if (props.padding)
            overlay.css("padding", props.padding);
    }, []);


    useEffect(() => {
        handleRender(props.rendered);

    }, [props.rendered]);

    useEffect(() => {
        handleRender(rendered);

    }, [rendered]);


    useEffect(() => {
        handleDisabled(props.disabled);

    }, [props.disabled]);


    useEffect(() => {
        handleDisabled(disabled);

    }, [disabled])
    

    async function handleClick(event): Promise<void> {

        animateOverlay();

        if (props.handleClick && !disabled) {
            setDisabled(true);
            const children = $("#loadingButtonChildren" + props.id);
            children.children().remove();
            children.append(createSpinner())
            await props.handleClick();
            setDisabled(false);
        }
    }


    // TODO: spinner does not work
    function createSpinner(): HTMLElement {

        const spinner = document.createElement("i");
        spinner.className = "fa-solid fa-spinner-third";

        return spinner;
    }


    function handleDisabled(disabled: boolean | undefined): void {

        // case: prop not set
        if (isBooleanFalsy(disabled))
            return;

        setDisabled(disabled);

        toggleClassName("disabledButton", disabled!);
    }


    function handleRender(rendered: boolean | undefined): void {

        // case: prop not set
        if (isBooleanFalsy(rendered))
            return;

        setRendered(rendered);

        toggleClassName("hidden", rendered!);
    }


    function handleHover(): void {

        // TODO: does not work
        if (disabled)
            return;

        const thisButton = $("#" + id);
        
        thisButton.on("mouseover", () => thisButton.css("backgroundColor", props.hoverBackgroundColor));
        thisButton.on("mouseout", () => thisButton.css("backgroundColor", props.backgroundColor))
    }


    function animateOverlay(): void {

        const overlay = $("#loadingButtonOverlay" + props.id);

        overlay.hide();
        overlay.animate({width: "toggle", opacity: 0.3}, 100, "swing", 
            () => overlay.fadeOut(200, "swing"));
    }

    
    function appendClassName(clazzName: string): void {

        setClassName(className + " " + clazzName);
    }


    function removeClassName(clazzName: string): void {

        setClassName(className.replace(clazzName, ""));
    }

    
    function toggleClassName(clazzName: string, addClazz: boolean): void {

        addClazz ? appendClassName(clazzName) : removeClassName(clazzName);
    }
    

    return (
        <button id={id} 
                className={className}
                style={props.style}
                disabled={disabled} 
                onClick={handleClick}>
            {/* hidden */}
            <div id={"loadingButtonOverlay" + props.id} className="loadingButtonOverlay loadingButtonChildren">{props.children}</div>

            {/* visible */}
            <div id={"loadingButtonChildren" + props.id} className="loadingButtonChildren">{props.children}</div>
        </button>
    )
}