const popupSizeNames = ["small", "medium", "large", "full"] as const;

/** Defining height or width of a ```<Popup />``` component */
export type PopupSize = typeof popupSizeNames;


/**
 * @param str to check for it's type
 * @returns true if given str is of type {@link PopupSize}.
 */
export function isPopupSize(str: string | PopupSize): boolean {

    for (let popupSizeName of popupSizeNames) {
        if (popupSizeName === str)
            return true;
    }

    return false;
}