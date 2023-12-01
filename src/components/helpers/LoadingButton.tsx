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
    handlePromise?: () => Promise<any>,
    handleClick?,
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

    const buttonRef = useRef(null);
    const buttonChildrenRef = useRef(null);
    const buttonOverlayRef = useRef(null);


    useEffect(() => {
        initStyles();

        initClassNames();

    }, [])


    useEffect(() => {
        updateRendered(props.rendered);

    }, [props.rendered]);


    useEffect(() => {
        updateRendered(rendered);

    }, [rendered]);


    useEffect(() => {
        updateDisabled(props.disabled);

    }, [props.disabled]);


    useEffect(() => {
        updateDisabled(disabled);

    }, [disabled]);


    function initClassNames(): void {

        if (props.className)
            appendClassName(props.className);

        if (!rendered)
            appendClassName("hidden");

        if (disabled)
            appendClassName("disabledButton");
    }

    
    function initStyles(): void {

        const button = $(buttonRef.current!);
        const children = $(buttonChildrenRef.current!);
        const overlay = $(buttonOverlayRef.current!);

        button.css("backgroundColor", props.backgroundColor);
        button.css("border", props.border || "");

        children.css("color", props.color);
        children.css("width", props.width || "");
        children.css("padding", props.padding || "");

        overlay.css("color", props.color);
        overlay.css("backgroundColor", props.clickBackgroundColor);
        overlay.css("width", props.width || "");
        overlay.css("padding", props.padding || "");
    }


    /**
     * Wont do anything if button is disabled. Animates click and promise callback if present or if not present normal 
     * click callback (promise callback is prioritised). Will never call both.
     */
    function handleClick(event): void {

        if (disabled)
            return;
        
        animateOverlay();

        // case: loading button
        if (props.handlePromise) 
            handlePromiseAnimation();
        
        // case: normal button
        else if (props.handleClick)
            props.handleClick();
    }


    /**
     * Add spinner icon and remove button content, await promise ```props.handlePromise```, then reset button styles. <p>
     * 
     * Button will be disabled during promise call.
     */
    async function handlePromiseAnimation(): Promise<void> {

        setDisabled(true);

        const buttonChildren = $(buttonChildrenRef.current!);
        const buttonWidth = buttonChildren.css("width");
        const buttonHeight = buttonChildren.css("height");
        const buttonText = buttonChildren.text();

        // remove children
        buttonChildren.text("");
        // keep size
        buttonChildren.css("width", buttonWidth);
        buttonChildren.css("height", buttonHeight);
        // add spinner
        const spinner = createSpinner()
        buttonChildren.append(spinner);

        await props.handlePromise!();

        // remove spinner
        spinner.remove();
        // add back children
        buttonChildren.text(buttonText);
        
        setDisabled(false);
    }


    function createSpinner(): HTMLElement {

        const spinner = document.createElement("i");
        spinner.className = "fa-solid fa-circle-notch rotating";

        return spinner;
    }


    function updateDisabled(disabled: boolean | undefined): void {

        // case: prop not set
        if (isBooleanFalsy(disabled))
            return;

        setDisabled(disabled);

        toggleClassName("disabledButton", disabled!);
    }


    function updateRendered(rendered: boolean | undefined): void {

        // case: prop not set
        if (isBooleanFalsy(rendered))
            return;

        setRendered(rendered);

        toggleClassName("hidden", rendered!);
    }


    function handleMouseOver(event): void {

        if (disabled)
            return;

        $(buttonRef).css("backgroundColor", props.hoverBackgroundColor)
    }


    function handleMouseOut(event): void {

        $(buttonRef).css("backgroundColor", props.backgroundColor)
    }


    // TODO: doe not work properly on first click
    function animateOverlay(): void {

        const overlay = $(buttonOverlayRef.current!);

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

    
    function toggleClassName(clazzName: string, isAdd: boolean): void {

        isAdd ? appendClassName(clazzName) : removeClassName(clazzName);
    }
    

    return (
        <button id={id} 
                className={className}
                ref={buttonRef}
                style={props.style}
                disabled={disabled} 
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}>
            {/* hidden */}
            <div className="loadingButtonOverlay loadingButtonChildren" ref={buttonOverlayRef}
                 >
                    {props.children}</div>

            {/* visible */}
            <div className="loadingButtonChildren" ref={buttonChildrenRef}
                 >
                {props.children}
            </div>
        </button>
    )
}