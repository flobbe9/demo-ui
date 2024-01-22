interface PopupSizeNames {
    small: string,
    medium: string,
    large: string,
    full: string
}

const example: PopupSizeNames = {
    small: "",
    medium: "",
    large: "",
    full: ""
}

/** Defining height or width of a ```<Popup />``` component */
export type PopupSize = keyof PopupSizeNames;


/**
 * @param str to check for it's type
 * @returns true if given str is of type {@link PopupSize}.
 */
export function isPopupSize(str: any): boolean {

    const result = Object.keys(example).filter(key => key === str);

    return Boolean(result.length);
}