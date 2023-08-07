import React from "react";
import "./styles/NavBar.css"
import LinkConfirm from "./LinkConfirm";


export default function NavBar(props) {

    return (
        <div className="NavBar">

                <div className="text-left">
                    <LinkConfirm to="/" className="navItem">Left</LinkConfirm>
                    <LinkConfirm to="/" className="navItem">Left2</LinkConfirm>
                </div>

                <div className="text-right">
                    Right
                </div>

        </div>
    );
}