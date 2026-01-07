import React, { useMemo, useState } from "react";
import "./profile.css";
import { useTelegram } from "../../../context/TelegramContext";
import UserModal from "../../components/pages/UserModal/UserModal"; // 🔥 PATHNI TEKSHIR

const Profile = ({ onClose }) => {
  const { user, apiUser, loading } = useTelegram();

  // 🔥 UserModal state
  const [openHistory, setOpenHistory] = useState(false);

  // 🖼 AVATAR
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

  const fullName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "Foydalanuvchi";

  const username = user?.username
    ? user.username.startsWith("@")
      ? user.username
      : `@${user.username}`
    : "@no_username";

  const balance = loading ? "..." : Number(apiUser?.balance || 0);

  if (!user) return null;

  return (
    <>
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

          {/* 🔥 TRANZAKSIYALAR TARIXI TUGMASI */}
          <button
            className="profile-history-btn"
            onClick={() => setOpenHistory(true)}
          >
            📜 Tranzaksiyalar tarixi
          </button>
        </div>
      </div>

      {/* 🔥 USER MODAL */}
      {openHistory && (
        <UserModal onClose={() => setOpenHistory(false)} />
      )}
    </>
  );
};

export default Profile;
