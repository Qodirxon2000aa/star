import React, { useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext"; // <-- Bu qatorni qo'shing!
import "./premium.css";
// agar avatar yoki boshqa rasm ishlatmoqchi bo'lsangiz
// import premIcon from "../../../assets/prem.ico";

const PremiumModal = ({ onClose }) => {
  const { createPremiumOrder, apiUser, user } = useTelegram();
  const [username, setUsername] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("3"); // default 3 oy
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [validationError, setValidationError] = useState("");

  const balance = apiUser?.balance || "0";

  const plans = [
    { id: "3", months: 3, discount: "-20%", price: 159999000 },
    { id: "6", months: 6, discount: "-37%", price: 219999000 },
    { id: "12", months: 12, discount: "-42%", price: 389999000 },
  ];

  const handleSelfClick = () => {
    if (user?.username) {
      setUsername(user.username.replace("@", ""));
    }
  };

  const handleBuy = async () => {
    if (!username.trim()) {
      setValidationError("Username kiriting");
      return;
    }
    if (!selectedPlan) {
      setValidationError("Premium paket tanlang");
      return;
    }

    const selected = plans.find(p => p.id === selectedPlan);
    const totalPrice = selected.price;

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

      if (result.ok) {
        setTimeout(() => {
          setSending(false);
          setSuccess(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setSending(false);
          setError(true);
        }, 800);
      }
    } catch (err) {
      setTimeout(() => {
        setSending(false);
        setError(true);
      }, 800);
    }
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div className="premium-modal animate" onClick={(e) => e.stopPropagation()}>
        {/* Asosiy forma */}
        {!sending && !success && !error && !insufficientFunds && !validationError && (
          <>
            <h1 className="modal-title">
              Telegram Premium sotib olish <span className="star">⭐</span>
            </h1>
            <p className="modal-subtitle">
              O'zingiz yoki do'stlaringiz uchun Visa kartasiz Telegram Premium obunasini xarid qiling.
            </p>

            <div className="section-title">Kimga yuboramiz?</div>

            <div className="username-wrapper">
              <div className="avatar">DC</div>
              <input
                type="text"
                className="username-input"
                placeholder="Dev Chaudhary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button className="self-btn" onClick={handleSelfClick}>
                O'zimga olamiz
              </button>

            </div>

            <div className="section-title">Muddatni tanlang <span className="best-discount">-42%</span></div>

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
                      {plan.months === 12 ? "1 yil" : plan.months === 3 ? "3 oy" : "6 oy"}
                    </span>
                    <span className="discount">{plan.discount}</span>
                  </div>
                  <div className="price">{plan.price.toLocaleString().replace(/,/g, " ")} UZS</div>
                </div>
              ))}
            </div>

            <button className="buy-button" onClick={handleBuy}>
              Telegram Premium sovg'a qilish
            </button>
          </>
        )}

        {/* Boshqa statuslar (loading, success, error) ni oldingi kodingizdan saqlashingiz mumkin */}
      </div>
    </div>
  );
};

export default PremiumModal;