export interface FetchHeader {
    method: string,
    headers: {
        "Content-Type": string,
    },
    body?: any
}


export function isFetchHeaderValid(fetchHeader: FetchHeader): boolean {

    let isValid = true;

    Object.entries(fetchHeader).forEach(([key, value]) => {
        if (!key || !value)
            isValid = false;
    });

    return isValid;
}