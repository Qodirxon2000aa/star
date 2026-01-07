import React, { useEffect, useState } from "react";
import "./AnimatedModal.css";

const CONFIG = {
  success: { icon: "✦", label: "SUCCESS" },
  error: { icon: "✖", label: "ERROR" },
  warning: { icon: "⚠", label: "WARNING" },
  info: { icon: "ℹ", label: "INFO" },
};

const AnimatedModal = ({
  open,
  type = "info",
  title,
  message,
  onClose,
  small = false,
}) => {
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) setShow(true);
  }, [open]);

  const close = () => {
    setShow(false);
    setTimeout(onClose, 500);
  };

  if (!open && !show) return null;

  return (
    <div className="cx-overlay" onClick={close}>
      <div
        className={`cx-modal ${type} ${open ? "cx-in" : "cx-out"} ${
          small ? "cx-toast" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon Ring */}
        <div className="cx-ring" />

        {/* Icon */}
        <div className="cx-icon">{CONFIG[type].icon}</div>

        {!small && <div className="cx-label">{CONFIG[type].label}</div>}

        {title && !small && <h2 className="cx-title">{title}</h2>}

        <p className="cx-message">{message}</p>

        {!small && (
          <button className="cx-btn" onClick={close}>
            Yopish
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedModal;
