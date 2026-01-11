// Dashboard.jsx – YANGI VERSIYA: Market ochilganda Header yashiriladi
import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";
import Market from "../pages/Market/Market.jsx";

import Footer from "./Footer/Footer.jsx";
import ReferralModal from "./Footer/ReferralModal.jsx";
import Money from "../../components/pages/Money/Money.jsx";
import Profile from "./Footer/Profile.jsx";

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [activeSection, setActiveSection] = useState("home"); // "home" | "market"

  const [openModal, setOpenModal] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Market ochiq bo'lganda headerni yashirish uchun flag
  const isMarketOpen = activeSection === "market";

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
      {/* HEADER faqat "home" bo'limida ko'rinadi */}
      {!isMarketOpen && (
        <Header
          isPremium={isPremium}
          setIsPremium={setIsPremium}
          onOpenMoney={() => setOpenModal("money")}
        />
      )}

      {/* MARKET ochiq bo'lganda o'z ichida Header bo'lishi mumkin (ixtiyoriy) */}
      {/* Agar Market komponentida alohida header kerak bo'lsa, uni Market.jsx ga qo'shing */}

      {/* MARKAZIY QISM */}
      <div className={`dashboard-main ${isMarketOpen ? "market-full" : ""}`}>
        {activeSection === "home" && (
          <div className="dashboard-content">
            {isPremium ? <Premium /> : <Stars />}
          </div>
        )}

        {activeSection === "market" && (
          <div className="dashboard-content market-page">
            <Market />
          </div>
        )}
      </div>

      {/* MONEY MODAL */}
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

      {/* FOOTER har doim pastda, Marketda ham ko'rinadi */}
      <Footer
        activeSection={activeSection}
        onHomeClick={() => setActiveSection("home")}
        onMarketClick={() => setActiveSection("market")}
        onInviteClick={() => {
          setActiveSection("home");
          setShowReferralModal(true);
        }}
        onProfileClick={() => setShowProfile(true)}
      />
    </div>
  );
};

export default Dashboard;