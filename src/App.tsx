import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Index from "./components/Index";
import DocumentBuilderForm from "./components/DocumentBuilderForm";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";


export default function App() {

    return (
        <div className="App">
            <BrowserRouter>

                <NavBar />

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/builder" element={<DocumentBuilderForm />} /> */}
                    </Routes>
                </div>

                <Footer />

            </BrowserRouter>
        </div>
    );
}