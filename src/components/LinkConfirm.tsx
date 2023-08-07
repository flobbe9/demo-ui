import React from "react";
import { Link, useLocation } from "react-router-dom";


/**
 * Custom Link. Only difference is the onClick handler, which confirms page leave if user leaves "/builder" path.
 * 
 * @param param0 
 * @returns react-router-dom Link with confirm function on click
 */
export default function LinkConfirm({className, to, children}) {

    const location = useLocation();


    /**
     * Makes user confirm and prevents default event if confirm alert was canceld.
     * 
     * @param event 
     */
    function confirmNavigate(event): void {

        const confirmLeaveMessage = "Seite verlassen? \nVorgenommene Änderungen werden unter Umständen nicht gespeichert."

        if (location.pathname === "/builder" && !window.confirm(confirmLeaveMessage))
            event.preventDefault();
    }

    
    return (
        <Link className={className} to={to} onClick={confirmNavigate}>{children}</Link>
    );
}