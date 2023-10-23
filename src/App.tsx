import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Document from "./components/Document";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


export default function App() {

    // use this when backend login is implemented (https://www.baeldung.com/spring-security-csrf)
    // const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Document />} />
                        {/* <Route path="/login" element={<Login />} /> */}
                        {/* <Route path="/confirmAccount" element={<AccountConfirmed />} /> */}
                        {/* <Route path="*" element={<NotFound />} /> */}
                    </Routes>
                </div>

                <Footer />
            </BrowserRouter>
        </div>
    );
}