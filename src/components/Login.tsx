import React from "react"
import { BACKEND_BASE_URL } from "../utils/GlobalVariables"
import { LoadingButton } from "@mui/lab";
import "./styles/Login.css";



export default function Login(props) {

    return (
        <div className="Login">
            <form className="form-signin" method="post" action={BACKEND_BASE_URL + "/api/user/login"}>
                <h2 className="form-signin-heading">Login</h2>
                <p>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input type="text" id="username" name="username" className="form-control" placeholder="Username" required autoFocus />
                </p>
                <p>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" id="password" name="password" className="form-control" placeholder="Password" required />
                </p>

                <LoadingButton id="loginButton" className="blackButton blackButtonContained" type="submit" variant="contained">
                    Log in
                </LoadingButton>
            </form>
        </div>
    );
}