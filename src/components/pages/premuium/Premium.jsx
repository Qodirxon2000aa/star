import React, { useState, useEffect } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./premium.css";

// ❗ VIDEO PATH (keyin o‘zing almashtirasan)
import premiumVideo from "../../../assets/prem.mp4";

const PremiumModal = ({ onClose }) => {
  const { createPremiumOrder, apiUser, user } = useTelegram();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [checking, setChecking] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState("3");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [validationError, setValidationError] = useState("");

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
    setError("");
    setInsufficientFunds(false);

    if (!userInfo) {
      setValidationError("Foydalanuvchi topilmadi");
      return;
    }

    const userBalance = Number(apiUser?.balance || 0);
    if (userBalance < totalPrice) {
      setInsufficientFunds(true);
      return;
    }

    setSending(true);
    try {
      const result = await createPremiumOrder({
        months: parseInt(selectedPlan),
        sent: username.startsWith("@") ? username : `@${username}`,
        overall: totalPrice,
      });

      result.ok ? setSuccess(true) : setError("Xatolik yuz berdi");
    } catch {
      setError("Server xatosi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-modal animate" onClick={(e) => e.stopPropagation()}>
          <div className="vd">
 <div className="premium-video">
          <video
            src={premiumVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
          </div>
    
       

        {!sending && !success && !error && !insufficientFunds && (
          <>
            <h1 className="modal-title">
              Telegram Premium <span className="star">⭐</span>
            </h1>

            <div className="section-title">Kimga yuboramiz?</div>

            <div className="username-box">
              <input
                type="text"
                placeholder="Telegram @username kiriting..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={handleSelfClick}>O‘zimga</button>
            </div>

            {checking && <div className="user-loading">🔍 Tekshirilmoqda...</div>}

            {userInfo && (
              <div className="user-preview">
                <img src={userInfo.photo} alt="avatar" />
                <div>
                  <div className="name">{userInfo.name}</div>
                  <div className="username">@{userInfo.username}</div>
                </div>
              </div>
            )}

            <div className="section-title">Muddatni tanlang</div>

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
                    {selectedPlan === plan.id && (
                      <div className="radio-inner"></div>
                    )}
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
            {insufficientFunds && (
              <div className="error">Balans yetarli emas</div>
            )}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">✅ Muvaffaqiyatli!</div>}

            <button className="buy-button" onClick={handleBuy} disabled={sending}>
              {sending ? "Yuborilmoqda..." : "Telegram Premium sovg'a qilish"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;
