export function logError(error: ApiExceptionFormat) {
    console.log(error.error + ": " + error.message);
}


/**
 * Copy of backend object, named the same.
 * 
 * @since 0.0.1
 */
interface ApiExceptionFormat {
    status: number,
    error: string,
    message: string,
    path: string
}