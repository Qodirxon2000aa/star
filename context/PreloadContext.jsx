import React, { createContext, useContext, useEffect, useState } from "react";

const PreloadContext = createContext();
export const usePreload = () => useContext(PreloadContext);

// Faqat API preload
const API_CALLS = [
  fetch("https://tezpremium.uz/webapp/settings.php"),
  // boshqa API bo‘lsa shu yerga qo‘sh
];

export const PreloadProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1 marta ishlashi uchun
    if (sessionStorage.getItem("app_ready") === "1") {
      setReady(true);
      return;
    }

    const preloadAll = async () => {
      try {
        await Promise.all(API_CALLS);
      } catch (e) {
        console.warn("Preload error:", e);
      } finally {
        sessionStorage.setItem("app_ready", "1");
        setReady(true);
      }
    };

    preloadAll();
  }, []);

  return (
    <PreloadContext.Provider value={{ ready }}>
      {children}
    </PreloadContext.Provider>
  );
};
