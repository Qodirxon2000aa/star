import React, { useState, useEffect } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import Lottie from "lottie-react";
import "./premium.css";

// ✅ LOTTIE
import premiumAnimation from "../../../assets/premuim.json";

// ✅ MODAL
import AnimatedModal from "../../ui/AnimatedModal";

const PremiumModal = ({ onClose = () => {} }) => {
  const { createPremiumOrder, apiUser, user, refreshUser } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("3");
  const [sending, setSending] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [animatedModal, setAnimatedModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const plans = [
    { id: "3", months: 3, discount: "-20%", price: 42000 },
    { id: "6", months: 6, discount: "-37%", price: 219999000 },
    { id: "12", months: 12, discount: "-42%", price: 389999000 },
  ];

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
      .then((d) => (d?.username ? setUserInfo(d) : setUserInfo(null)))
      .catch(() => setUserInfo(null))
      .finally(() => setChecking(false));
  }, [username]);

  const handleSelfClick = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  const selected = plans.find((p) => p.id === selectedPlan);
  const totalPrice = selected?.price || 0;

  /* 🔥 PREMIUM.PHP ga SAQLASH — 100% MOS */
  const savePremiumToApi = async () => {
    const cleanUsername = username.startsWith("@")
      ? username
      : `@${username}`;

    const url =
      `https://m4746.myxvest.ru/webapp/premium.php` +
      `?user_id=${user?.id}` +
      `&amount=${selectedPlan}` +
      `&sent=${encodeURIComponent(cleanUsername)}` +
      `&overall=${totalPrice}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Server javob bermadi");
    }

    const data = await res.json();

    // 🔥 BACKENDINGGA 1:1 MOS TEKSHIRUV
    if (data?.ok !== true) {
      throw new Error(data?.message || "Premium API xatosi");
    }

    return data;
  };

  const handleBuy = async () => {
    setValidationError("");

    if (!userInfo) {
      setValidationError("Foydalanuvchi topilmadi");
      return;
    }

    const balance = Number(apiUser?.balance || 0);
    if (balance < totalPrice) {
      setAnimatedModal({
        open: true,
        type: "warning",
        title: "Balans yetarli emas",
        message: "Hisobingizda yetarli mablag‘ yo‘q.",
      });
      return;
    }

    setSending(true);

    try {
      // 1️⃣ Premium berish
      const result = await createPremiumOrder({
        months: parseInt(selectedPlan),
        sent: username.startsWith("@") ? username : `@${username}`,
        overall: totalPrice,
      });

      if (!result?.ok) {
        throw new Error("Premium yuborilmadi");
      }

      // 2️⃣ Backend kechikish xavfi uchun kichik pauza
      await new Promise((r) => setTimeout(r, 300));

      // 3️⃣ API ga yozish
      const apiResult = await savePremiumToApi();

      // 4️⃣ Balansni yangilash
      refreshUser?.();

      setAnimatedModal({
        open: true,
        type: "success",
        title: "Muvaffaqiyatli!",
        message: `⭐ Telegram Premium yuborildi

🆔 Order ID: ${apiResult.order_id}
💰 Oldingi balans: ${apiResult.balance_before}
💳 Yangi balans: ${apiResult.balance_after}
📅 Sana: ${apiResult.data.date}`,
      });

      setUsername("");
      setUserInfo(null);
      setSelectedPlan("3");
    } catch (e) {
      console.error("❌ PREMIUM ERROR:", e);

      setAnimatedModal({
        open: true,
        type: "error",
        title: "Xatolik",
        message: e.message || "Premium berishda xatolik yuz berdi",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="premium-overlay" onClick={() => onClose()}>
      <div className="premium-modal animate" onClick={(e) => e.stopPropagation()}>
        {/* 🎬 LOTTIE */}
        <div className="vd">
          <div className="premium-video">
            <Lottie animationData={premiumAnimation} loop autoplay />
          </div>
        </div>

        <h1 className="modal-title">
          Telegram Premium <span className="star">⭐</span>
        </h1>

        <div className="tg-user-section">
          <div className="tg-user-header">
            <div className="tg-user-title">Kimga yuboramiz?</div>
            <button className="tg-self-btn" onClick={handleSelfClick}>
              O‘zimga
            </button>
          </div>

          {!userInfo && (
            <input
              className="tg-user-input"
              placeholder="Telegram @username"
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

        <div className="plans-list">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${
                selectedPlan === plan.id ? "selected" : ""
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="radio-circle">
                {selectedPlan === plan.id && <div className="radio-inner" />}
              </div>
              <div className="plan-info">
                <span>{plan.months === 12 ? "1 yil" : `${plan.months} oy`}</span>
                <span className="discount">{plan.discount}</span>
              </div>
              <div className="price">
                {plan.price.toLocaleString().replace(/,/g, " ")} UZS
              </div>
            </div>
          ))}
        </div>

        {validationError && <div className="error">{validationError}</div>}

        <button
          className="buy-button"
          disabled={sending || !userInfo}
          onClick={handleBuy}
        >
          {sending ? "Yuborilmoqda..." : "Telegram Premium sovg‘a qilish"}
        </button>
      </div>

      <AnimatedModal
        open={animatedModal.open}
        type={animatedModal.type}
        title={animatedModal.title}
        message={animatedModal.message}
        onClose={() => {
          setAnimatedModal({ ...animatedModal, open: false });
          if (animatedModal.type === "success") onClose();
        }}
      />
    </div>
  );
};

export default PremiumModal;
