import React, { useEffect } from "react";
import "../assets/styles/NavBar.css"
import LinkConfirm from "./LinkConfirm";
import { LoadingButton } from "@mui/lab";
import { Link, useParams } from "react-router-dom";
import { log } from "../utils/Utils";


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
                        <img src="/favicon.png" alt="" height="60px" width="65px"/>
                        <span className="navHeading">DocumentBuilder</span>
                    </Link>
                </div>

                <div className="textRight flexRight">
                    <LoadingButton disabled={true} className="blackButton blackButtonOutlined navButton" variant="outlined">
                        Registrieren
                    </LoadingButton>

                    <LoadingButton disabled={true} className="blackButton blackButtonContained navButton" variant="contained" >
                        <LinkConfirm id="loginButton" to="/login" className="navLink">Login</LinkConfirm>
                    </LoadingButton>
                </div>
        </div>
    );
}