import React, { useState, useEffect } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import Lottie from "lottie-react";
import "./premium.css";

// ✅ TO‘G‘RI LOTTIE JSON
import premiumAnimation from "../../../assets/premuim.json";

// ✅ AnimatedModal
import AnimatedModal from "../../ui/AnimatedModal";

const PremiumModal = ({ onClose }) => {
  const { createPremiumOrder, apiUser, user } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("3");
  const [sending, setSending] = useState(false);

  const [validationError, setValidationError] = useState("");

  const [animatedModal, setAnimatedModal] = useState({
    open: false,
    type: "success", // success | error | warning
    title: "",
    message: "",
  });

  const plans = [
    { id: "3", months: 3, discount: "-20%", price: 159999000 },
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
      .then((d) => {
        d?.username ? setUserInfo(d) : setUserInfo(null);
      })
      .catch(() => setUserInfo(null))
      .finally(() => setChecking(false));
  }, [username]);

  const handleSelfClick = () => {
    if (user?.username) {
      setUsername("@" + user.username.replace("@", ""));
    }
  };

  const selected = plans.find((p) => p.id === selectedPlan);
  const totalPrice = selected ? selected.price : 0;

  const handleBuy = async () => {
    setValidationError("");

    if (!userInfo) {
      setValidationError("Foydalanuvchi topilmadi");
      return;
    }

    const userBalance = Number(apiUser?.balance || 0);
    if (userBalance < totalPrice) {
      setAnimatedModal({
        open: true,
        type: "warning",
        title: "Balans yetarli emas",
        message: "Hisobingizda yetarlicha mablag' yo'q. Iltimos, balansni to'ldiring.",
      });
      return;
    }

    setSending(true);
    try {
      const result = await createPremiumOrder({
        months: parseInt(selectedPlan),
        sent: username.startsWith("@") ? username : `@${username}`,
        overall: totalPrice,
      });

      if (result?.ok) {
        setAnimatedModal({
          open: true,
          type: "success",
          title: "Muvaffaqiyatli!",
          message: `Telegram Premium ${selectedPlan} oyga sovg'a qilindi! ⭐`,
        });
        setUsername("");
        setUserInfo(null);
        setSelectedPlan("3");
      } else {
        setAnimatedModal({
          open: true,
          type: "error",
          title: "Xatolik",
          message: "Premium sovg'a qilishda muammo yuz berdi.",
        });
      }
    } catch {
      setAnimatedModal({
        open: true,
        type: "error",
        title: "Server xatosi",
        message: "Internet aloqani tekshiring.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-modal animate" onClick={(e) => e.stopPropagation()}>

        {/* 🎬 LOTTIE ANIMATION */}
        <div className="vd">
          <div className="premium-video">
            <Lottie
              animationData={premiumAnimation}
              loop
              autoplay
            />
          </div>
        </div>

        <h1 className="modal-title">
          Telegram Premium <span className="star">⭐</span>
        </h1>

        <div className="section-title">Kimga yuboramiz?</div>

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

        <div className="section-title">Muddatni tanlang</div>

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
                <span className="duration">
                  {plan.months === 12 ? "1 yil" : `${plan.months} oy`}
                </span>
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
          onClick={handleBuy}
          disabled={sending || !userInfo}
        >
          {sending ? "Yuborilmoqda..." : "Telegram Premium sovg'a qilish"}
        </button>
      </div>

      {/* ✅ Animated Modal */}
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
