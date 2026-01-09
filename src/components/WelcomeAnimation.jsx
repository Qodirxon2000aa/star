import React from "react";
import Lottie from "lottie-react";
import "./WelcomeAnimation.css";
import animationData from "../assets/animation.json";

const WelcomeAnimation = ({ onFinish }) => {
  return (
    <div className="welcome-screen">
      <div className="video-box">
        <Lottie
          animationData={animationData}
          loop={false}          // 🔴 video kabi 1 marta
          autoplay
          onComplete={() => onFinish?.()} // ✅ video onEnded o‘rniga
        />
      </div>
    </div>
  );
};

export default WelcomeAnimation;
