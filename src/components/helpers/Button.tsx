import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/Button.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isBooleanFalsy, log } from "../../utils/basicUtils";


/**
 * Custom button. Stylable through props.
 * If ```props.handlePromise()``` is defined a loading animation will be displayed on click.
 * 
 * @since 0.0.5
 */
export default function Button(props: {
    id: string,

    hoverBackgroundColor?: string,
    clickBackgroundColor?: string,
    boxStyle?: React.CSSProperties,
    childrenStyle?: React.CSSProperties,
    focusStyle?: React.CSSProperties,

    className?: string,
    childrenClassName?: string,
    handlePromise?: (event) => Promise<any>,
    onClick?: (event) => void,
    disabled?: boolean,
    rendered?: boolean,
    children?,
    title?: string
    /** button type, default is "button" */
    type?: "submit" | "button" | "reset",
    /** focus button when this prop changes and is true */
    focus?: boolean
}) {

    const id = "Button" + (props.id || "Button");
    const className = "Button " + (props.className || "");

    const [rendered, setRendered] = useState(isBooleanFalsy(props.rendered) ? true : props.rendered);
    const [disabled, setDisabled] = useState(isBooleanFalsy(props.disabled) ? false : props.disabled);
    const [initialBackgroundColor, setInitialBackgroundColor] = useState("");

    const [children, setChildren] = useState(props.children || <></>);

    const buttonRef = useRef(null);
    const buttonChildrenRef = useRef(null);
    const buttonOverlayRef = useRef(null);


    useEffect(() => {
        $(buttonOverlayRef.current!).css("backgroundColor", props.clickBackgroundColor || "transparent");

        setInitialBackgroundColor($(buttonRef.current!).css("backgroundColor"));
    }, [])


    useEffect(() => {
        updateRendered(props.rendered);

    }, [props.rendered]);


    useEffect(() => {
        updateDisabled(props.disabled);

    }, [props.disabled]);


    useEffect(() => {
        if (props.focus) 
            $(buttonRef.current!).trigger("focus");
        
    }, [props.focus])


    /**
     * Wont do anything if button is disabled. Animates click and promise callback if present or if not present normal 
     * click callback (promise callback is prioritised). Will never call both.
     */
    function handleClick(event): void {

        if (disabled)
            return;
        
        // case: loading button
        if (props.handlePromise) 
            handlePromiseAnimation(event);

        // case: normal button
        else 
            animateOverlay();
        
        if (props.onClick)
            props.onClick(event);
    }


    /**
     * Add spinner icon and remove button content, await promise ```props.handlePromise```, then reset button styles. <p>
     * 
     * Button will be disabled during promise call.
     * 
     * @param event that triggered the promise handler
     */
    async function handlePromiseAnimation(event): Promise<void> {

        setDisabled(true);

        const buttonChildren = $(buttonChildrenRef.current!);
        const buttonWidth = buttonChildren.css("width");
        const buttonHeight = buttonChildren.css("height");
        const buttonChildrenContent = children;

        // remove children
        setChildren(<></>);
        // keep size
        buttonChildren.css("width", buttonWidth);
        buttonChildren.css("height", buttonHeight);
        // add spinner
        const spinner = createSpinner()
        buttonChildren.append(spinner);

        await props.handlePromise!(event);

        // remove spinner
        spinner.remove();
        // add back children
        setChildren(buttonChildrenContent);
        
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
    }


    function updateRendered(rendered: boolean | undefined): void {

        // case: prop not set
        if (isBooleanFalsy(rendered))
            return;

        setRendered(rendered);
    }


    function handleMouseOver(event): void {

        if (disabled)
            return;

        $(buttonRef.current!).css("backgroundColor", props.hoverBackgroundColor || initialBackgroundColor);
    }


    function handleMouseOut(event): void {

        $(buttonRef.current!).css("backgroundColor", props.boxStyle?.backgroundColor || initialBackgroundColor)
    }

    function animateOverlay(): void {

        const overlay = $(buttonOverlayRef.current!);

        overlay.hide();

        // animate in three steps
        overlay.animate({opacity: 0.3}, 100, "swing",
            () => overlay.animate({width: "toggle"}, 100, "swing", 
                () => overlay.animate({opacity: 0}, 100, "swing")));
    }

    
    return (
        <button id={id} 
                className={className + (disabled ? " disabledButton" : "") + (rendered ? "" : " hidden")}
                style={{...props.boxStyle}}
                ref={buttonRef}
                disabled={disabled} 
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                title={props.title}
                type={(props.type || "button")}
                >
            {/* hidden */}
            <div className={"buttonOverlay buttonChildren " + (props.childrenClassName || "")} ref={buttonOverlayRef} style={props.childrenStyle}>
                <div className="hiddenChildren">{children}</div>
            </div>

            {/* visible */}
            <div className={"buttonChildren dontMarkText " + (props.childrenClassName || "")} ref={buttonChildrenRef} style={props.childrenStyle}>
                {children}
            </div>
        </button>
    )
}