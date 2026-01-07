import React from "react";
import "./AnimatedModal.css";

const AnimatedModal = ({ open, type, title, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="tgx-overlay" onClick={onClose}>
      <div
        className={`tgx-modal ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tgx-icon">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
        </div>

        <div className="tgx-title">{title}</div>
        <div className="tgx-message">{message}</div>

        <button className="tgx-btn" onClick={onClose}>
          Yopish
        </button>
      </div>
    </div>
  );
};

export default AnimatedModal;
