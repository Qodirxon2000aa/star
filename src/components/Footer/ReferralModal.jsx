// src/components/ReferralModal.jsx
import React from "react";
import "./ReferralModal.css";
import image from "../../../src/assets/share.mp4"
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
            <div className="animation">
                <div className="video">
                                <video
  src={image}
  className="duck-video"
  autoPlay
  loop
  muted
  playsInline
/>
                </div>
                    
            </div>

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
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;