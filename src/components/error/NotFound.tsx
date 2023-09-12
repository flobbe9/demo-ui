import React from "react";
import "../styles/NotFound.css";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";


/**
 * Fallback component for 404 errors.
 * 
 * @since 0.0.1
 */
export default function NotFound(props) {
    
    return (
        <div className="NotFound">
            <h1>404</h1>
            <h3>This page does not exist...</h3> <br />

            <div>
                <LoadingButton className="blackButton blackButtonContained" variant="contained">
                    <Link className="backToHomePage" to="/">Zurück zur Startseite</Link>
                </LoadingButton>
            </div>
        </div>
    )
}