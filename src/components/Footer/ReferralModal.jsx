// src/components/ReferralModal.jsx
import React from "react";
import "./ReferralModal.css";

const ReferralModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="referral-overlay" onClick={onClose}>
      <div className="referral-sheet" onClick={(e) => e.stopPropagation()}>
        {/* X yopish tugmasi */}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Handle (tortib yopish uchun chiziqcha) */}
        <div className="sheet-handle" />

        {/* Kontent */}
        <div className="sheet-content">
          <img
            src="https://via.placeholder.com/120" // Duck rasmini o'zingizniki bilan almashtiring
            alt="Duck"
            className="duck-img"
          />

          <h2>Referral dasturi</h2>
          <p>
            Do‘stlaringizni taklif qiling va ularning xaridlaridan Stars ishlang!
          </p>

          <div className="rewards">
            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Telegram Premium</strong>
                <br />
                Do‘stingizning Premium xaridi uchun <strong>+15 ⭐</strong>
              </div>
            </div>

            <div className="reward">
              <span className="icon">⭐</span>
              <div>
                <strong>Yulduzlar</strong>
                <br />
                Do‘stingizning 100 Stars xaridi uchun <strong>+5 ⭐</strong>
              </div>
            </div>

           
          </div>

          <div className="buttons">
            <button className="btn-invite">
              Do‘stlarni taklif qilish
            </button>
            <button className="btn-link">
              Shaxsiy havolani olish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;