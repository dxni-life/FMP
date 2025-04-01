import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./Home.css";

const sampleImage = require("../images/girl-wearing-glasses.png");

const Home = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="home-container">
      {/* Header Section */}
      <h1>Welcome to <span className="brand">VisionVogue</span></h1>

      {/* Subtitle */}
      <p className="intro-text">
        <em>Experience AI-Powered Virtual Try-On</em>
      </p>

      <div className="full-width-box">
        <p>
          Step into the future of eyewear shopping with VisionVogue's AI-driven AR technology.
          We bring you a seamless, interactive way to try on glasses online—no need to visit a store!
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="main-content">
        {/* Left Side - Text Sections */}
        <div className="text-section">
          {/* What We Offer Section */}
          <h2><em>What We Offer</em></h2>
          <div className="description-box">
            <ul>
              <li> <b>Instant Virtual Try-On:</b> See how different frames look in real-time.</li>
              <li> <b>Smart AI Recommendations:</b> Get personalised frame suggestions.</li>
              <li> <b>Smooth Integration:</b> Easily add our tool to your e-commerce platform.</li>
            </ul>
          </div>

          {/* Why VisionVogue? */}
          <h2><em>Why VisionVogue?</em></h2>
          <div className="description-box">
            <p>
              We go beyond simple virtual try-ons. VisionVogue's AI technology learns from your
              facial features and preferences to recommend the best frames for you. No more guessing—
              just a perfect fit every time!
            </p>
            <ul>
              <li>Works with all major eyewear brands.</li>
              <li>No special hardware needed—just your device's camera.</li>
              <li>Designed for both prescription glasses & fashion frames.</li>
              <li>Backed by cutting-edge AI and machine learning.</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Try It Now Section */}
        <div className="try-now-container">
          <h3><em>Try in Real time now!</em></h3>
          <p className="try-text">
            Discover how VisionVogue can enhance your eyewear shopping experience.
            Click below to explore our AI-powered virtual try-on.
          </p>

          {/* Image & Button Box */}
          <div className="try-now-box">
            <div className="image-box">
              <img src={sampleImage} alt="Person wearing glasses" />
            </div>

            {/* Button to Navigate to /demo */}
            <button className="tryon-button" onClick={() => navigate("/demo")}>
               Try On
            </button> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;