import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/LoadingButton.css";
import { isBooleanFalsy, log } from "../../utils/Utils";


export default function LoadingButton(props: {
    id: string,
    color: string,
    backgroundColor: string,
    hoverBackgroundColor: string,
    clickBackgroundColor: string,
    width?: string,
    padding?: string,
    handleClick?,
    disabled?: boolean,
    rendered?: boolean,
    className?: string
    children?,
    style?
}) {

    const id = props.id ? "LoadingButton" + props.id : "LoadingButton";
    const className = props.className ? "LoadingButton " + props.className : "LoadingButton";

    const [rendered, setRendered] = useState(isBooleanFalsy(props.rendered) ? true : props.rendered);
    const [disabled, setDisabled] = useState(isBooleanFalsy(props.disabled) ? false : props.disabled);


    // set styles
    useEffect(() => {
        const thisButton = $("#" + id);
        const children = $("#loadingButtonChildren" + props.id);
        const overlay = $("#loadingButtonOverlay" + props.id);

        // button
        thisButton.css("backgroundColor", props.backgroundColor);
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


    // rendered
    useEffect(() => {
        handleRender();

    }, [props.rendered]);


    // disabled
    useEffect(() => {
        setDisabled(props.disabled);

    }, [props.disabled]);


    // submit
    function handleClick(event): void {

        animateOverlay();

        if (props.handleClick && !disabled)
            props.handleClick();
    }


    function handleRender(): void {

        const thisButton = $("#" + id);

        if (!isBooleanFalsy(props.rendered))
            setRendered(props.rendered);

        // update class
        if (!rendered)
            thisButton.addClass("hidden");
        else
            thisButton.removeClass("hidden");
    }


    function handleHover(): void {

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
    

    return (
        <button id={id} 
                className={className + (rendered ? "" : " hidden")}
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