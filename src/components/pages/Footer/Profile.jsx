import React, { useMemo, useState } from "react";
import "./profile.css";
import { useTelegram } from "../../../../context/TelegramContext";
import UserModal from "../UserModal/UserModal";
import Lang from "../Header/Lang";

// 🔥 Icons
import { FiGlobe, FiHelpCircle, FiUser, FiCreditCard } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";

/* SUPPORT */
const SUPPORT_HELP = "ahdsiz";
const SUPPORT_CHANNEL = "fatih_link";
const SUPPORT_DEV = "behissiyot";

const Profile = ({ onClose }) => {
  const { user, apiUser, loading } = useTelegram();

  const [openHistory, setOpenHistory] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [closing, setClosing] = useState(false);

  if (!user) return null;

  // 🔒 Close with animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 400);
  };

  // 🖼 Avatar
  const avatar = useMemo(() => {
    if (user?.photo_url?.startsWith("http")) return user.photo_url;
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

  // 🔗 Telegram open
  const openTelegram = (username) => {
    const link = `https://t.me/${username}`;
    window.Telegram?.WebApp?.openTelegramLink
      ? window.Telegram.WebApp.openTelegramLink(link)
      : window.open(link, "_blank");
  };

  return (
    <>
      <div
        className={`profile-overlay ${closing ? "closing" : ""}`}
        onClick={handleClose}
      >
        <div
          className={`profile-panel ${closing ? "closing" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="profile-close" onClick={handleClose}>×</button>

          {/* HEADER */}
          {/* HEADER */}
<div className="profile-header">
  {user?.photo_url ? (
    <img
      src={user.photo_url}
      className="profile-avatar"
      alt="avatar"
      referrerPolicy="origin"  // yoki umuman olib tashlang
      onError={(e) => {
        console.log("Telegram avatar yuklanmadi, fallback ishlatildi");
        e.currentTarget.src = "/avatar.png";
      }}
    />
  ) : (
    <img
      src="/avatar.png"
      className="profile-avatar"
      alt="avatar"
    />
  )}
  <h2>{fullName}</h2>
  <p>{username}</p>
</div>

          {/* LIST */}
          <div className="profile-list">
            <div className="profile-item">
              <div className="item-left">
                <div className="item-icon"><FiCreditCard /></div>
                <span>Balans</span>
              </div>
              <strong>{balance} ⭐</strong>
            </div>

            <div className="profile-item clickable" onClick={() => setOpenLang(true)}>
              <div className="item-left">
                <div className="item-icon"><FiGlobe /></div>
                <span>Til</span>
              </div>
              <strong>O‘zbekcha ›</strong>
            </div>

            <div className="profile-item clickable" onClick={() => openTelegram(SUPPORT_HELP)}>
              <div className="item-left">
                <div className="item-icon"><FiHelpCircle /></div>
                <span>Yordam</span>
              </div>
              <strong>@{SUPPORT_HELP} ›</strong>
            </div>

            <div className="profile-item clickable" onClick={() => openTelegram(SUPPORT_CHANNEL)}>
              <div className="item-left">
                <div className="item-icon"><FaTelegramPlane /></div>
                <span>Yangiliklar</span>
              </div>
              <strong>@{SUPPORT_CHANNEL} ›</strong>
            </div>

            <div className="profile-item clickable" onClick={() => openTelegram(SUPPORT_DEV)}>
              <div className="item-left">
                <div className="item-icon"><FiUser /></div>
                <span>Yaratuvchi</span>
              </div>
              <strong>@{SUPPORT_DEV} ›</strong>
            </div>
          </div>

          <button
            className="profile-history-btn"
            onClick={() => setOpenHistory(true)}
          >
            📜 Tranzaksiyalar tarixi
          </button>
        </div>
      </div>

      {openHistory && <UserModal onClose={() => setOpenHistory(false)} />}
      {openLang && <Lang onClose={() => setOpenLang(false)} />}
    </>
  );
};

export default Profile;
