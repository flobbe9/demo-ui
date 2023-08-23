import { BACKEND_BASE_URL } from "../GlobalVariables";


/**
 * Sends an http request using given url, method and body. <p>
 * 
 * Fetch errors will be returned as {@link ApiExceptionFormat}.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param contentType accepted by the request
 * @returns a promise with the jsonResopnse
 * @since 0.0.1
 */
export default async function sendHttpRequest(url: string, method = "get", body?, contentType = "application/json") {
    // set headers
    const fetchHeader: FetchHeader = {
        method: method,
        headers: {
            "Content-Type": contentType
        }
    }

    // case: request has body
    if (body) 
        fetchHeader.body = JSON.stringify(body);

    try {
        // send request
        const response = await fetch(url, fetchHeader);

        return await response.json();

    // case: failed to fetch
    } catch(e) {
        const prettyResponse: ApiExceptionFormat = {
            status: 500,
            error: e.name,
            message: e.message,
            path: url.replace(BACKEND_BASE_URL, "")
        };

        return prettyResponse;
    }
}


interface FetchHeader {
    method: string,
    headers: {
        "Content-Type": string,
    },
    body?: any
}


export interface ApiExceptionFormat {
    status: number,
    error: string,
    message: string,
    path: string
}