import React, { useState } from "react";
import "./Dashboard.css";
import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";
import Footer from "../Footer/Footer.jsx";
import ReferralModal from "../Footer/ReferralModal.jsx"; // ← Modalni import qiling

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  const [activeTab, setActiveTab] = useState("home");

  // Referral modal holati
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Taklif qilish tugmasi bosilganda chaqiriladigan funksiya
  const handleInviteClick = () => {
    setActiveTab("invite"); // footerda aktiv ko‘rsatish uchun (ixtiyoriy)
    setShowReferralModal(true); // modalni ochish
  };

  return (
    <div className="dashboard" style={{ paddingBottom: "90px" }}>
      <Header
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onOpenMoney={() => setOpenModal("money")}
        onOpenLang={() => setOpenModal("lang")}
      />

      <div className="dashboard-content">
        {isPremium ? <Premium /> : <Stars />}
      </div>

      {/* Mavjud modal (pul yoki til) */}
      {openModal === "money" && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal-center" onClick={(e) => e.stopPropagation()}>
            {/* <Money onClose={() => setOpenModal(null)} /> */}
          </div>
        </div>
      )}

      {/* YANGI: Referral Modal (pastdan chiqadigan) */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />

      {/* FOOTER — onInviteClick uzatildi! */}
      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInviteClick={handleInviteClick}  // <<< Bu joy muhim!
      />
    </div>
  );
};

export default Dashboard;