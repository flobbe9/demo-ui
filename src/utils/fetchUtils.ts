import { BACKEND_BASE_URL } from "../globalVariables";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { log } from "./basicUtils";


/**
 * Sends an http request using given url, method and body. <p>
 * 
 * Fetch errors will be returned as {@link ApiExceptionFormat}.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @returns a promise with the jsonResopnse
 * @since 0.0.1
 */
export default async function fetchJson(url: string, method = "get", body?, headers?) {
    
    // set headers
    const fetchConfig: RequestInit = {
        method: method,
        headers: getFetchHeaders(headers),
        credentials: "include"
    }

    // case: request has body
    if (body) 
        fetchConfig.body = JSON.stringify(body);

    // send request
    try {
        const response = await fetch(url, fetchConfig);

        return response.json();

    // case: failed to fetch
    } catch(e) {
        return {
            status: 500,
            error: e.name,
            message: e.message,
            path: url.replace(BACKEND_BASE_URL, "")
        };
    }
}


/**
 * Sends an http request using given url, method and body. <p>
 * 
 * Fetch errors will be returned as {@link ApiExceptionFormat}.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @returns a promise with the response
 * @since 0.0.5
 */
export async function fetchAny(url: string, method = "get", body?, headers?) {
    
    // set headers
    const fetchConfig: RequestInit = {
        method: method,
        headers: getFetchHeaders(headers),
        credentials: "include"
    }

    // case: request has body
    if (body) 
        fetchConfig.body = JSON.stringify(body);

    // send request
    try {
        return fetch(url, fetchConfig);

    // case: failed to fetch
    } catch(e) {
        return {
            status: 500,
            error: e.name,
            message: e.message,
            path: url.replace(BACKEND_BASE_URL, "")
        };
    }
}

/**
 * 
 * @param headers json object with strings as keys and values
 * @returns ```headers``` param with ```"Content-Type": "application/json"``` as default content type if none set 
 */
function getFetchHeaders(headers?) {

    const contentType = {"Content-Type": "application/json"};

    if (!headers)
        return contentType;

    if (!headers["Content-Type"])
        Object.assign(headers, contentType)

    return headers;
}