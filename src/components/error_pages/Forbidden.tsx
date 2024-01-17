import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/ErrorPages.css";


/**
 * Page handling http 403.
 * 
 * @since 0.0.5
 */
export default function Forbidden(props: {
    id?: string,
    className?: string,
    style?,
    children?
}) {

    const id = "Forbidden" + (props.id || "");
    const className = "Forbidden " + (props.className || "");

    return (
        <div id={id} className={className + " textCenter"}>
            <h1 className="mt-5">403</h1>

            <p>Deine Berechtigungen reichen nicht aus, um auf diese Seite zuzugreifen.</p>

            <Link className="link" to="/">Zurück zum Dokument</Link>
        </div>
    )
}