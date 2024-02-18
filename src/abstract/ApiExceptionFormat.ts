/**
import { ApiExceptionFormat } from './ApiExceptionFormat';
 * Copy of backend object, named the same.
 * 
 * @since 0.0.1
 */
export interface ApiExceptionFormat {
    status: number,
    error: string | null,
    message: string,
    path: string
}


/**
 * @param status 
 * @param error 
 * @param message 
 * @param path 
 * @returns {@link ApiExceptionFormat} object with given props
 */
export function getApiExceptionInstance(status: number, error: string | null, message: string, path: string): ApiExceptionFormat {

    return {
        status, 
        error, 
        message, 
        path
    }
}