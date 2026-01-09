// src/components/ReferralModal.jsx
import React, { useEffect, useState } from "react";
import "./ReferralModal.css";
import Lottie from "lottie-react";
import shareAnimation from "../../assets/share.json";

const ReferralModal = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // fade-out va slide-out vaqti
  };

  if (!isOpen && !visible) return null;

  return (
    <div className={`referral-overlay ${visible ? "show" : "hide"}`}>
      <div className={`referral-fullscreen ${visible ? "slide-in" : "slide-out"}`}>
        {/* ❌ CLOSE */}
        <button className="close-btn" onClick={handleClose}>×</button>

        {/* 📦 CONTENT */}
        <div className="referral-content">
          {/* 🎬 LOTTIE */}
          <div className="animation">
            <Lottie animationData={shareAnimation} loop autoplay />
          </div>

          <h2>Referral dasturi</h2>
          <p>
            Do‘stlaringizni taklif qiling va ularning xaridlaridan
            Stars ishlang!
          </p>

          {/* ⭐ REWARDS */}
          <div className="rewards">
            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Telegram Premium</strong>
                <br />
                Premium xaridi uchun <strong>+15 ⭐</strong>
              </div>
            </div>

            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Yulduzlar</strong>
                <br />
                100 Stars xaridi uchun <strong>+5 ⭐</strong>
              </div>
            </div>
          </div>

          {/* 🔘 BUTTON */}
          <button className="btn-invite">
            Do‘stlarni taklif qilish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
