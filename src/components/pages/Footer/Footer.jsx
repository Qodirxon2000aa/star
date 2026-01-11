// Footer.jsx – To'g'ri active holat bilan
import React from "react";
import "./Footer.css";

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
        {/* 🔗 Taklif qilish */}
        <button
          className={`footer-item ${activeSection === "home" ? "active" : ""}`}
          onClick={onInviteClick}
        >
          <div className="footer-icon invite-icon" />
          <span>Taklif qilish</span>
        </button>

        {/* 🏠 Asosiy (Stars / Premium) */}
        <button
          className={`footer-item ${activeSection === "home" ? "active" : ""}`}
          onClick={onHomeClick}
        >
          <div className="footer-icon home-icon" /> {/* ikonani moslashtiring */}
          <span>Asosiy</span>
        </button>

        {/* 🏪 Market */}
        <button
          className={`footer-item ${activeSection === "market" ? "active" : ""}`}
          onClick={onMarketClick}
        >
          <div className="footer-icon market-icon" /> {/* ikonani moslashtiring */}
          <span>Market</span>
        </button>

        {/* 👤 Profil (agar footerda bo'lsa) */}
        <button
          className={`footer-item ${activeSection === "profile" ? "active" : ""}`}
          onClick={onProfileClick}
        >
          <div className="footer-icon profile-icon" />
          <span>Profil</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;