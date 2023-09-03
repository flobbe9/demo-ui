import React from "react";
import HeaderFooter from "./HeaderFooter";
import "../styles/Page.css";
import PageColumn from "./PageColumn";


export default function Page(props: {
    pageNumber: number
}) {

    const pageNumber = props.pageNumber;
    

    return (
        <div className="Page">
            <HeaderFooter id={"header-" + pageNumber} type="header" placeholder="Kopfzeile..." />

            <div className="displayFlex">
                <PageColumn pageNumber={pageNumber} columnPosition="left" />

                <PageColumn pageNumber={pageNumber} columnPosition="right" />
            </div>

            <HeaderFooter id={"footer-" + pageNumber} type="footer" placeholder="Fußzeile..."/>

            <div className="pageNumber">{props.pageNumber}</div>
        </div>
    );
}