// src/components/ReferralModal.jsx
import React from "react";
import "./ReferralModal.css";
import Lottie from "lottie-react";

// ✅ LOTTIE JSON
import shareAnimation from "../../assets/share.json";

const ReferralModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="referral-overlay" onClick={onClose}>
      <div
        className="referral-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close */}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* ⎯ Handle */}
        <div className="sheet-handle" />

        {/* 📦 Content */}
        <div className="sheet-content">
          {/* 🎬 Animation */}
          <div className="animation">
            <Lottie className="lottie"
              animationData={shareAnimation}
              loop
              autoplay
            />
          </div>

          <h2>Referral dasturi</h2>
          <p>
            Do‘stlaringizni taklif qiling va ularning xaridlaridan
            Stars ishlang!
          </p>

          {/* ⭐ Rewards */}
          <div className="rewards">
            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Telegram Premium</strong>
                <br />
                Do‘stingizning Premium xaridi uchun{" "}
                <strong>+15 ⭐</strong>
              </div>
            </div>

            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Yulduzlar</strong>
                <br />
                Do‘stingizning 100 Stars xaridi uchun{" "}
                <strong>+5 ⭐</strong>
              </div>
            </div>
          </div>

          {/* 🔘 Buttons */}
          <div className="buttons">
            <button className="btn-invite">
              Do‘stlarni taklif qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
