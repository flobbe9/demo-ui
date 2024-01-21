const subtlePopupTypeNames = ["Error", "Warn", "Info", "Success"] as const;

/** Type a SubtlePopup can have. Will define it's design */
export type SubtlePopupType = "Error" | "Warn" | "Info" | "Success";


/**
 * @param str to check for it's type
 * @returns true if given str is of type {@link SubtlePopupType}
 */
export function isSubtlePopupType(str: string | SubtlePopupType): boolean {

    for (let subtlePopupTypeName of subtlePopupTypeNames) {
        if (subtlePopupTypeName === str)
            return true;
    }

    return false;
}