import React, { useState, useEffect } from "react";
import "./AnimatedModal.css";

const AnimatedModal = ({ open, type = "success", title, message, onClose, small = false }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsLeaving(false);
    }
  }, [open]);

  const handleClose = () => {
    if (small) {
      // Toast uchun yumshoq chiqish
      setIsLeaving(true);
      setTimeout(() => {
        onClose();
      }, 400); // toastOut animatsiya vaqti
    } else {
      onClose();
    }
  };

  if (!open && !isLeaving) return null;

  return (
    <div className="tgx-overlay" onClick={handleClose}>
      <div
        className={`tgx-modal ${type} ${small ? "small-toast" : ""} ${isLeaving ? "leaving" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tgx-icon">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </div>

        {!small && title && <div className="tgx-title">{title}</div>}

        <div className={`tgx-message ${small ? "small-message" : ""}`}>
          {message}
        </div>

        {!small && (
          <button className="tgx-btn" onClick={handleClose}>
            Yopish
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedModal;