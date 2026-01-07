import React, { useEffect, useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./Stars.css";

// ❗ VIDEO PATH (o‘zing qo‘yasan)
import starsVideo from "../../../assets/Telegram.mp4"; // ⬅️ shu joyni keyin almashtirasan

const PRESETS = [
  { stars: 50, price: "12 999" },
  { stars: 100, price: "25 999" },
  { stars: 250, price: "64 999" },
  { stars: 500, price: "129 999" },
];

const Stars = () => {
  const { createOrder, apiUser, user } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ⭐ PRICE */
  useEffect(() => {
    fetch("https://tezpremium.uz/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPrice(Number(d.settings.price));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* 👤 USER PREVIEW */
  useEffect(() => {
    if (!username || username.length < 4) {
      setUserInfo(null);
      return;
    }

    const clean = username.replace("@", "");
    setChecking(true);

    fetch(`https://tezpremium.uz/starsapi/user.php?username=@${clean}`)
      .then((r) => r.json())
      .then((d) => {
        d.username ? setUserInfo(d) : setUserInfo(null);
      })
      .catch(() => setUserInfo(null))
      .finally(() => setChecking(false));
  }, [username]);

  const balance = apiUser?.balance || 0;
  const totalPrice = amount && price ? amount * price : 0;

  /* 👤 O'ZIMGA */
  const handleSelf = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  /* 💳 SUBMIT */
  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!userInfo) return setError("Foydalanuvchi topilmadi");
    if (amount < 50 || amount > 10000)
      return setError("50 – 10 000 oralig‘ida bo‘lishi kerak");
    if (balance < totalPrice) return setError("Balans yetarli emas");

    setSending(true);

    try {
      const res = await createOrder({
        amount: Number(amount),
        sent: username,
        type: "Stars",
        overall: totalPrice,
      });

      res.ok ? setSuccess(true) : setError("Xatolik yuz berdi");
    } catch {
      setError("Server xatosi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stars-wrapper">
      <div className="stars-card">

        {/* 🎬 VIDEO (TITLE TEPASIDA) */}
        <div className="vd">
            <div className="stars-video">
          <video
            src={starsVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        </div>
      

        <h2 className="stars-title">Telegram Stars ⭐</h2>

        <br />

       <div className="tg-user-section">
  <div className="tg-user-header">
    <div className="tg-user-title">Kimga yuboramiz?</div>
    <button className="tg-self-btn" onClick={handleSelf}>
      O‘zimga
    </button>
  </div>

  {!userInfo && (
    <input
      className="tg-user-input"
      placeholder="Telegram @username kiriting..."
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  )}


  {userInfo && (
    <div className="tg-user-chip">
      <img src={userInfo.photo} alt="avatar" />
      <div className="tg-user-info">
        <div className="tg-user-name">{userInfo.name}</div>
        <div className="tg-user-username">@{userInfo.username}</div>
      </div>
      <button
        className="tg-user-clear"
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


        {/* ⭐ AMOUNT */}
        <label>Telegram Yulduzlari miqdori</label>
        <input
          type="number"
          placeholder="50 dan 10 000 gacha"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <br /><br />

        <div className="preset-list">
          {PRESETS.map((p) => (
            <div
              key={p.stars}
              className={`preset ${Number(amount) === p.stars ? "active" : ""}`}
              onClick={() => setAmount(p.stars)}
            >
              ⭐ {p.stars} Stars
              <span>{p.price} UZS</span>
            </div>
          ))}
        </div>

        <div className="total">
          Jami: <strong>{totalPrice.toLocaleString()} UZS</strong>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">✅ Muvaffaqiyatli!</div>}

        <button className="buy-btn" disabled={sending} onClick={handleSubmit}>
          {sending ? "Yuborilmoqda..." : "⭐ Sotib olish"}
        </button>
      </div>
    </div>
  );
};

export default Stars;
