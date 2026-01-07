import React from "react";
import "./profile.css";
import { useTelegram } from "../../../context/TelegramContext";

const Profile = ({ onClose }) => {
  const { user, apiUser } = useTelegram();

  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Foydalanuvchi";

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close */}
        <button className="profile-close" onClick={onClose}>×</button>

        {/* 👤 AVATAR */}
        <div className="profile-header">
          <img
            src={user?.photo_url || "/avatar.png"}
            alt="avatar"
            className="profile-avatar"
          />
          <h2>{fullName}</h2>
          <p>{user?.username || "no_username"}</p>
        </div>

        {/* 📋 INFO LIST */}
        <div className="profile-list">
          <div className="profile-item">
            <span>ID</span>
            <strong>{user?.id}</strong>
          </div>

          <div className="profile-item">
            <span>Balans</span>
            <strong>{apiUser?.balance || 0} ⭐</strong>
          </div>

          <div className="profile-item">
            <span>Til</span>
            <strong>O‘zbekcha</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
