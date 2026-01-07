// Dashboard.jsx
import React, { useState } from "react";
import "./Dashboard.css";
import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";
import Money from "../pages/Money/Money.jsx";

const Dashboard = () => {
  // 🔥 ASOSIY STATE
  // false = Stars | true = Premium
  const [isPremium, setIsPremium] = useState(false);

  // faqat modal bo‘ladiganlar
  const [openModal, setOpenModal] = useState(null); // "money" | "lang"

  return (
    <div className="dashboard">
      <Header
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onOpenMoney={() => setOpenModal("money")}
        onOpenLang={() => setOpenModal("lang")}
      />

      {/* 🔥 MARKAZIY CONTENT */}
      <div className="dashboard-content">
        {isPremium ? <Premium /> : <Stars />}
      </div>

      {/* MONEY MODAL */}
      {openModal === "money" && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            <Money onClose={() => setOpenModal(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
