import React, { useState } from "react";
import "./Demo.css";

// Import Glasses Images
import BlackCatEye from "../glasses/black_cat_eye.png";
import BlackRimmed from "../glasses/black_rimmed_sunglasses.png";
import EyeGlasses from "../glasses/silhouette_glasses.png";
import HeartSunglasses from "../glasses/heart_glasses.png";
import BlueAviators from "../glasses/blue_aviator_sunglasses.png";
import GreenAviators from "../glasses/green_sunglasses.png";
import LightBlueRound from "../glasses/lightblue_sunglass.png";
import PinkRound from "../glasses/pink_sunglasses.png";
import RedAviators from "../glasses/red_sunglasses.png";
import BlueSunglasses from "../glasses/blue_sunglasses.png";

// Glasses Options
const glassesOptions = [
  { id: "black-cat-eye", src: BlackCatEye, alt: "Black Cat Eye Glasses", description: "A stylish cat-eye design.", brand: "Vision Vogue", availableColors: { "Black": BlackCatEye } },
  { id: "black-rimmed", src: BlackRimmed, alt: "Black Rimmed Glasses", description: "Classic black-rimmed glasses.", brand: "Vision Vogue", availableColors: { "Black": BlackRimmed } },
  { id: "eye-glasses", src: EyeGlasses, alt: "Round Eye Glasses", description: "Minimalist round glasses.", brand: "Classic Look", availableColors: { "Black": EyeGlasses } },
  //{ id: "round-black", src: RoundBlack, alt: "Round Black Glasses", description: "Thin metal frame glasses.", brand: "Vision Elite", availableColors: { "Black": RoundBlack } },
  { id: "heart-sunglasses", src: HeartSunglasses, alt: "Heart Sunglasses", description: "Fun heart-shaped sunglasses.", brand: "Fashion Trendz", availableColors: { "Pink": HeartSunglasses } },
  { id: "aviator-sunglasses", availableColors: { "Blue": BlueAviators, "Green": GreenAviators, "Red": RedAviators }, alt: "Aviator Sunglasses", description: "Classic aviator sunglasses.", brand: "SunStyle" },
  { id: "round-mirrored", availableColors: { "Blue": BlueSunglasses, "Light Blue": LightBlueRound, "Pink": PinkRound }, alt: "Round Mirrored Glasses", description: "Trendy mirrored sunglasses.", brand: "Urban Vision" }
];

const Demo = () => {
  const [selectedGlasses, setSelectedGlasses] = useState(glassesOptions[0]);
  const [selectedColor, setSelectedColor] = useState(Object.keys(glassesOptions[0].availableColors)[0]);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  const handleGlassesChange = (glassesId) => {
    const newGlasses = glassesOptions.find(g => g.id === glassesId);
    setSelectedGlasses(newGlasses);
    const defaultColor = Object.keys(newGlasses.availableColors)[0];
    setSelectedColor(defaultColor);
    fetchGlasses(newGlasses.id, defaultColor);
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
    fetchGlasses(selectedGlasses.id, newColor);
  };

  const fetchGlasses = (glassesId, color) => {
    fetch("http://localhost:5000/change_glasses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ glasses: glassesId, color: color }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        console.log(`Glasses updated: ${glassesId} (${color})`);
      } else {
        console.error("Error updating glasses:", data.message);
      }
    })
    .catch(error => console.error("Fetch error:", error));
  };

  const handleStartTryOn = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setIsTryOnActive(true);
      })
      .catch(() => {
        setShowPermissionPopup(true);
      });
  };

  const handleStopTryOn = () => {
    setIsTryOnActive(false);
    fetch("http://localhost:5000/video_feed", { method: "GET" }); // Ensure stream stops (optional)
  };

  return (
    <div className="demo-container">
      <h1>Vision Vogue Real-Time Try-On</h1>

      <div className="camera-container">
        <div className="info-panel">
          <h2>How It Works</h2>
          <p>1. Click "Start Try-On" to activate your camera.</p>
          <p>2. Select glasses to try them on in real time.</p>
          <p>3. Click "Stop Try-On" to end.</p>
        </div>

        <div className="camera-placeholder">
          {isTryOnActive ? (
            <img src="http://localhost:5000/video_feed" alt="Live Try-On" className="live-video" />
          ) : (
            <p>Camera Live Feed Will Appear Here</p>
          )}
        </div>

        {selectedGlasses && (
          <div className="glasses-info">
            <h3>{selectedGlasses.brand}</h3>
            <p>{selectedGlasses.description}</p>
            {Object.keys(selectedGlasses.availableColors).length > 1 && (
              <div className="color-selection">
                <label>Select Color:</label>
                <select className="color-dropdown" value={selectedColor} onChange={handleColorChange}>
                  {Object.keys(selectedGlasses.availableColors).map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}
            <img src={selectedGlasses.availableColors[selectedColor]} alt={selectedGlasses.alt} className="glasses-preview" />
          </div>
        )}
      </div>

      <h3>Select Glasses:</h3>
      <div className="glasses-container">
        {glassesOptions.map((glasses) => (
          <img
            key={glasses.id}
            src={Object.values(glasses.availableColors)[0]}
            alt={glasses.alt}
            className={`glasses-image ${selectedGlasses.id === glasses.id ? "selected" : ""}`}
            onClick={() => handleGlassesChange(glasses.id)}
          />
        ))}
      </div>

      <div className="tryon-buttons">
        <button className="start-btn" onClick={handleStartTryOn}>Start Try-On</button>
        <button className="stop-btn" onClick={handleStopTryOn}>Stop Try-On</button>
      </div>

      {showPermissionPopup && (
        <div className="popup">
          <p>⚠️ Camera permission required.</p>
          <button onClick={() => setShowPermissionPopup(false)}>OK</button>
        </div>
      )}
    </div>
  );
};

export default Demo;