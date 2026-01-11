// Dashboard.jsx – FINAL VERSION (100% OPTIMIZED, NO LAG)
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

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [openModal, setOpenModal] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // 🔥 WELCOME STATE
  const [showWelcome, setShowWelcome] = useState(false);
  const finishedRef = useRef(false);

  // 🔥 animation.json async yuklanadi
  const [animationData, setAnimationData] = useState(null);

  const isMarketOpen = activeSection === "market";

  /* ===============================
     🔐 MODAL SCROLL LOCK
  =============================== */
  useEffect(() => {
    const dashboard = document.querySelector(".dashboard");
    if (!dashboard) return;

    const locked =
      openModal === "money" || showReferralModal || showProfile;

    dashboard.classList.toggle("modal-lock", locked);

    return () => dashboard.classList.remove("modal-lock");
  }, [openModal, showReferralModal, showProfile]);

  /* ===============================
     🚀 WELCOME FAqat 1 MARTA
  =============================== */
  useEffect(() => {
    const shown = sessionStorage.getItem("welcome_shown");
    if (!shown) {
      setShowWelcome(true);

      // JSON NI ASYNC YUKLAYMIZ (UI BLOKLANMAYDI)
      import("../../assets/animation.json").then((data) => {
        setAnimationData(data.default);
      });
    }
  }, []);

  const handleAnimationComplete = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    sessionStorage.setItem("welcome_shown", "1");
    setShowWelcome(false);
  };

  return (
    <>
      {/* ================= WELCOME SCREEN ================= */}
      {showWelcome && (
        <div className="welcome-screen">
          <div className="video-box">
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={false}
                autoplay
                onComplete={handleAnimationComplete}
              />
            )}
          </div>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      {!showWelcome && (
        <div className="dashboard">
          {/* HEADER */}
          {!isMarketOpen && (
            <Header
              isPremium={isPremium}
              setIsPremium={setIsPremium}
              onOpenMoney={() => setOpenModal("money")}
            />
          )}

          {/* MAIN */}
          <div
            className={`dashboard-main ${
              isMarketOpen ? "market-full" : ""
            }`}
          >
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
            <div
              className="modal-overlay"
              onClick={() => setOpenModal(null)}
            >
              <div
                className="modal-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Money onClose={() => setOpenModal(null)} />
              </div>
            </div>
          )}

          {/* REFERRAL */}
          <ReferralModal
            isOpen={showReferralModal}
            onClose={() => setShowReferralModal(false)}
          />

          {/* PROFILE */}
          {showProfile && (
            <Profile onClose={() => setShowProfile(false)} />
          )}

          {/* FOOTER */}
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
