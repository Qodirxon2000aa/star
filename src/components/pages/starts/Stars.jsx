import React, { useEffect, useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./Stars.css";
import AnimatedModal from "../../ui/AnimatedModal";
import starsVideo from "../../../assets/Telegram.mp4"; // Video yo'lini o'zingga moslashtir

const PRESETS = [
  { stars: 50, price: "12 999" },
  { stars: 100, price: "25 999" },
  { stars: 250, price: "64 999" },
  { stars: 500, price: "129 999" },
];

const Stars = () => {
  const { createOrder, apiUser, user } = useTelegram();

  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const openModal = (type, title, message) => {
    setModal({ open: true, type, title, message });
  };

  /* ⭐ Narxni olish */
  useEffect(() => {
    fetch("https://tezpremium.uz/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPrice(Number(d.settings.price));
      })
      .catch(() => console.error("Narx yuklanmadi"))
      .finally(() => setLoading(false));
  }, []);

  /* 👤 Username bo'yicha foydalanuvchini qidirish */
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
        if (d.username) setUserInfo(d);
        else setUserInfo(null);
      })
      .catch(() => setUserInfo(null))
      .finally(() => setChecking(false));
  }, [username]);

  const balance = apiUser?.balance || 0;
  const totalPrice = amount && price ? Number(amount) * price : 0;

  /* 👤 O'zimga */
  const handleSelf = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  /* 💳 Yuborish */
  const handleSubmit = async () => {
    if (!userInfo) {
      return openModal("error", "Xatolik", "Foydalanuvchi topilmadi");
    }
    if (Number(amount) < 50 || Number(amount) > 10000) {
      return openModal("warning", "Noto‘g‘ri miqdor", "50 – 10 000 oralig‘ida bo‘lishi kerak");
    }
    if (balance < totalPrice) {
      const diff = totalPrice - balance;
      return openModal("warning", "Balans yetarli emas", `Yana ${diff.toLocaleString()} UZS yetishmayapti`);
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
        openModal("success", "Muvaffaqiyatli 🎉", "Telegram Stars muvaffaqiyatli yuborildi");
        setAmount(""); // muvaffaqiyatdan keyin tozalash ixtiyoriy
      } else {
        openModal("error", "Xatolik", "Buyurtma bajarilmadi");
      }
    } catch (err) {
      openModal("error", "Server xatosi", "API bilan muammo yuz berdi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stars-wrapper">
      <div className="stars-card">
        {/* 🎬 Video */}
        <div className="vd">
          <div className="stars-video">
            <video src={starsVideo} autoPlay loop muted playsInline />
          </div>
        </div>

        <h2 className="stars-title">Telegram Stars ⭐</h2>

        {/* 👤 Kimga yuboramiz */}
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
              placeholder="Telegram @username kiriting..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          ) : (
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

        {/* ⭐ Miqdor */}
        <label>Telegram Yulduzlari miqdori</label>
        <input
          type="number"
          placeholder="50 dan 10 000 gacha"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="inputs"
        />
        <br /> <br />

        {/* Presets */}
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

        {/* Jami narx */}
        <div className="total">
          Jami: <strong>{totalPrice.toLocaleString()} UZS</strong>
        </div>

        {/* Tugma */}
        <button
          className="buy-btn"
          disabled={sending || !userInfo || !amount}
          onClick={handleSubmit}
        >
          {sending ? "Yuborilmoqda..." : "⭐ Sotib olish"}
        </button>
      </div>

      {/* Modal */}
      <AnimatedModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
      />
    </div>
  );
};

export default Stars;