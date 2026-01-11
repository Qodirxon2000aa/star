// Dashboard.jsx – YANGI VERSIYA: Welcome animatsiyasi Dashboard ichida, alohida komponent emas
import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import "./Dashboard.css";

import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";
import Market from "../pages/Market/Market.jsx";

import Footer from "./Footer/Footer.jsx";
import ReferralModal from "./Footer/ReferralModal.jsx";
import Money from "../../components/pages/Money/Money.jsx";
import Profile from "./Footer/Profile.jsx";

import animationData from "../../assets/animation.json"; // animation.json ni import qilamiz

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [activeSection, setActiveSection] = useState("home"); // "home" | "market"

  const [openModal, setOpenModal] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Welcome animatsiyasi uchun state
  const [showWelcome, setShowWelcome] = useState(true);

  // Market ochiq bo'lganda headerni yashirish uchun flag
  const isMarketOpen = activeSection === "market";

  // Animatsiya tugaganda chaqiriladigan funksiya uchun ref (qayta chaqirilishdan himoya)
  const finishedRef = useRef(false);

  useEffect(() => {
    const dashboard = document.querySelector(".dashboard");
    if (!dashboard) return;

    const isAnyModalOpen =
      openModal === "money" || showReferralModal || showProfile;

    dashboard.classList.toggle("modal-lock", isAnyModalOpen);

    return () => dashboard.classList.remove("modal-lock");
  }, [openModal, showReferralModal, showProfile]);

  // Animatsiya tugaganda welcome screen ni yashirish
  const handleAnimationComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    setTimeout(() => {
      setShowWelcome(false);
    }, 0);
  };

  return (
    <>
      {/* WELCOME ANIMATSIYASI – faqat bir marta, app ochilganda */}
      {showWelcome && (
        <div className="welcome-screen">
          <div className="video-box">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay
              onComplete={handleAnimationComplete}
            />
          </div>
        </div>
      )}

      {/* ASOSIY DASHBOARD – welcome tugagach ko'rinadi */}
      {!showWelcome && (
        <div className="dashboard">
          {/* HEADER faqat "home" bo'limida ko'rinadi */}
          {!isMarketOpen && (
            <Header
              isPremium={isPremium}
              setIsPremium={setIsPremium}
              onOpenMoney={() => setOpenModal("money")}
            />
          )}

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

          {/* FOOTER har doim pastda */}
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
      )}
    </>
  );
};

export default Dashboard;