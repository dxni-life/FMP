import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Demo from "./pages/Demo";
import TryOn from "./pages/tryon"; // ✅ Added Try-On page
import Login from "./auth/Login"; 

function App() {
  // Check if the user is already authenticated (saved token in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));

  return (
    <Router>
      {/* ✅ Navbar is only shown when the user is authenticated */}
      {isAuthenticated && <Navbar onAuthChange={setIsAuthenticated} />}

      <Routes>
        {/* ✅ Login Page (redirects to Home if already logged in) */}
        <Route path="/login" element={!isAuthenticated ? <Login onAuthChange={setIsAuthenticated} /> : <Navigate to="/" />} />

        {/* ✅ Protected Routes (Only accessible if authenticated) */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
        <Route path="/demo" element={isAuthenticated ? <Demo /> : <Navigate to="/login" />} />
        <Route path="/tryon" element={isAuthenticated ? <TryOn /> : <Navigate to="/login" />} />

        {/* ✅ Redirect unknown routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;