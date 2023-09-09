import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Index from "./components/Index";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import DocumentBuilder from "./components/documentBuilder/DocumentBuilder";
import NotFound from "./components/error/NotFound";


export default function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <div>0.0.4 latest</div>

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/builder" element={<DocumentBuilder />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                <Footer />
            </BrowserRouter>
        </div>
    );
}