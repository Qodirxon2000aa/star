import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";

import Footer from "../Footer/Footer.jsx";
import ReferralModal from "../Footer/ReferralModal.jsx";
import Money from "../../components/pages/Money/Money.jsx";
import Profile from "../../components/Footer/Profile.jsx";

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  const [activeTab, setActiveTab] = useState("home");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleInviteClick = () => {
    setActiveTab("invite");
    setShowReferralModal(true);
  };

  // 🔒 SCROLL LOCK — FAFAQAT DASHBOARD
  useEffect(() => {
    const dashboard = document.querySelector(".dashboard");
    if (!dashboard) return;

    const isAnyModalOpen =
      openModal === "money" || showReferralModal || showProfile;

    if (isAnyModalOpen) {
      dashboard.classList.add("modal-lock");
    } else {
      dashboard.classList.remove("modal-lock");
    }

    return () => {
      dashboard.classList.remove("modal-lock");
    };
  }, [openModal, showReferralModal, showProfile]);

  return (
    <div className="dashboard">
      <Header
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onOpenMoney={() => setOpenModal("money")}
      />

      <div className="dashboard-content">
        {isPremium ? <Premium /> : <Stars />}
      </div>

      {/* 💰 MONEY */}
      {openModal === "money" && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            <Money onClose={() => setOpenModal(null)} />
          </div>
        </div>
      )}

      {/* 🤝 REFERRAL */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />

      {/* 👤 PROFILE */}
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}

      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInviteClick={handleInviteClick}
        onProfileClick={() => setShowProfile(true)}
      />
    </div>
  );
};

export default Dashboard;
