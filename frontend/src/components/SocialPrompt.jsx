import React from "react";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import "./SocialPopup.css";

export default function SocialPopup({ onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="popup-close" onClick={onClose}>
          ✖
        </button>
        <h2 className="popup-title">
          <span role="img" aria-label="megaphone">📢</span>
          Stay Connected with <span className="highlight">TPO Abhishek!</span>
        </h2>
        <p className="popup-text">
          Follow us on Instagram, WhatsApp, and Facebook for placement updates, tips, 
          and exclusive content we post regularly for your career growth.
        </p>

        <div className="popup-buttons">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="popup-btn insta">
            <FaInstagram className="icon-animate big-hover" /> Join Instagram
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="popup-btn whatsapp">
            <FaWhatsapp className="icon-animate big-hover" /> Join WhatsApp
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="popup-btn facebook">
            <FaFacebook className="icon-animate big-hover" /> Join Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
