import React, { useEffect, useState } from "react";
import "../assets/styles/NavBar.css"
import { Link, useParams } from "react-router-dom";
import { log } from "../utils/Utils";
import LoadingButton from "./helpers/LoadingButton";


export default function NavBar(props) {
    
    const id = props.id ? "NavBar" + props.id : "NavBar";
    const className = props.className ? "NavBar " + props.className : "NavBar";

    useEffect(() => {
        // TODO: make button with navlink menu for mobile, use condition $(window).width()
    }, [])

    return (
        <div id={id} className={className + " flexCenter"}>
                <div className="textLeft flexLeft">
                    <Link className="navLink" to="/">
                        <img className="dontMarkText" src="/favicon.png" alt="" height="60px" width="65px"/>
                        <span className="navHeading">DocumentBuilder</span>
                    </Link>
                </div>

                <div className="textRight flexRight">
                    <LoadingButton 
                                id={"Register"}
                                style={{marginRight: "5px"}}
                                color={"white"} 
                                backgroundColor={"black"} 
                                hoverBackgroundColor={"rgb(60, 60, 60)"} 
                                clickBackgroundColor={"rgb(200, 200, 200)"}
                                padding="5px 15px"
                                >
                        Registrieren
                    </LoadingButton>

                    <LoadingButton 
                                id={"Login"}
                                color={"white"} 
                                backgroundColor={"black"} 
                                hoverBackgroundColor={"rgb(60, 60, 60)"} 
                                clickBackgroundColor={"rgb(200, 200, 200)"}
                                padding="5px 15px"
                                >
                        Login
                    </LoadingButton>
                </div>
        </div>
    );
}