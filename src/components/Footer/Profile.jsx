import React, { useMemo, useState } from "react";
import "./profile.css";
import { useTelegram } from "../../../context/TelegramContext";
import UserModal from "../../components/pages/UserModal/UserModal";
import Lang from "../pages/Header/Lang";

const SUPPORT_USERNAME = "tezstar_supp";
const SUPPORT_CHANNEL = "support_channel";
const SUPPORT_DEV = "behissiyot"

const Profile = ({ onClose }) => {
  const { user, apiUser, loading } = useTelegram();

  // 🔥 Modallar state
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

  // 🔥 TELEGRAM SUPPORT OCHISH
  const openSupport = () => {
    const tg = window.Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/${SUPPORT_USERNAME}`);
    } else {
      window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank");
    }
  };

   const openSupportChanel = () => {
    const tg = window.Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/${SUPPORT_USERNAME}`);
    } else {
      window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank");
    }
  };


    const openSupportDev = () => {
    const tg = window.Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(`https://t.me/${SUPPORT_USERNAME}`);
    } else {
      window.open(`https://t.me/${SUPPORT_USERNAME}`, "_blank");
    }
  };

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

            {/* 🌐 TIL */}
            <div
              className="profile-item clickable"
              onClick={() => setOpenLang(true)}
            >
              <span>Til</span>
              <strong>O‘zbekcha ›</strong>
            </div>

            {/* 🆘 YORDAM / SUPPORT */}
            <div
              className="profile-item clickable support-item"
              onClick={openSupport}
            >
              <span>Yordam</span>
              <strong>@{SUPPORT_USERNAME} ›</strong>
            </div>
            <div
              className="profile-item clickable support-item"
              onClick={openSupportChanel}
            >
              <span>Yangiliklar kanali</span>
              <strong>@{SUPPORT_CHANNEL} ›</strong>
            </div>


              <div
              className="profile-item clickable support-item"
              onClick={openSupportDev}
            >
              <span>Web App yaratuvchisi</span>
              <strong>@{SUPPORT_DEV} ›</strong>
            </div>
          </div>

          {/* 📜 TRANZAKSIYALAR */}
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

      {/* 🔥 LANG MODAL */}
      {openLang && <Lang onClose={() => setOpenLang(false)} />}
    </>
  );
};

export default Profile;
