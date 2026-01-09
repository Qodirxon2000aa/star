import React, { useMemo, useState } from "react";
import "./profile.css";
import { useTelegram } from "../../../../context/TelegramContext";
import UserModal from "../UserModal/UserModal";
import Lang from "../Header/Lang";

// 🔥 React Icons
import {
  FiGlobe,
  FiHelpCircle,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

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
              onError={(e) => (e.currentTarget.src = "/avatar.png")}
            />
            <h2>{fullName}</h2>
            <p>{username}</p>
          </div>

          {/* 📋 LIST */}
          <div className="profile-list">
            {/* 💰 BALANCE */}
            <div className="profile-item">
              <div className="item-left">
                <div className="item-icon">
                  <FiCreditCard />
                </div>
                <span>Balans</span>
              </div>
              <strong>{balance} ⭐</strong>
            </div>

            {/* 🌐 LANGUAGE */}
            <div
              className="profile-item clickable"
              onClick={() => setOpenLang(true)}
            >
              <div className="item-left">
                <div className="item-icon">
                  <FiGlobe />
                </div>
                <span>Til</span>
              </div>
              <strong>O‘zbekcha ›</strong>
            </div>

            {/* 🆘 SUPPORT */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_HELP)}
            >
              <div className="item-left">
                <div className="item-icon">
                  <FiHelpCircle />
                </div>
                <span>Yordam</span>
              </div>
              <strong>@{SUPPORT_HELP} ›</strong>
            </div>

            {/* 📢 CHANNEL */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_CHANNEL)}
            >
              <div className="item-left">
                <div className="item-icon">
                  <FaTelegramPlane />
                </div>
                <span>Yangiliklar kanali</span>
              </div>
              <strong>@{SUPPORT_CHANNEL} ›</strong>
            </div>

            {/* 👨‍💻 DEV */}
            <div
              className="profile-item clickable support-item"
              onClick={() => openTelegram(SUPPORT_DEV)}
            >
              <div className="item-left">
                <div className="item-icon">
                  <FiUser />
                </div>
                <span>Web App yaratuvchisi</span>
              </div>
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
