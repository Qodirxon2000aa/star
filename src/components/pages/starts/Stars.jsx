import React, { useEffect, useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./Stars.css";

const PRESETS = [
  { stars: 50, price: "12 999" },
  { stars: 100, price: "25 999" },
  { stars: 250, price: "64 999" },
  { stars: 500, price: "129 999" },
];

const Stars = () => {
  const { createOrder, apiUser, user } = useTelegram();

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("https://tezpremium.uz/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setPrice(Number(d.settings.price));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalPrice = amount && price ? amount * price : 0;
  const balance = apiUser?.balance || 0;

  const handleSelf = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!username) return setError("Username kiriting");
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

        <h2 className="stars-title">Telegram Stars ⭐</h2>
        <p className="stars-subtitle">
          O‘zingiz yoki do‘stlaringiz uchun Stars yuboring
        </p>

        <div className="stars-balance">
          Balans: <strong>{balance.toLocaleString()} UZS</strong>
        </div>

        {/* USERNAME */}
        <label>Kimga yuboramiz?</label>
        <div className="username-row">
          <input
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSelf}>O‘zimga</button>
        </div>

        {/* AMOUNT */}
        <label>Telegram Yulduzlari miqdori</label>
        <input
          type="number"
          placeholder="50 dan 10 000 gacha"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* PRESETS */}
        <p className="or-text">Yoki to‘plamni tanlang</p>

        <div className="preset-list">
          {PRESETS.map((p) => (
            <div
              key={p.stars}
              className={`preset ${
                Number(amount) === p.stars ? "active" : ""
              }`}
              onClick={() => setAmount(p.stars)}
            >
              ⭐ {p.stars} Stars
              <span>{p.price} UZS</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="total">
          Jami: <strong>{totalPrice.toLocaleString()} UZS</strong>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">✅ Muvaffaqiyatli!</div>}

        <button
          className="buy-btn"
          disabled={sending}
          onClick={handleSubmit}
        >
          {sending ? "Yuborilmoqda..." : "⭐ Sotib olish"}
        </button>
      </div>
    </div>
  );
};

export default Stars;
