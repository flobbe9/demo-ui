import React, { useContext, useEffect } from "react";
import Page from "./Page";
import { log } from "../utils/Utils";
import { AppContext } from "../App";


export default function Document(props) {

    const appContext = useContext(AppContext);

    useEffect(() => {
        // TODO: confirm page leave, use PopUp.tsx
    }, []);

    


    return (
        <div id="Document" className="Document">
            <Page />

            <Page />
        </div>
    )
}