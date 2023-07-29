import React from "react";
import "./styles/NavBar.css"
import { Link } from "react-router-dom";

export default function NavBar(props) {

    return (
        <div className="NavBar">

                <div className="text-left">
                    <Link to="/" className="navItem">Left</Link>
                    <Link to="/" className="navItem">Left2</Link>
                </div>

                <div className="text-right">
                    Right
                </div>

        </div>
    );
}