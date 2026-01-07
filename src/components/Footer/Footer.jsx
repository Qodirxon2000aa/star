import React, { useState } from "react";
import "./Footer.css";

const Footer = ({ activeTab, setActiveTab, onInviteClick }) => {
  const [showSoon, setShowSoon] = useState(false);

  const handleSoon = () => {
    setShowSoon(true);
    setTimeout(() => setShowSoon(false), 2000); // 2 soniyada yopiladi
  };

  return (
    <>
      <div className="footer">
        <div className="footer-content">

          {/* 🔗 Taklif qilish */}
          <button
            className={`footer-item ${activeTab === "invite" ? "active" : ""}`}
            onClick={onInviteClick}
          >
            <div className="footer-icon invite-icon" />
            <span>Taklif qilish</span>
          </button>

          {/* ⭐ Asosiy (Tez kunda) */}
          <button
            className="footer-item"
            onClick={handleSoon}
          >
            <div className="footer-icon soon-icon" />
            <span>Asosiy</span>
          </button>

          {/* 👤 Profil */}
          <button
            className={`footer-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <div className="footer-icon profile-icon" />
            <span>Profil</span>
          </button>

        </div>
      </div>

      {/* 🔔 Animatsiyali alert */}
      {showSoon && (
        <div className="soon-alert">
          🚀 Tez kunda
        </div>
      )}
    </>
  );
};

export default Footer;
