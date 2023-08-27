import React from "react";
import HeaderFooter from "./HeaderFooter";
import "../styles/Page.css";
import PageColumn from "./PageColumn";


// TODO: print method expects last column to be of type "page1"
export default function Page(props: {
    pageNumber: number
}) {

    return (
        <div className="Page">
            <HeaderFooter id={"headerFooter-" + props.pageNumber} type="header" placeholder="Kopfzeile..." />

            <div className="displayFlex">
                <PageColumn columnPosition="left" />

                <PageColumn columnPosition="right" />
            </div>

            <HeaderFooter id={"headerFooter-" + props.pageNumber} type="footer" placeholder="Fußzeile..." />
        </div>
    );
}