import React, { useEffect, useContext, useState } from "react";
import "../assets/styles/NavBar.css"
import { Link } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, moveCursor } from "../utils/basicUtils";
import LoadingButton from "./helpers/Button";
import { WEBSITE_NAME, BUILDER_PATH, isMobileWidth } from "../globalVariables";
import { AppContext } from "./App";
import LeaveConfirmLink from "./helpers/LeaveConfirmLink";


/**
 * @since 0.0.1
 */
export default function NavBar(props: {
    id?: string,
    className?: string
}) {
    
    const id = "NavBar" + (props.id || "");
    const className = "NavBar " + (props.className || "");

    const appContext = useContext(AppContext);
    
    const [isMobileView, setIsMobileView] = useState(appContext.isWindowWidthTooSmall());


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

    }, []);

    
    function handleClickMenuIcon(event): void {

        $(".navSectionRightMobile").slideToggle(200);
    }

    async function handleClickMobileItem(event): Promise<void> {

        let mobileItem = $(event.target)

        // case: selected child
        if (!event.target.className.includes("navSectionRightMobileItem"))
            mobileItem = mobileItem.parent(".navSectionRightMobileItem");

        const initBackgroundColor = mobileItem.css("backgroundColor")
        const initColor = mobileItem.css("color");

        mobileItem.animate({
            backgroundColor: "#ffe4c4", // bisque
            color: "black"
        }, 150, () => {
            mobileItem.animate({
                backgroundColor: initBackgroundColor,
                color: initColor
            }, 150);
        });
    }


    return (
        <div id={id} className={className + " dontMarkText"}>
            <div className="boxShadowContainer flexCenter">
                <div className="col-7 col-sm-4 navSectionLeft textLeft flexLeft">
                    <Link className="navLink" to="/">
                        <img className="navImage dontMarkText mr-2" src="/favicon.png" alt="" height="40" width="40"/>
                        <span className="navHeading dontBreakText">{WEBSITE_NAME}</span>
                    </Link>
                </div>

                <div className={"col-1 col-sm-4 navSectionCenter flexLeft"}>
                    <div className={"" + (isMobileView && "hidden")}>
                        {/* <LeaveConfirmLink className="navLink" to="/home" pathsToConfirm={[BUILDER_PATH]}>
                            Home
                        </LeaveConfirmLink> */}
                    </div>
                </div>

                <div className="col-4 col-sm-4 navSectionRight textRight" style={{position: "relative"}}>
                    
                    {/* TODO: add functionality */}
                    {/* desktop mode */}
                    <div className={"navSectionRightDesktop " + (isMobileView && "hidden")}>
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
                    {/* mobile mode*/}
                    <i className={"navMenuIcon fa fa-bars fa-lg dontHideNavSectionRightMobile hover " + (!isMobileView && "hidden")} onClick={handleClickMenuIcon}></i>
                    <div className="navSectionRightMobile hidden textLeft dontHideNavSectionRightMobile boxShadowDark">
                        <div id="navSectionRightMobileItem-1" 
                            className="navSectionRightMobileItem dontMarkText dontHideNavSectionRightMobile" 
                            onClick={handleClickMobileItem}
                            >
                            Register
                        </div>

                        <div id="navSectionRightMobileItem-2" 
                            className="navSectionRightMobileItem dontMarkText dontHideNavSectionRightMobile" 
                            onClick={handleClickMobileItem}
                            >
                            Login
                        </div>

                        <div id="navSectionRightMobileItem-3" 
                            className="navSectionRightMobileItem dontMarkText dontHideNavSectionRightMobile" 
                            onClick={handleClickMobileItem}
                            >
                            <LeaveConfirmLink className="blackLink dontHideNavSectionRightMobile" 
                                            to="/home" 
                                            pathsToConfirm={["/"]}
                                            style={{width: "100%"}}
                                            >
                                Home
                            </LeaveConfirmLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}