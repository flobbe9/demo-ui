
/**
 * Class defining a simple csrf token that can be sent with http requests for security.
 * 
 * @since 0.0.8
 */
export default class CsrfToken {

    /** Randomly generated string retrieved from backend. Default is ```""```. Can be sent as request header value to backend. See headerName for key. */
    token: string;
    /** Key of the request header when sending the token to backend */
    headerName: string;


    constructor(headerName: string, token = "") {

        this.token = token;
        this.headerName = headerName;
    }

    setToken(token: string) {

        this.token = token;
    }

    getToken() {

        return this.token;
    }

    setHeaderName(headerName: string) {

        this.headerName = headerName;
    }

    getHeaderName() {

        return this.headerName;
    }
}