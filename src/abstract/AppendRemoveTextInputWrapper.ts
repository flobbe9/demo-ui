export interface AppendRemoveTextInputWrapper {
    /** column ids of columns to append text inputs to  */
    columnIds: Set<string>,
    /** num text inputs to append */
    num: number,
}


export function getDefaultAppendRemoveTextInputWrapper(): AppendRemoveTextInputWrapper {

    return {
        columnIds: new Set(),
        num: 0,
    }
}