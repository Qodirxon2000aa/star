import React, { useMemo, useState } from "react";
import "./profile.css";
import { useTelegram } from "../../../context/TelegramContext";
import UserModal from "../../components/pages/UserModal/UserModal";
import Lang from "../pages/Header/Lang";

/* 🔥 SUPPORT CONSTANTS */
const SUPPORT_HELP = "ahdsiz";
const SUPPORT_CHANNEL = "fatih_link";
const SUPPORT_DEV = "behissiyot";

const Profile = ({ onClose }) => {
  const { user, apiUser, loading } = useTelegram();

  const [openHistory, setOpenHistory] = useState(false);
  const [openLang, setOpenLang] = useState(false);

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

  /* 🔥 UNIVERSAL TELEGRAM LINK OPENER */
  const openTelegram = (username) => {
    const tg = window.Telegram?.WebApp;
    const link = `https://t.me/${username}`;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(link);
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile-panel" onClick={(e) => e.stopPropagation()}>
          <button className="profile-close" onClick={onClose}>
            ×
          </button>

          {/* 👤 HEADER */}
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

          {/* 📋 LIST */}
          <div className="profile-list">
            <div className="profile-item">
              <span>Balans</span>
              <strong>{balance} ⭐</strong>
            </div>

            {/* 🌐 LANGUAGE */}
            <div
              className="profile-item clickable"
              onClick={() => setOpenLang(true)}
            >
              <span>Til</span>
              <strong>O‘zbekcha ›</strong>
            </div>

            {/* 🆘 YORDAM */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_HELP)}
            >
              <span>Yordam</span>
              <strong>@{SUPPORT_HELP} ›</strong>
            </div>

            {/* 📢 CHANNEL */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_CHANNEL)}
            >
              <span>Yangiliklar kanali</span>
              <strong>@{SUPPORT_CHANNEL} ›</strong>
            </div>

            {/* 👨‍💻 DEV */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_DEV)}
            >
              <span>Web App yaratuvchisi</span>
              <strong>@{SUPPORT_DEV} ›</strong>
            </div>
          </div>

          {/* 📜 HISTORY */}
          <button
            className="profile-history-btn"
            onClick={() => setOpenHistory(true)}
          >
            📜 Tranzaksiyalar tarixi
          </button>
        </div>
      </div>

      {/* 🔥 MODALS */}
      {openHistory && <UserModal onClose={() => setOpenHistory(false)} />}
      {openLang && <Lang onClose={() => setOpenLang(false)} />}
    </>
  );
};

export default Profile;
