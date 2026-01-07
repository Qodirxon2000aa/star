import React, { useState } from "react";
import "./Dashboard.css";
import Header from "../pages/Header/Header.jsx";
import Premium from "../pages/premuium/Premium.jsx";
import Stars from "../pages/starts/Stars.jsx";
import Footer from "../Footer/Footer.jsx"; // ← yangi import

const Dashboard = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [openModal, setOpenModal] = useState(null);

  // Footer uchun active tab (hozircha "home" default)
  const [activeTab, setActiveTab] = useState("home");

  // Kelajakda activeTab ga qarab content o'zgartirish mumkin
  // Masalan: activeTab === "profile" ? <Profile /> : ...

  return (
    <div className="dashboard" style={{ paddingBottom: "90px" }}> {/* footer joylashishi uchun */}
      <Header
        isPremium={isPremium}
        setIsPremium={setIsPremium}
        onOpenMoney={() => setOpenModal("money")}
        onOpenLang={() => setOpenModal("lang")}
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

      {/* FOOTER */}
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;