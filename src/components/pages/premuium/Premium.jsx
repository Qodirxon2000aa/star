import React, { useState, useEffect } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./premium.css";

// VIDEO PATH (o'zingiz almashtirasiz)
import premiumVideo from "../../../assets/prem.mp4";

// AnimatedModal import qilindi
import AnimatedModal from "../../ui/AnimatedModal"; // yo'lni loyihangizga qarab tuzating

const PremiumModal = ({ onClose }) => {
  const { createPremiumOrder, apiUser, user } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("3");
  const [sending, setSending] = useState(false);

  const [validationError, setValidationError] = useState("");

  // AnimatedModal uchun state
  const [animatedModal, setAnimatedModal] = useState({
    open: false,
    type: "success", // success | error | warning
    title: "",
    message: "",
  });

  const balance = apiUser?.balance || "0";

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
        d.username ? setUserInfo(d) : setUserInfo(null);
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

      if (result.ok) {
        setAnimatedModal({
          open: true,
          type: "success",
          title: "Muvaffaqiyatli!",
          message: `Telegram Premium ${selectedPlan} oyga sovg'a qilindi! ⭐`,
        });
        // Muvaffaqiyatdan keyin formani tozalash
        setUsername("");
        setUserInfo(null);
        setSelectedPlan("3");
      } else {
        setAnimatedModal({
          open: true,
          type: "error",
          title: "Xatolik yuz berdi",
          message: "Premium sovg'a qilishda muammo yuz berdi. Keyinroq urinib ko'ring.",
        });
      }
    } catch (err) {
      setAnimatedModal({
        open: true,
        type: "error",
        title: "Server xatosi",
        message: "Ulanishda muammo bor. Internet aloqangizni tekshiring.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-modal animate" onClick={(e) => e.stopPropagation()}>
        <div className="vd">
          <div className="premium-video">
            <video src={premiumVideo} autoPlay loop muted playsInline />
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
              type="text"
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
                {selectedPlan === plan.id && <div className="radio-inner"></div>}
              </div>
              <div className="plan-info">
                <span className="duration">
                  {plan.months === 12
                    ? "1 yil"
                    : plan.months === 6
                    ? "6 oy"
                    : "3 oy"}
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

      {/* Animated Modal - barcha natijalar shu orqali chiqadi */}
      <AnimatedModal
        open={animatedModal.open}
        type={animatedModal.type}
        title={animatedModal.title}
        message={animatedModal.message}
        onClose={() => {
          setAnimatedModal({ ...animatedModal, open: false });
          // Muvaffaqiyatli bo'lsa butun modalni yopamiz
          if (animatedModal.type === "success") {
            onClose();
          }
        }}
      />
    </div>
  );
};

export default PremiumModal;