// Footer.jsx – react-icons bilan
import React from "react";
import "./Footer.css";

import { MdStorefront } from "react-icons/md";
import { FiHome, FiUser, FiUserPlus } from "react-icons/fi";

const Footer = ({
  activeSection,
  onHomeClick,
  onMarketClick,
  onInviteClick,
  onProfileClick,
}) => {
  return (
    <div className="footer">
      <div className="footer-content">

        {/* 🔗 Taklif */}
        <button
          className={`footer-item ${activeSection === "invite" ? "active" : ""}`}
          onClick={onInviteClick}
        >
          <FiUserPlus className="footer-icon" />
          <span>Taklif</span>
        </button>

        {/* 🏠 Asosiy */}
        <button
          className={`footer-item ${activeSection === "home" ? "active" : ""}`}
          onClick={onHomeClick}
        >
          <FiHome className="footer-icon" />
          <span>Asosiy</span>
        </button>

        {/* 🏪 Market */}
        <button
          className={`footer-item ${activeSection === "market" ? "active" : ""}`}
          onClick={onMarketClick}
        >
          <MdStorefront className="footer-icon" />
          <span>Market</span>
        </button>

        {/* 👤 Profil */}
        <button
          className={`footer-item ${activeSection === "profile" ? "active" : ""}`}
          onClick={onProfileClick}
        >
          <FiUser className="footer-icon" />
          <span>Profil</span>
        </button>

      </div>
    </div>
  );
};

export default Footer;
