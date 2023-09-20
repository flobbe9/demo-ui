import React, { useEffect } from "react";
import "./styles/AccountConfirmed.css"; 
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import sendHttpRequest from "../utils/fetch/fetch";
import { USER_SERVICE_BASE_URL } from "../utils/GlobalVariables";


// TOOD: offer resend button if confirmation failed for some reason
// TODO: case: token expired, case: token confirmed already
// TODO: add login button instead of back to homepage?
// TODO: improove logging?
// TODO: secure params
// TODO: too much loggin in backend
export default function AccountConfirmed(props) {

    useEffect(() => {
        // TODO: pending icon
        sendConfirmationRequest();
    }, []);

    return (
        <div className="AccountConfirmed">
            <h2>Account bestätigt</h2><br />

            <LoadingButton className="blackButton blackButtonContained" variant="contained">
                <Link id="buttonLink" to="/">Zurück zur Startseite</Link>
            </LoadingButton>
        </div>
    );
}


/**
 * Send confirmation request to backend using params from current url.
 */
async function sendConfirmationRequest(): Promise<void> {

    // get params
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const token = params.get("token");

    if (!email || !token) {
        console.log("Failed to confirm account. Falsy params.");
        return;
    }

    // confirm account
    const jsonResponse = await sendHttpRequest(USER_SERVICE_BASE_URL + "/api/appUser/confirmAccount?email=" + email + "&token=" + token);

    if (jsonResponse.status !== 200)
        console.log(jsonResponse.error + ": " + jsonResponse.message);
}