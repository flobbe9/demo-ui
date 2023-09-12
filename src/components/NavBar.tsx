import React from "react";
import "./styles/NavBar.css"
import LinkConfirm from "./LinkConfirm";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";


export default function NavBar(props) {

    return (
        <div className="NavBar">

                <div className="text-left">
                    <Link className="navLink" to="/">
                        <img src="/favicon.png" alt="" height="60px" width="65px"/>
                        <span className="navHeading">DocumentBuilder</span>
                    </Link>
                </div>

                <div className="text-right">
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