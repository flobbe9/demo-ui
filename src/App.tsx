import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import './App.css';
import Index from "./components/Index";


export default function App() {

    return (
        <div className="App">
            <nav>NavBar</nav><br />
            
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />}/>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}