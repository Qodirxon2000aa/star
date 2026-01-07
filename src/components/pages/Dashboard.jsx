import React, { useState } from "react";
import "./Dashboard.css";

import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";

import Footer from "../Footer/Footer.jsx";
import ReferralModal from "../Footer/ReferralModal.jsx";
import Money from "../../components/pages/Money/Money.jsx";

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  const [activeTab, setActiveTab] = useState("home");
  const [showReferralModal, setShowReferralModal] = useState(false);

  const handleInviteClick = () => {
    setActiveTab("invite");
    setShowReferralModal(true);
  };

  return (
    <div className="dashboard" style={{ paddingBottom: "90px" }}>
      
      <Header
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onOpenMoney={() => setOpenModal("money")}
      />

      <div className="dashboard-content">
        {isPremium ? <Premium /> : <Stars />}
      </div>

      {/* 💰 MONEY MODAL */}
      {openModal === "money" && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            <Money onClose={() => setOpenModal(null)} />
          </div>
        </div>
      )}

      {/* 🤝 REFERRAL MODAL */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />

      {/* 👇 FOOTER */}
      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInviteClick={handleInviteClick}
      />
    </div>
  );
};

export default Dashboard;
