import React from "react";
import "./WelcomeAnimation.css";
import video from "../assets/anime.mp4"; // ❗ faqat mp4

const WelcomeAnimation = ({ onFinish }) => {
  return (
    <div className="welcome-screen">
      <video
        className="welcome-video"
        src={video}
        autoPlay
        muted
        playsInline
        onEnded={() => onFinish?.()} // ✅ SAFE
      />
    </div>
  );
};

export default WelcomeAnimation;
