import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Page Title */}
      <h1>VisionVogue</h1>

      {/* Content Sections */}
      <div className="about-content">
        {/* Left Section - About Us */}
        <div className="text-box">
          <div className="section-header">About Us</div>
          <p>
            At VisionVogue, we revolutionise eyewear shopping with AI-powered AR technology.
            Our mission is to provide a seamless virtual try-on experience, helping customers find
            the perfect fit online. We bridge the gap between physical and digital shopping, ensuring
            accuracy, convenience, and confidence in every purchase.
          </p>
          <p>
            Our cutting-edge technology enables users to see how different frames look on their face
            in real-time, enhancing engagement. Whether you’re looking for prescription glasses,
            sunglasses, or fashion frames, our AI-powered tool ensures a personalized shopping experience.
          </p>
          <p>
            With advanced facial recognition and machine learning, our system offers precise
            recommendations tailored to individual preferences. We work with leading eyewear brands
            to deliver high-quality virtual fittings that match your style and comfort.
          </p>
        </div>

        {/* Right Section - Why Choose Us */}
        <div className="text-box">
          <div className="section-header">Why Choose Us?</div>
          <ul>
            <li>• Real-time AI Try-On for accurate frame positioning.</li>
            <li>• Seamless E-commerce Integration for easy adoption.</li>
            <li>• Personalised Recommendations powered by machine learning.</li>
            <li>• Enhanced User Confidence with realistic virtual fittings.</li>
            <li>• Trusted by Leading Eyewear Brands worldwide.</li>
            <li>• No need for physical trials—shop confidently from home.</li>
          </ul>
        </div>
      </div>
      </div>
  );
};

export default About;