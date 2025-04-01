import React, { useState, useRef, useEffect } from "react";
import "./tryon.css";

const Tryon = () => {
  const [userImage, setUserImage] = useState(null);
  const [processedImages, setProcessedImages] = useState([]);
  const [isCaptured, setIsCaptured] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [processingError, setProcessingError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraError(null);
        setIsCaptured(false);
        setUserImage(null);
        setProcessedImages([]);
        setProcessingError(null);
      }
    } catch (error) {
      setCameraError("Camera access denied. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleStartTryOn = () => {
    setIsTryOnActive(true);
    startCamera();
  };

  const handleStopTryOn = () => {
    setIsTryOnActive(false);
    stopCamera();
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !video.srcObject) {
      setCameraError("Error: Camera not initialised.");
      return;
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setUserImage(imageData);
    setIsCaptured(true);
    stopCamera();
    sendImageToServer(imageData);
  };

  const sendImageToServer = async (imageData) => {
    try {
      const response = await fetch("http://localhost:5000/process_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setProcessedImages(data.processed_images);
        setProcessingError(null);
      } else {
        setProcessedImages([]);
        setProcessingError(data.error || "Failed to process image.");
      }
    } catch (error) {
      setProcessedImages([]);
      setProcessingError("Error connecting to server. Please try again.");
      console.error("Error connecting to server:", error);
    }
  };

  return (
    <div className="tryon-container">
      {/* ✅ Page Title */}
      <header className="tryon-header">
        <h1>Vision Vogue Try-On</h1>
        <p>Capture your image and see how different glasses look on you.</p>
      </header>

      {/* ✅ Error Messages */}
      <div className="error-container">
        {cameraError && (
          <div className="error-message">
            <p>{cameraError}</p>
            <button onClick={startCamera}>Retry Camera</button>
          </div>
        )}

        {processingError && (
          <div className="error-message">
            <p>{processingError}</p>
            <button onClick={handleStartTryOn}>Try Again</button>
          </div>
        )}
      </div>

      {/* ✅ Button Controls */}
      <div className="tryon-buttons">
        {!isTryOnActive ? (
          <button className="start-btn" onClick={handleStartTryOn}>Start Try-On</button>
        ) : (
          <button className="stop-btn" onClick={handleStopTryOn}>Stop Try-On</button>
        )}
      </div>

      {/* ✅ Camera Section */}
      {isTryOnActive && (
        <div className="camera-container">
          <div className="camera-preview">
            <video ref={videoRef} autoPlay playsInline className="live-video" />
            <button className="capture-btn" onClick={capturePhoto}>Take Photo</button>
          </div>
        </div>
      )}

      {/* ✅ Captured Image Section */}
      {isCaptured && userImage && (
        <div className="captured-container">
          <h3>Your Captured Photo</h3>
          <p className="success-message">Photo captured successfully!</p>
         <div className="captured-display">
          <img src={userImage} alt="Captured Face" className="captured-image" />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* ✅ Glasses Display */}
      {processedImages.length > 0 && (
        <div className="glasses-container">
          <h3>Try Different Glasses</h3>
          <div className="glasses-display">
            <div className="glasses-grid">
              {processedImages.map((item, index) => (
                <div key={index} className="glasses-preview-card">
                  <img src={`data:image/png;base64,${item.image}`} alt={item.glasses} className="captured-preview" />
                  <p>{item.glasses}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tryon;