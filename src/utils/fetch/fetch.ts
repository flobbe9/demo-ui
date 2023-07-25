import { FetchHeader, isFetchHeaderValid } from "./FetchHeader.ts";


// TODO: replace alerts
/**
 * Sends an http request using given url, method and body.
 * Handles falsy headers and fetch errors by alerting at the moment.
 * 
 * @param url to send the request to
 * @param method for the request to use (like "get", "post"...)
 * @param body (optional) to add to the request
 * @param contentType accepted by the request
 * @returns a promise with the jsonResopnse
 * @since 0.0.1
 */
export default async function sendHttpRequest(url: string, method: string, body?, contentType: string = "application/json") {
    // set headers
    const fetchHeader: FetchHeader = {
        method: method,
        headers: {
            "Content-Type": contentType
        }
    }
    if (body) fetchHeader.body = JSON.stringify(body);

    // case: headers invalid
    if (!isFetchHeaderValid(fetchHeader) || !url) {
        alert("Falsy FetchHeader.");
        return;
    }

    try {
        // send request
        const response = await fetch(url, fetchHeader);

        // return response as json
        return await response.json();

    // case: failed to fetch
    } catch(e) {
        alert(e);
    }
}
