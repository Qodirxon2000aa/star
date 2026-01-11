import React, { useState, useEffect } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import Lottie from "lottie-react";
import "./premium.css";

import premiumAnimation from "../../../assets/premuim.json";
import AnimatedModal from "../../ui/AnimatedModal";

const PremiumModal = ({ onClose = () => {} }) => {
  const { createPremiumOrder, apiUser, user, refreshUser } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("3");
  const [sending, setSending] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [loadingPrices, setLoadingPrices] = useState(true);

  const [prices, setPrices] = useState({
    "3oylik": 17000,
    "6oylik": 225000,
    "12oylik": 295000,
  });

  const [animatedModal, setAnimatedModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // 🔥 API dan narxlarni to‘g‘ridan-to‘g‘ri olish (Stars bilan bir xil URL)
  useEffect(() => {
    fetch("https://m4746.myxvest.ru/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.settings) {
          setPrices({
            "3oylik": Number(d.settings["3oylik"]) || 17000,
            "6oylik": Number(d.settings["6oylik"]) || 225000,
            "12oylik": Number(d.settings["12oylik"]) || 295000,
          });
        }
      })
      .catch((err) => {
        console.error("Settings API xatosi:", err);
        // Agar API ishlamasa, default narxlar qoldiriladi
      })
      .finally(() => setLoadingPrices(false));
  }, []);

  // Dinamik planlar
  const plans = [
    {
      id: "3",
      months: 3,
      label: "3 oy",
      discount: "-20%",
      price: prices["3oylik"],
    },
    {
      id: "6",
      months: 6,
      label: "6 oy",
      discount: "-37%",
      price: prices["6oylik"],
    },
    {
      id: "12",
      months: 12,
      label: "1 yil",
      discount: "-42%",
      price: prices["12oylik"],
    },
  ];

  /* 👤 USER PREVIEW */
  useEffect(() => {
    if (!username || username.trim().length < 4) {
      setUserInfo(null);
      return;
    }

    const clean = username.trim().replace("@", "");
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

  /* 🔥 PREMIUM.PHP ga SAQLASH */
  const savePremiumToApi = async () => {
    const cleanUsername = username.startsWith("@") ? username : `@${username}`;

    const url =
      `https://m4746.myxvest.ru/webapp/premium.php` +
      `?user_id=${user?.id}` +
      `&amount=${selectedPlan}` +
      `&sent=${encodeURIComponent(cleanUsername)}` +
      `&overall=${totalPrice}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Server javob bermadi");

    const data = await res.json();
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
        message: `Hisobingizda yetarli mablag‘ yo‘q.\nKerak: ${totalPrice.toLocaleString()} UZS`,
      });
      return;
    }

    setSending(true);

    try {
      // 1. Premium berish
      const result = await createPremiumOrder({
        months: parseInt(selectedPlan),
        sent: username.startsWith("@") ? username : `@${username}`,
        overall: totalPrice,
      });

      if (!result?.ok) throw new Error("Premium yuborilmadi");

      await new Promise((r) => setTimeout(r, 300));

      // 2. Backendga yozish
      const apiResult = await savePremiumToApi();

      // 3. Balansni yangilash
      refreshUser?.();

      setAnimatedModal({
        open: true,
        type: "success",
        title: "Muvaffaqiyatli!",
        message: `⭐ Telegram Premium yuborildi

🆔 Order ID: ${apiResult.order_id}
💰 Oldingi balans: ${apiResult.balance_before.toLocaleString()} UZS
💳 Yangi balans: ${apiResult.balance_after.toLocaleString()} UZS
📅 Sana: ${apiResult.data?.date || new Date().toLocaleString()}`,
      });

      // Reset form
      setUsername("");
      setUserInfo(null);
      setSelectedPlan("3");
    } catch (e) {
      console.error("PREMIUM ERROR:", e);
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
        <div className="vd">
          <div className="premium-video">
            <Lottie animationData={premiumAnimation} loop autoplay />
          </div>
        </div>

        <h1 className="modal-title">
          Telegram Premium <span className="star">⭐</span>
        </h1>

        {/* USER SECTION */}
        <div className="tg-user-section">
          <div className="tg-user-header">
            <div className="tg-user-title">Kimga yuboramiz?</div>
            <button className="tg-self-btn" onClick={handleSelfClick}>
              O‘zimga
            </button>
          </div>

          {!userInfo ? (
            <input
              className="tg-user-input"
              placeholder="Telegram @username"
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

        {/* PLANS */}
        <div className="plans-list">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? "selected" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="radio-circle">
                {selectedPlan === plan.id && <div className="radio-inner" />}
              </div>
              <div className="plan-info">
                <span>{plan.label}</span>
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
          disabled={sending || !userInfo || loadingPrices}
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