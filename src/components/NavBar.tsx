import React, { useEffect, useContext, useRef, useState } from "react";
import "../assets/styles/NavBar.css"
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, moveCursor } from "../utils/basicUtils";
import LoadingButton from "./helpers/Button";
import { WEBSITE_NAME, BUILDER_PATH, DOCUMENT_SUFFIX, isMobileWidth } from "../globalVariables";
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


    return (
        <div id={id} className={className + " dontMarkText flex"}>
            <div className="col-4 navSectionLeft textLeft flexLeft">
                <Link className="navLink" to="/">
                    <img className="navImage dontMarkText" src="/favicon.png" alt="" height="60px" width="65px"/>
                    <span className="navHeading ml-0 ml-sm-3">{WEBSITE_NAME}</span>
                </Link>
            </div>

            <div className={"col-4 navSectionCenter textCenter " + flexClass}>
                <LeaveConfirmLink className="navLink" to="/menu" pathsToConfirm={[BUILDER_PATH]}>
                    <span>Menu</span>
                </LeaveConfirmLink>
            </div>

            <div className="col-4 navSectionRight textRight">
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
                                rendered={false}
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
                                rendered={false}
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