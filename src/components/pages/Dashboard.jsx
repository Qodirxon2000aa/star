import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";

import Footer from "./Footer/Footer.jsx";
import ReferralModal from "./Footer/ReferralModal.jsx";
import Money from "../../components/pages/Money/Money.jsx";
import Profile from "./Footer/Profile.jsx";

// 🔥 WELCOME VIDEO
import WelcomeAnimation from "../WelcomeAnimation.jsx";

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [openModal, setOpenModal] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const dashboard = document.querySelector(".dashboard");
    if (!dashboard) return;

    const isAnyModalOpen =
      openModal === "money" || showReferralModal || showProfile;

    dashboard.classList.toggle("modal-lock", isAnyModalOpen);

    return () => dashboard.classList.remove("modal-lock");
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

      {openModal === "money" && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            <Money onClose={() => setOpenModal(null)} />
          </div>
        </div>
      )}

      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}

      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInviteClick={() => {
          setActiveTab("invite");
          setShowReferralModal(true);
        }}
        onProfileClick={() => setShowProfile(true)}
      />
    </div>
  );
};

export default Dashboard;

