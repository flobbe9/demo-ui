import React from "react";
import { isBlank, logWarn } from "./basicUtils";


/**
 * @param id to find in html document
 * @returns a JQuery with all matching elements or null if no results
 */
export function getJQueryElementById(id: string): JQuery | null {

    // case: blank
    if (isBlank(id)) {
        logWarn("id blank: " + id);
        return null;
    }

    const element = $("#"  + id);

    // case: not present
    if (!element.length) {
        logWarn("falsy id: " + id);
        return null;
    }

    return element;
}