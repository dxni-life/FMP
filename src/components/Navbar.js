import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onAuthChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onAuthChange) { 
      onAuthChange(false);
      localStorage.removeItem("access_token"); 
      navigate("/login"); 
    } else {
      console.error("Error: onAuthChange is undefined.");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">VisionVogue</div>

      {/* Navigation Links */}
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/demo">Real Time Demo</Link></li>
        <li><Link to="/tryon">3D Try On</Link></li> 
      </ul>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </nav>
  );
};

export default Navbar;