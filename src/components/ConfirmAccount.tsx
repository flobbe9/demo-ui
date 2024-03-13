import React, { useEffect, useState } from "react";
import "../assets/styles/ConfirmAccount.css";
import { useSearchParams } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log, logApiResponse } from "../utils/basicUtils";
import { CONFIRMATION_TOKEN_PARAM_NAME, USER_SERVICE_BASE_URL } from "../globalVariables";
import fetchJson, { isHttpStatusCodeAlright } from "../utils/fetchUtils";
import { ApiExceptionFormat } from "../abstract/ApiExceptionFormat";


/**
 * Page handling confirm user account action.
 * 
 * @since 0.1.1
 */
// TODO: add some kind of pending animation while response status is not set yet
// TODO: automatically login if 200
export default function ConfirmAccount(props: {
    id?: string,
    className?: string,
    style?: React.CSSProperties
}) {

    const id = "ConfirmAccount" + (props.id || "");
    const className = "ConfirmAccount " + (props.className || "");

    const [searchParams, setSearchParams] = useSearchParams();
    const [confirmationToken, setConfirmationToken] = useState("");
    const [responseStatus, setResponseStatus] = useState<string | number>("");


    useEffect(() => {
        setConfirmationToken(searchParams.get(CONFIRMATION_TOKEN_PARAM_NAME) || "");

    }, []);


    useEffect(() => {
        confirmAccount();

    }, [confirmationToken]);


    async function confirmAccount(): Promise<void> {

        if (!confirmationToken)
            return;

        const jsonResponse = await fetchConfirmAccount();

        if (isHttpStatusCodeAlright(jsonResponse.status))
            setResponseStatus(jsonResponse.status);

        else
            setResponseStatus((jsonResponse as ApiExceptionFormat).message);
    }


    async function fetchConfirmAccount(): Promise<Response | ApiExceptionFormat> {

        const url = USER_SERVICE_BASE_URL + "/confirmAccount?" + CONFIRMATION_TOKEN_PARAM_NAME + "=" + confirmationToken;

        return await fetchJson(url, "post");
    }

    return (
        <div id={id}
            className={className}
            style={{...props.style}}
            >
            <h1>Thank you... back to home</h1>

            <p>Status: {responseStatus}</p>
        </div>
    );
}