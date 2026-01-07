import React, { useMemo } from "react";
import "./profile.css";
import { useTelegram } from "../../../context/TelegramContext";

const Profile = ({ onClose }) => {
  const { user, apiUser, loading } = useTelegram();

  // 🖼 AVATAR – har doim hook chaqiriladi
  const avatar = useMemo(() => {
    if (
      user?.photo_url &&
      typeof user.photo_url === "string" &&
      user.photo_url.startsWith("http")
    ) {
      return user.photo_url;
    }
    return "/avatar.png";
  }, [user?.photo_url]);

  // 👤 FULL NAME
  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "Foydalanuvchi";

  // 👤 USERNAME (context formatiga mos)
  const username = user?.username
    ? user.username.startsWith("@")
      ? user.username
      : `@${user.username}`
    : "@no_username";

  // 💰 BALANCE
  const balance = loading ? "..." : Number(apiUser?.balance || 0);

  // ❗ JSX ichida tekshiramiz
  if (!user) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div
        className="profile-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="profile-close" onClick={onClose}>
          ×
        </button>

        <div className="profile-header">
          <img
            src={avatar}
            alt="avatar"
            className="profile-avatar"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "/avatar.png";
            }}
          />

          <h2>{fullName}</h2>
          <p>{username}</p>
        </div>

        <div className="profile-list">
         

          <div className="profile-item">
            <span>Balans</span>
            <strong>{balance} ⭐</strong>
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
