import React from "react";
import "./Footer.css";

const Footer = ({ activeTab, setActiveTab }) => {
  return (
    <div className="footer">
      <div className="footer-content">
        {/* Chap tab */}
        <button
          className={`footer-item ${activeTab === "invite" ? "active" : ""}`}
          onClick={() => setActiveTab("invite")}
        >
          <div className="footer-icon invite-icon" />
          <span>Taklif qilish</span>
        </button>

        {/* O'rta tab (home/dashboard) */}
         <button
          className={`footer-item ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <div className="footer-icon profile-icon" />
          <span>Profil</span>
        </button>

        {/* O'ng tab */}
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