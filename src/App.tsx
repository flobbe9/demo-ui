import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import DocumentBuilder from "./components/documentBuilder/DocumentBuilder";
import NotFound from "./components/error/NotFound";


export default function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />

                <div className="content">
                    <Routes>
                        <Route path="/" element={<DocumentBuilder />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                <Footer />
            </BrowserRouter>
        </div>
    );
}