// Header.jsx
import React from "react";
import "./Header.css";
import { useTelegram } from "../../../../context/TelegramContext.jsx";

const Header = ({ isPremium, setIsPremium, onOpenMoney, onOpenLang }) => {
  const { apiUser, loading } = useTelegram();
  const balance = loading ? "..." : apiUser?.balance || "0";

  return (
    <header className="header">
      <div className="top-bar">

        {/* 🌐 LANGUAGE */}
        <div className="globe-icon" onClick={onOpenLang}>
          🌐
        </div>

        {/* 🔥 TOGGLE */}
        <div className="toggle-switch" onClick={() => setIsPremium(!isPremium)}>
          <div className="switch-track">
            <span className="switch-label">Stars</span>
            <span className="switch-label">Premium</span>

            <div className={`switch-thumb ${isPremium ? "right" : "left"}`}>
              <span className="thumb-text">
                {isPremium ? "Premium" : "Stars"}
              </span>
            </div>
          </div>
        </div>

        {/* 💰 BALANCE */}
        <div className="balance-plus-btn" onClick={onOpenMoney}>
          <span className="balance-text">{balance}</span>
          <span className="plus-icon">+</span>
        </div>

      </div>
    </header>
  );
};

export default Header;
