import React, { useEffect, useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./Stars.css";
import AnimatedModal from "../../ui/AnimatedModal";
import Lottie from "lottie-react";

import starsVideo from "../../../assets/stars.json";

const PRESETS = [
  { stars: 50, price: "12 999" },
  { stars: 100, price: "25 999" },
  { stars: 250, price: "64 999" },
  { stars: 500, price: "129 999" },
];

const SHOW_MORE_PRESETS = [
  { stars: 1000, price: "259 999" },
  { stars: 5000, price: "1 299 999" },
  { stars: 10000, price: "2 599 999" },
];

const Stars = () => {
  const { createOrder, apiUser, user } = useTelegram();

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const [userNotFoundToast, setUserNotFoundToast] = useState(false);
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔽 SHOW MORE
  const [showMore, setShowMore] = useState(false);

  const openModal = (type, title, message) => {
    setModal({ open: true, type, title, message });
  };

  /* ⭐ PRICE */
  useEffect(() => {
    fetch("https://m4746.myxvest.ru/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPrice(Number(d.settings.price));
      })
      .finally(() => setLoading(false));
  }, []);

  /* 👤 USERNAME CHECK */
  useEffect(() => {
    if (!username || username.trim().length < 4) {
      setUserInfo(null);
      setUserNotFoundToast(false);
      return;
    }

    const clean = username.trim().replace("@", "");
    setChecking(true);

    fetch(`https://tezpremium.uz/starsapi/user.php?username=@${clean}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.username) {
          setUserInfo(d);
          setUserNotFoundToast(false);
        } else {
          setUserInfo(null);
          setUserNotFoundToast(true);
          setTimeout(() => setUserNotFoundToast(false), 3000);
        }
      })
      .catch(() => {
        setUserInfo(null);
        setUserNotFoundToast(true);
        setTimeout(() => setUserNotFoundToast(false), 3000);
      })
      .finally(() => setChecking(false));
  }, [username]);

  const balance = apiUser?.balance || 0;
  const totalPrice = amount && price ? Number(amount) * price : 0;

  const handleSelf = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  const handleSubmit = async () => {
    if (!userInfo)
      return openModal("error", "Xatolik", "Foydalanuvchi topilmadi");

    if (Number(amount) < 50 || Number(amount) > 10000)
      return openModal(
        "warning",
        "Noto‘g‘ri miqdor",
        "50 – 10 000 oralig‘ida bo‘lishi kerak"
      );

    if (balance < totalPrice) {
      const diff = totalPrice - balance;
      return openModal(
        "warning",
        "Balans yetarli emas",
        `Yana ${diff.toLocaleString()} UZS yetishmayapti`
      );
    }

    setSending(true);
    try {
      const res = await createOrder({
        amount: Number(amount),
        sent: username,
        type: "Stars",
        overall: totalPrice,
      });

      if (res.ok) {
        openModal("success", "Muvaffaqiyatli", "Telegram Stars yuborildi");
        setAmount("");
      } else {
        openModal("error", "Xatolik", "Buyurtma bajarilmadi");
      }
    } catch {
      openModal("error", "Server xatosi", "API muammo");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stars-wrapper">
      <div className="stars-card">
        <div className="stars-video">
          <Lottie animationData={starsVideo} loop autoplay />
        </div>

        <h2 className="stars-title">Telegram Stars</h2>

        {/* USER */}
        <div className="tg-user-section">
          <div className="tg-user-header">
            <div className="tg-user-title">Kimga yuboramiz?</div>
            <button className="tg-self-btn" onClick={handleSelf}>
              O‘zimga
            </button>
          </div>

          {!userInfo ? (
            <input
              className="tg-user-input"
              placeholder="Telegram @username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
            <div className="tg-user-chip">
              <img src={userInfo.photo} alt="avatar" />
              <div>
                <div>{userInfo.name}</div>
                <div>@{userInfo.username}</div>
              </div>
              <button
                onClick={() => {
                  setUsername("");
                  setUserInfo(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="50 dan 10 000 gacha"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="inputs"
        />

        <div className="preset-list">
          {PRESETS.map((p) => (
            <div
              key={p.stars}
              className={`preset ${Number(amount) === p.stars ? "active" : ""}`}
              onClick={() => setAmount(p.stars)}
            >
              {p.stars} Stars
              <span>{p.price} UZS</span>
            </div>
          ))}
        </div>

        {/* SHOW MORE BUTTON */}
        

        {/* SHOW MORE LIST WITH FADE */}
        <div
          className={`preset-list more ${
            showMore ? "fade-in" : "fade-out"
          }`}
        >

          {SHOW_MORE_PRESETS.map((p) => (
            <div
              key={p.stars}
              className={`preset ${Number(amount) === p.stars ? "active" : ""}`}
              onClick={() => setAmount(p.stars)}
            >
              {p.stars} Stars
              <span>{p.price} UZS</span>
            </div>
          ))}
        </div>
<button
          className="show-more-btn"
          onClick={() => setShowMore((v) => !v)}
        >
          {showMore ? "Yopish ▲" : "Ko‘proq ko‘rsat ▼"}
        </button>
        <div className="total">
          Jami: <strong>{totalPrice.toLocaleString()} UZS</strong>
        </div>

        <button
          className="buy-btn1"
          disabled={sending || !userInfo || !amount}
          onClick={handleSubmit}
        >
          {sending ? "Yuborilmoqda..." : "Sotib olish"}
        </button>

        
      </div>
      

      <AnimatedModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
      />

      <AnimatedModal
        open={userNotFoundToast}
        type="info"
        message="Foydalanuvchi topilmadi. @username tekshiring."
        onClose={() => setUserNotFoundToast(false)}
        small
      />
    </div>
  );
};

export default Stars;
