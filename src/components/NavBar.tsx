import React, { useEffect } from "react";
import "../assets/styles/NavBar.css"
import { Link } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "../utils/Utils";
import LoadingButton from "./helpers/Button";
import { isMobileWidth } from "../utils/GlobalVariables";


export default function NavBar(props) {
    
    const id = props.id ? "NavBar" + props.id : "NavBar";
    const className = props.className ? "NavBar " + props.className : "NavBar";

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
        <div id={id} className={className}>
            <div className="navSectionLeft textLeft flexLeft">
                <Link className="navLink" to="/">
                    <img className="navImage dontMarkText" src="/favicon.png" alt="" height="60px" width="65px"/>
                    <span className="navHeading ml-0 ml-sm-3">DocumentBuilder</span>
                </Link>
            </div>

            <div className="navSectionCenter textCenter flexCenter">
                {/* Insert current file name here */}
            </div>

            <div className="navSectionRight textRight">
                <i className="navMenuIcon fa fa-bars fa-lg hidden dontHideNavSectionRightMobile" onClick={handleClickMenuIcon}></i>
                {/* TODO: add functionality */}
                <div className="navSectionRightDesktop">
                    <LoadingButton 
                                id={"Register"}
                                boxStyle={{
                                    backgroundColor: "transparent", 
                                    border: "1px solid black", 
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