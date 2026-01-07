import React from "react";
import "./Footer.css";

const Footer = ({ activeTab, setActiveTab, onInviteClick }) => {
  return (
    <div className="footer">
      <div className="footer-content">
        {/* Chap tab - Taklif qilish */}
        <button
          className={`footer-item ${activeTab === "invite" ? "active" : ""}`}
          onClick={onInviteClick}  // Bu endi ishlaydi
        >
          <div className="footer-icon invite-icon" />
          <span>Taklif qilish</span>
        </button>

        {/* O'rta tab - Asosiy */}
         <button
          className={`footer-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="footer-icon profile-icon" />
          <span>Profil</span>
        </button>

        {/* O'ng tab - Profil */}
        <button
          className={`footer-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="footer-icon profile-icon" />
          <span>Profil</span>
        </button>
      </div>
    </div>
  );
};

export default Footer;