import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Gifts from "./components/pages/Gifts/Gifts";

import { TelegramProvider } from "../context/TelegramContext";
import { PreloadProvider, usePreload } from "../context/PreloadContext";

import WelcomeAnimation from "./components/WelcomeAnimation";
import { SpeedInsights } from "@vercel/speed-insights/react";

const AppContent = () => {
  const { ready } = usePreload();

  // 🔥 PRELOAD TUGAMAGUNCHA FAQAT VIDEO
  if (!ready) return <WelcomeAnimation />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* ixtiyoriy */}
      <SpeedInsights />
    </Router>
  );
};

function App() {
  return (
    <TelegramProvider>
      <PreloadProvider>
        <AppContent />
      </PreloadProvider>
    </TelegramProvider>
  );
}

export default App;
