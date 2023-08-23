import React from "react";
import "../styles/NotFound.css";
import { Link } from "react-router-dom";


/**
 * Fallback component for 404 errors.
 * 
 * @since 0.0.1
 */
export default function NotFound(props) {
    
    return (
        <div className="NotFound">
            <h1>404</h1>
            <h3>Diese Seite gibt es nicht...</h3> <br />

            <div>
                {/* TODO: style this button */}
                <button>
                    <Link className="backToHomePage" to="/">Zurück zur Startseite</Link>
                </button>
            </div>
        </div>
    )
}