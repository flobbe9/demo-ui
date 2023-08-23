import React, { useState } from "react";
import { BasicParagraphContext } from "./Document";
import HeaderFooter from "./HeaderFooter";
import BasicParagraph from "./BasicParagraph";


/**
 * "textInput" refers to any text input on a page. <p>
 * "basicParagraph" refers to a normal text input from the array, thus not beeing a header, footer, style or table text input.
 * @param props 
 * @returns 
*/
export default function Page(props) {

    const pageType: string = props.pageType;

    const initialKey = crypto.randomUUID();
    
    /** Initial basicParagraph array */
    const [basicParagraphs, setBasicParagraphs] = useState([<BasicParagraph id={"basicParagraph-" + pageType + "-" + 1} key={initialKey} propsKey={initialKey} pageType={pageType}/>]);
    

    return (
        <div className="Page">
            <div className={pageType}>
                <BasicParagraphContext.Provider value={{basicParagraphs: basicParagraphs, setBasicParagraphs: setBasicParagraphs}}>
                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 0} type="header" placeholder="Kopfzeile..." />

                    {basicParagraphs}

                    <HeaderFooter id={"headerFooter-" + pageType + "-" + 2} type="footer" placeholder="Fußzeile..." />
                </BasicParagraphContext.Provider>
            </div>
        </div>
    )
}