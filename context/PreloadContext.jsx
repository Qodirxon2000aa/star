import React, { createContext, useContext, useEffect, useState } from "react";

const PreloadContext = createContext();
export const usePreload = () => useContext(PreloadContext);

const VIDEO_URLS = [
  "/assets/Telegram.mp4",
  "/assets/prem.mp4",
];

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

    const preloadVideos = () =>
      Promise.all(
        VIDEO_URLS.map(
          (src) =>
            new Promise((resolve) => {
              const video = document.createElement("video");
              video.src = src;
              video.preload = "auto";
              video.onloadeddata = resolve;
              video.onerror = resolve;
            })
        )
      );

    const preloadAll = async () => {
      try {
        await Promise.all([
          preloadVideos(),
          Promise.all(API_CALLS),
        ]);
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
