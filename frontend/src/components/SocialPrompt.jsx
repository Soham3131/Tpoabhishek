// import React from "react";
// import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
// import "./SocialPopup.css";

// export default function SocialPopup({ onClose }) {
//   return (
//     <div className="popup-overlay">
//       <div className="popup-box">
//         <button className="popup-close" onClick={onClose}>
//           ✖
//         </button>
//         <h2 className="popup-title">
//           <span role="img" aria-label="megaphone">📢</span>
//           Stay Connected with <span className="highlight">TPO Abhishek!</span>
//         </h2>
//         <p className="popup-text">
//           Follow us on Instagram, WhatsApp, and Facebook for placement updates, tips, 
//           and exclusive content we post regularly for your career growth.
//         </p>

//         <div className="popup-buttons">
//           <a href="https://www.instagram.com/tpo_abhishek/profilecard/?igsh=MWRmcTM0Z2R0OWJhNw==" target="_blank" rel="noreferrer" className="popup-btn insta">
//             <FaInstagram className="icon-animate big-hover" /> Join Instagram
//           </a>
//           <a href="https://whatsapp.com/channel/0029VbAnx634tRrrGdYf822d" target="_blank" rel="noreferrer" className="popup-btn whatsapp">
//             <FaWhatsapp className="icon-animate big-hover" /> Join WhatsApp
//           </a>
//           <a href="https://www.facebook.com/profile.php?id=61579307909311&mibextid=ZbWKwL" target="_blank" rel="noreferrer" className="popup-btn facebook">
//             <FaFacebook className="icon-animate big-hover" /> Join Facebook
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
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
          <a href="https://www.instagram.com/tpo_abhishek/profilecard/?igsh=MWRmcTM0Z2R0OWJhNw==" target="_blank" rel="noreferrer" className="popup-btn insta">
            <FaInstagram className="icon-animate" /> Join Instagram
          </a>
          <a href="https://whatsapp.com/channel/0029VbAnx634tRrrGdYf822d" target="_blank" rel="noreferrer" className="popup-btn whatsapp">
            <FaWhatsapp className="icon-animate" /> Join WhatsApp
          </a>
          <a href="https://www.facebook.com/profile.php?id=61579307909311&mibextid=ZbWKwL" target="_blank" rel="noreferrer" className="popup-btn facebook">
            <FaFacebook className="icon-animate" /> Join Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
