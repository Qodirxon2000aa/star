import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/pages/Dashboard";
import WelcomeAnimation from "./components/WelcomeAnimation";
import { TelegramProvider } from "../context/TelegramContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // 🔥 Animatsiya tugaganda chaqiriladi
  const handleFinish = () => {
    setShowWelcome(false);
  };

  // 🔥 1-qadam: faqat animation
  if (showWelcome) {
    return <WelcomeAnimation onFinish={handleFinish} />;
  }

  // 🔥 2-qadam: asosiy ilova
  return (
    <TelegramProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <SpeedInsights />
      </Router>
    </TelegramProvider>
  );
}

export default App;
