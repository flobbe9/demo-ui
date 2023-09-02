import React, { useEffect, useState } from "react";
import "../styles/Document.css";
import Page from "./Page";


// increase this if an "add page" feature should come up
let pageCount = 2;


export function getPageCount(): number {

    return pageCount;
}


export function setPageCount(newPageCount: number): void {

    pageCount = newPageCount;
}


// IDEA: consider adding / removing pages
export default function Document(props) {

    const [pageCountState, setPageCountState] = useState(1);


    useEffect(() => {
        setPageCount(pageCountState + 1);
    }, [pageCountState]);

    
    return (
        <div className="Document">
            <Page pageNumber={1} />

            <Page pageNumber={2} />
        </div>
    );
}