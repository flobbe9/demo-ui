import React, { useEffect, useContext, useRef, useState } from "react";
import "../assets/styles/NavBar.css"
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, moveCursor } from "../utils/Utils";
import LoadingButton from "./helpers/Button";
import { BUILDER_PATH, DOCUMENT_SUFFIX, isMobileWidth } from "../utils/GlobalVariables";
import { AppContext } from "./App";
import LeaveConfirmLink from "./LeaveConfirmLink";


/**
 * @since 0.0.1
 */
export default function NavBar(props) {
    
    const id = props.id ? "NavBar" + props.id : "NavBar";
    const className = props.className ? "NavBar " + props.className : "NavBar";

    const [flexClass, setFlexClass] = useState("flexCenter");

    const location = useLocation();

    const appContext = useContext(AppContext);
    const fileNameInputRef = useRef(null);


    useEffect(() => {
        if (isMobileWidth()) {
            // hide buttons inside mobile menu
            $(".navSectionRightDesktop").hide();
            $(".navMenuIcon").removeClass("hidden");

            // change width relations
            $(".navSectionLeft").css("width", "45%");
            $(".navSectionCenter").css("width", "45%");
            $(".navSectionRight").css("width", "10%");
        }

        if (appContext.isWindowWidthTooSmall())
            setFlexClass("flexLeft");
    }, []);

    
    function handleClickMenuIcon(event): void {

        $(".navSectionRightMobile").slideToggle(200);
    }

    async function handleClickMobileItem(event): Promise<void> {

        const mobileItem = $(event.target)
        const initBackgroundColor = mobileItem.css("backgroundColor")
        const initColor = mobileItem.css("color");
        mobileItem.animate({
            backgroundColor: "#ffe4c4", // bisque
            color: "black"
        }, 100, () => {
            mobileItem.animate({
                backgroundColor: initBackgroundColor,
                color: initColor
            });
        });
    }


    /**
     * Move cursor in front of ```.docx``` suffix if was not focused.
     * 
     * @param event 
     */
    function handleFileNameInputMouseDown(event): void {

        const value = event.target.value;
        let valueLength: number;

        // case: invalid file name
        if (!value || (valueLength = value.length) < 5)
            return;

        const input = $(fileNameInputRef.current!);

        // case: not focused yet
        // if (!input.is(":focus")) {
        //     event.preventDefault();

        //     input.trigger("focus");
        //     moveCursor(event.target.id, valueLength - 5, valueLength - 5);
        // }
    }


    function handleFileNameKeyUp(event): void {

        const input = $(fileNameInputRef.current!);
        let inputValue: string;

        if (!input || !(inputValue = input.prop("value")))  
            return;

        inputValue = adjustDocumentFileName(inputValue);

        appContext.setDocumentFileName(inputValue);
    }


    /**
     * Append {@link DOCUMENT_SUFFIX} if last chars dont match it.
     * 
     * @param documentFileName to adjust
     * @returns fixed document file name (not altering givn param)
     */
    function adjustDocumentFileName(documentFileName: string): string {

        let fileName = documentFileName.trim();

        fileName = fileName.replaceAll(" ", "_");

        const suffix = fileName.substring(fileName.length - 5);

        if (suffix !== DOCUMENT_SUFFIX)
            fileName += DOCUMENT_SUFFIX;

        return fileName;
    }


    return (
        <div id={id} className={className + " dontMarkText"}>
            <div className="navSectionLeft textLeft flexLeft">
                <LeaveConfirmLink className="navLink" to="/" pathsToConfirm={[BUILDER_PATH]}>
                    <img className="navImage dontMarkText" src="/favicon.png" alt="" height="60px" width="65px"/>
                    <span className="navHeading ml-0 ml-sm-3">DocumentBuilder</span>
                </LeaveConfirmLink>
            </div>

            <div className={"navSectionCenter textCenter " + flexClass}>
                <input id="fileNameInput"
                       className={"fileNameInput" + (location.pathname === BUILDER_PATH ? "" : " hidden")} 
                       ref={fileNameInputRef}
                       type="text" 
                       defaultValue={appContext.documentFileName}
                       onMouseDown={handleFileNameInputMouseDown}
                       onKeyUp={handleFileNameKeyUp}
                       />
            </div>

            <div className="navSectionRight textRight">
                <i className="navMenuIcon fa fa-bars fa-lg hidden dontHideNavSectionRightMobile" onClick={handleClickMenuIcon}></i>
                {/* TODO: add functionality */}
                <div className="navSectionRightDesktop">
                    <LoadingButton 
                                id={"Register"}
                                boxStyle={{
                                    backgroundColor: "transparent", 
                                    border: "1px solid grey", 
                                    marginRight: "15px", 
                                }}
                                hoverBackgroundColor={"rgb(255, 238, 214)"} 
                                clickBackgroundColor={"rgb(180, 180, 180)"}
                                disabled={true}
                                >
                        Registrieren
                    </LoadingButton>
                                
                    <LoadingButton 
                                id={"Login"}
                                boxStyle={{
                                    backgroundColor: "black",
                                    color: "bisque", 
                                }}
                                childrenStyle={{width: "100px"}}
                                hoverBackgroundColor={"rgb(60, 60, 60)"} 
                                clickBackgroundColor={"rgb(200, 200, 200)"}
                                disabled={true}
                                >
                        Login
                    </LoadingButton>
                </div>

                {/* TODO: add functionality */}
                {/* mobile menu */}
                <div className="navSectionRightMobile hidden textLeft dontHideNavSectionRightMobile">
                    <div id="navSectionRightMobileItem-1" 
                         className="navSectionRightMobileItem dontMarkText dontHideNavSectionRightMobile" 
                         onClick={handleClickMobileItem}>
                        Register
                    </div>

                    <div id="navSectionRightMobileItem-2" className="navSectionRightMobileItem dontMarkText dontHideNavSectionRightMobile" onClick={handleClickMobileItem}>
                        Login
                    </div>
                </div>
            </div>
        </div>
    );
}