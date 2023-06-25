import React from "react";
import { Link } from "react-router-dom";


export default function Index(props) {

    return (
        <div>
            <h2>Index</h2>

            <Link to="/login">Login</Link>
        </div>
    );
}