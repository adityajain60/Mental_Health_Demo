import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import Signup from "./components/SignUp";
import TherapyChat from "./components/TherapyChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/chat" element={<TherapyChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
