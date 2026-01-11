import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/pages/Dashboard";
import { TelegramProvider } from "../context/TelegramContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {


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
