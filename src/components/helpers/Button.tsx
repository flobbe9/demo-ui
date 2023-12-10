import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/Button.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBooleanFalsy, log } from "../../utils/Utils";


/**
 * 
 * @param props test
 * @returns 
 */
export default function Button(props: {
    id: string,

    hoverBackgroundColor?: string,
    clickBackgroundColor?: string,
    boxStyle?: React.CSSProperties,
    childrenStyle?: React.CSSProperties,

    handlePromise?: () => Promise<any>,
    handleClick?,
    disabled?: boolean,
    rendered?: boolean,
    className?: string
    children?,
    title?: string
}) {

    const id = props.id ? "Button" + props.id : "Button";

    const [rendered, setRendered] = useState(isBooleanFalsy(props.rendered) ? true : props.rendered);
    const [disabled, setDisabled] = useState(isBooleanFalsy(props.disabled) ? false : props.disabled);
    const [className, setClassName] = useState("Button");

    const buttonRef = useRef(null);
    const buttonChildrenRef = useRef(null);
    const buttonOverlayRef = useRef(null);


    useEffect(() => {
        $(buttonOverlayRef.current!).css("backgroundColor", props.clickBackgroundColor || "transparent");

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
            props.handleClick(event);
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

        $(buttonRef.current!).css("backgroundColor", props.hoverBackgroundColor || "white");
    }


    function handleMouseOut(event): void {

        $(buttonRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || "white")
    }


    function animateOverlay(): void {

        const overlay = $(buttonOverlayRef.current!);

        overlay.hide();

        // animate in three steps
        overlay.animate({opacity: 0.3}, 100, "swing",
            () => overlay.animate({width: "toggle"}, 100, "swing", 
                () => overlay.fadeOut(200, "swing")));
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
                style={props.boxStyle}
                ref={buttonRef}
                disabled={disabled} 
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                title={props.title}
                >
            {/* hidden */}
            <div className="buttonOverlay buttonChildren" ref={buttonOverlayRef} style={props.childrenStyle}>
                <div className="hiddenChildren">{props.children}</div>
            </div>

            {/* visible */}
            <div className="buttonChildren" ref={buttonChildrenRef} style={props.childrenStyle}>
                {props.children}
            </div>
        </button>
    )
}